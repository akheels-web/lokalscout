import logging
import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db.database import init_database
from .routers import search, feasibility, compare, payments, watchdog, crawler_admin

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("lokalscout")

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure SQLite cache schema and tables are initialized
    init_database()
    logger.info("LokalScout Engine & SQLite persistent cache initialized.")
    yield
    logger.info("LokalScout Engine shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hyperlocal Business Feasibility & Commercial Location Intelligence Platform",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Routers under API prefix
app.include_router(search.router, prefix=settings.API_PREFIX)
app.include_router(feasibility.router, prefix=settings.API_PREFIX)
app.include_router(compare.router, prefix=settings.API_PREFIX)
app.include_router(payments.router, prefix=settings.API_PREFIX)
app.include_router(watchdog.router, prefix=settings.API_PREFIX)
app.include_router(crawler_admin.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "healthy",
        "docs": "/docs"
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "operational",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("engine.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
