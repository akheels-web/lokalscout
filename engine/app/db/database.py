"""
SQLite database layer for LokalScout pre-crawled data cache.
Zero-cost, zero-infrastructure persistent storage.
"""

import sqlite3
import json
import os
import logging
from pathlib import Path
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta

logger = logging.getLogger("lokalscout.db")

# Store the DB file in the engine directory alongside the app
DB_PATH = os.getenv("LOKALSCOUT_DB_PATH", str(Path(__file__).parent.parent.parent / "data" / "lokalscout_cache.db"))


_schema_initialized = False


def _create_schema(conn: sqlite3.Connection):
    """Creates all tables and indexes if they don't exist."""
    conn.executescript("""
        -- Real competitors crawled from Google Places API + Overpass
        CREATE TABLE IF NOT EXISTS competitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            locality TEXT NOT NULL,
            city TEXT NOT NULL,
            vertical TEXT NOT NULL,
            name TEXT NOT NULL,
            google_place_id TEXT,
            lat REAL,
            lng REAL,
            google_rating REAL,
            review_count INTEGER DEFAULT 0,
            price_level INTEGER,
            address TEXT,
            distance_km REAL,
            complaints TEXT DEFAULT '[]',
            strengths TEXT DEFAULT '[]',
            source TEXT DEFAULT 'overpass',
            crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_comp_locality_vertical 
            ON competitors(locality, city, vertical);

        -- POI Anchors (tech parks, metro, malls, colleges, hospitals)
        CREATE TABLE IF NOT EXISTS poi_anchors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            locality TEXT NOT NULL,
            city TEXT NOT NULL,
            osm_id TEXT,
            name TEXT NOT NULL,
            category TEXT,
            lat REAL,
            lng REAL,
            distance_from_center_km REAL,
            impact_level TEXT DEFAULT 'Medium',
            crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_poi_locality 
            ON poi_anchors(locality, city);

        -- Commercial rent listings (scraped from MagicBricks/99acres)
        CREATE TABLE IF NOT EXISTS rent_listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            locality TEXT NOT NULL,
            city TEXT NOT NULL,
            source TEXT,
            source_url TEXT,
            carpet_area_sqft INTEGER,
            asking_rent_monthly INTEGER,
            rent_per_sqft INTEGER,
            deposit_months INTEGER,
            floor TEXT,
            property_type TEXT DEFAULT 'shop',
            crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_rent_locality 
            ON rent_listings(locality, city);

        -- Google search trends & local search volume estimates
        CREATE TABLE IF NOT EXISTS search_trends (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            locality TEXT NOT NULL,
            city TEXT NOT NULL,
            vertical TEXT NOT NULL,
            monthly_searches INTEGER DEFAULT 0,
            growth_yoy_pct REAL DEFAULT 0.0,
            peak_season TEXT,
            trend_direction TEXT DEFAULT 'stable',
            source TEXT DEFAULT 'pytrends',
            crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(locality, city, vertical)
        );

        CREATE INDEX IF NOT EXISTS idx_trends_locality 
            ON search_trends(locality, city, vertical);

        -- Crawl status tracker (knows when each locality×vertical was last crawled)
        CREATE TABLE IF NOT EXISTS crawl_status (
            locality TEXT NOT NULL,
            city TEXT NOT NULL,
            vertical TEXT NOT NULL DEFAULT '_all',
            stream TEXT NOT NULL,
            last_crawled_at TIMESTAMP,
            record_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'pending',
            PRIMARY KEY(locality, city, vertical, stream)
        );
    """)
    conn.commit()


def get_connection() -> sqlite3.Connection:
    """Returns a SQLite connection with WAL mode for concurrent reads, ensuring schema exists."""
    global _schema_initialized
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    if not _schema_initialized:
        try:
            _create_schema(conn)
            _schema_initialized = True
        except Exception as e:
            logger.warning(f"Schema initialization warning: {e}")
    return conn


def init_database():
    """Explicitly creates all tables if they don't exist. Safe to call on every startup."""
    conn = get_connection()
    try:
        _create_schema(conn)
        logger.info(f"Database initialized at {DB_PATH}")
    finally:
        conn.close()


# ─────────────────────────────────────────────
#  Competitor CRUD
# ─────────────────────────────────────────────

def is_competitor_data_fresh(locality: str, city: str, vertical: str, max_age_days: int = 7) -> bool:
    """Checks if we have recent competitor data for this locality+vertical."""
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT last_crawled_at FROM crawl_status WHERE locality=? AND city=? AND vertical=? AND stream='competitors'",
            (locality.lower(), city.lower(), vertical.lower())
        ).fetchone()
        if not row or not row["last_crawled_at"]:
            return False
        last_crawled = datetime.fromisoformat(row["last_crawled_at"])
        return (datetime.now() - last_crawled) < timedelta(days=max_age_days)
    finally:
        conn.close()


def save_competitors(locality: str, city: str, vertical: str, competitors: List[Dict[str, Any]]):
    """Saves crawled competitor data, replacing old entries for this locality+vertical."""
    conn = get_connection()
    try:
        # Clear old data for this combination
        conn.execute(
            "DELETE FROM competitors WHERE locality=? AND city=? AND vertical=?",
            (locality.lower(), city.lower(), vertical.lower())
        )
        for c in competitors:
            conn.execute("""
                INSERT INTO competitors (locality, city, vertical, name, google_place_id, lat, lng,
                    google_rating, review_count, price_level, address, distance_km, complaints, strengths, source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                locality.lower(), city.lower(), vertical.lower(),
                c.get("name", "Unknown"),
                c.get("google_place_id"),
                c.get("lat"), c.get("lng"),
                c.get("google_rating"),
                c.get("review_count", 0),
                c.get("price_level"),
                c.get("address"),
                c.get("distance_km"),
                json.dumps(c.get("complaints", [])),
                json.dumps(c.get("strengths", [])),
                c.get("source", "overpass")
            ))
        # Update crawl status
        conn.execute("""
            INSERT OR REPLACE INTO crawl_status (locality, city, vertical, stream, last_crawled_at, record_count, status)
            VALUES (?, ?, ?, 'competitors', ?, ?, 'success')
        """, (locality.lower(), city.lower(), vertical.lower(), datetime.now().isoformat(), len(competitors)))
        conn.commit()
        logger.info(f"Saved {len(competitors)} competitors for {vertical} in {locality}, {city}")
    finally:
        conn.close()


def load_competitors(locality: str, city: str, vertical: str) -> List[Dict[str, Any]]:
    """Loads cached competitor data from the database."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM competitors WHERE locality=? AND city=? AND vertical=? ORDER BY distance_km ASC",
            (locality.lower(), city.lower(), vertical.lower())
        ).fetchall()
        results = []
        for row in rows:
            results.append({
                "name": row["name"],
                "google_place_id": row["google_place_id"],
                "lat": row["lat"],
                "lng": row["lng"],
                "google_rating": row["google_rating"],
                "review_count": row["review_count"],
                "price_level": row["price_level"],
                "address": row["address"],
                "distance_km": row["distance_km"],
                "complaints": json.loads(row["complaints"]) if row["complaints"] else [],
                "strengths": json.loads(row["strengths"]) if row["strengths"] else [],
                "source": row["source"],
            })
        return results
    finally:
        conn.close()


# ─────────────────────────────────────────────
#  POI Anchor CRUD
# ─────────────────────────────────────────────

def is_poi_data_fresh(locality: str, city: str, max_age_days: int = 14) -> bool:
    """Checks if we have recent POI data for this locality."""
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT last_crawled_at FROM crawl_status WHERE locality=? AND city=? AND vertical='_all' AND stream='poi'",
            (locality.lower(), city.lower())
        ).fetchone()
        if not row or not row["last_crawled_at"]:
            return False
        last_crawled = datetime.fromisoformat(row["last_crawled_at"])
        return (datetime.now() - last_crawled) < timedelta(days=max_age_days)
    finally:
        conn.close()


def save_poi_anchors(locality: str, city: str, anchors: List[Dict[str, Any]]):
    """Saves crawled POI anchor data."""
    conn = get_connection()
    try:
        conn.execute("DELETE FROM poi_anchors WHERE locality=? AND city=?", (locality.lower(), city.lower()))
        for a in anchors:
            conn.execute("""
                INSERT INTO poi_anchors (locality, city, osm_id, name, category, lat, lng, distance_from_center_km, impact_level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                locality.lower(), city.lower(),
                a.get("osm_id"), a.get("name"), a.get("category"),
                a.get("lat"), a.get("lng"),
                a.get("distance_km"), a.get("impact_level", "Medium")
            ))
        conn.execute("""
            INSERT OR REPLACE INTO crawl_status (locality, city, vertical, stream, last_crawled_at, record_count, status)
            VALUES (?, ?, '_all', 'poi', ?, ?, 'success')
        """, (locality.lower(), city.lower(), datetime.now().isoformat(), len(anchors)))
        conn.commit()
        logger.info(f"Saved {len(anchors)} POI anchors for {locality}, {city}")
    finally:
        conn.close()


def load_poi_anchors(locality: str, city: str) -> List[Dict[str, Any]]:
    """Loads cached POI anchors from the database."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM poi_anchors WHERE locality=? AND city=? ORDER BY distance_from_center_km ASC",
            (locality.lower(), city.lower())
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


# ─────────────────────────────────────────────
#  Rent Listings CRUD
# ─────────────────────────────────────────────

def is_rent_data_fresh(locality: str, city: str, max_age_days: int = 14) -> bool:
    """Checks if we have recent rent listing data."""
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT last_crawled_at FROM crawl_status WHERE locality=? AND city=? AND vertical='_all' AND stream='rent'",
            (locality.lower(), city.lower())
        ).fetchone()
        if not row or not row["last_crawled_at"]:
            return False
        last_crawled = datetime.fromisoformat(row["last_crawled_at"])
        return (datetime.now() - last_crawled) < timedelta(days=max_age_days)
    finally:
        conn.close()


def save_rent_listings(locality: str, city: str, listings: List[Dict[str, Any]]):
    """Saves crawled rent listing data."""
    conn = get_connection()
    try:
        conn.execute("DELETE FROM rent_listings WHERE locality=? AND city=?", (locality.lower(), city.lower()))
        for r in listings:
            conn.execute("""
                INSERT INTO rent_listings (locality, city, source, source_url, carpet_area_sqft,
                    asking_rent_monthly, rent_per_sqft, deposit_months, floor, property_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                locality.lower(), city.lower(),
                r.get("source"), r.get("source_url"),
                r.get("carpet_area_sqft"), r.get("asking_rent_monthly"),
                r.get("rent_per_sqft"), r.get("deposit_months"),
                r.get("floor"), r.get("property_type", "shop")
            ))
        conn.execute("""
            INSERT OR REPLACE INTO crawl_status (locality, city, vertical, stream, last_crawled_at, record_count, status)
            VALUES (?, ?, '_all', 'rent', ?, ?, 'success')
        """, (locality.lower(), city.lower(), datetime.now().isoformat(), len(listings)))
        conn.commit()
        logger.info(f"Saved {len(listings)} rent listings for {locality}, {city}")
    finally:
        conn.close()


def load_rent_listings(locality: str, city: str) -> List[Dict[str, Any]]:
    """Loads cached rent listings from the database."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM rent_listings WHERE locality=? AND city=? ORDER BY rent_per_sqft ASC",
            (locality.lower(), city.lower())
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_median_rent_per_sqft(locality: str, city: str) -> Optional[int]:
    """Returns the median rent per sqft from cached listings, or None if no data."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT rent_per_sqft FROM rent_listings WHERE locality=? AND city=? AND rent_per_sqft > 0 ORDER BY rent_per_sqft",
            (locality.lower(), city.lower())
        ).fetchall()
        if not rows:
            return None
        values = [row["rent_per_sqft"] for row in rows]
        mid = len(values) // 2
        return values[mid]
    finally:
        conn.close()


# ─────────────────────────────────────────────
#  Crawl Status Utilities
# ─────────────────────────────────────────────

def get_all_crawled_localities() -> List[Dict[str, str]]:
    """Returns all locality+city combinations that have been crawled at least once."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT DISTINCT locality, city FROM crawl_status WHERE status='success' ORDER BY locality"
        ).fetchall()
        return [{"locality": row["locality"], "city": row["city"]} for row in rows]
    finally:
        conn.close()


def get_stale_entries(stream: str, max_age_days: int = 7) -> List[Dict[str, str]]:
    """Returns locality+city+vertical combinations that need re-crawling."""
    conn = get_connection()
    try:
        cutoff = (datetime.now() - timedelta(days=max_age_days)).isoformat()
        rows = conn.execute(
            "SELECT locality, city, vertical FROM crawl_status WHERE stream=? AND last_crawled_at < ?",
            (stream, cutoff)
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


# ─────────────────────────────────────────────
#  Search Trends CRUD
# ─────────────────────────────────────────────

def is_search_trends_fresh(locality: str, city: str, vertical: str, max_age_days: int = 14) -> bool:
    """Checks if we have recent search trends data for locality+vertical."""
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT crawled_at FROM search_trends WHERE locality=? AND city=? AND vertical=?",
            (locality.lower(), city.lower(), vertical.lower())
        ).fetchone()
        if not row or not row["crawled_at"]:
            return False
        try:
            last_crawled = datetime.fromisoformat(row["crawled_at"])
            return (datetime.now() - last_crawled) < timedelta(days=max_age_days)
        except Exception:
            return True
    finally:
        conn.close()


def save_search_trends(locality: str, city: str, vertical: str, trend_data: Dict[str, Any]):
    """Saves or updates search trends data."""
    conn = get_connection()
    try:
        conn.execute("""
            INSERT OR REPLACE INTO search_trends 
                (locality, city, vertical, monthly_searches, growth_yoy_pct, peak_season, trend_direction, source, crawled_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            locality.lower(), city.lower(), vertical.lower(),
            trend_data.get("monthly_searches", 0),
            trend_data.get("growth_yoy_pct", 0.0),
            trend_data.get("peak_season", "Year-round"),
            trend_data.get("trend_direction", "Stable"),
            trend_data.get("source", "pytrends"),
            datetime.now().isoformat()
        ))
        conn.execute("""
            INSERT OR REPLACE INTO crawl_status (locality, city, vertical, stream, last_crawled_at, record_count, status)
            VALUES (?, ?, ?, 'trends', ?, 1, 'success')
        """, (locality.lower(), city.lower(), vertical.lower(), datetime.now().isoformat()))
        conn.commit()
    finally:
        conn.close()


def load_search_trends(locality: str, city: str, vertical: str) -> Optional[Dict[str, Any]]:
    """Loads cached search trends for locality+vertical."""
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM search_trends WHERE locality=? AND city=? AND vertical=?",
            (locality.lower(), city.lower(), vertical.lower())
        ).fetchone()
        if row:
            return dict(row)
        return None
    finally:
        conn.close()


# ─────────────────────────────────────────────
#  Database Health & Diagnostic Statistics
# ─────────────────────────────────────────────

def get_database_stats() -> Dict[str, Any]:
    """Returns high-level statistics about the SQLite data cache."""
    conn = get_connection()
    try:
        comp_count = conn.execute("SELECT COUNT(*) as count FROM competitors").fetchone()["count"]
        poi_count = conn.execute("SELECT COUNT(*) as count FROM poi_anchors").fetchone()["count"]
        rent_count = conn.execute("SELECT COUNT(*) as count FROM rent_listings").fetchone()["count"]
        trend_count = conn.execute("SELECT COUNT(*) as count FROM search_trends").fetchone()["count"]
        localities = conn.execute("SELECT DISTINCT locality, city FROM crawl_status WHERE status='success'").fetchall()
        
        return {
            "competitors_cached": comp_count,
            "poi_anchors_cached": poi_count,
            "rent_listings_cached": rent_count,
            "search_trends_cached": trend_count,
            "unique_localities_crawled": len(localities),
            "db_path": DB_PATH,
            "db_size_bytes": os.path.getsize(DB_PATH) if os.path.exists(DB_PATH) else 0,
        }
    finally:
        conn.close()
