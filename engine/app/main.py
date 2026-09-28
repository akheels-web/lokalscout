import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import search, feasibility, compare, payments, watchdog

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("lokalscout")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hyperlocal Business Feasibility & Commercial Location Intelligence Platform"
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
