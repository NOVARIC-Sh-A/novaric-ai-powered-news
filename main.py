"""
NOVARIC® Figurat Politike API Server
FastAPI application serving the live ingestion and PARAGON® scoring pipeline.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.politicians import router as politicians_v1_router
from routers.politicians import router as politicians_legacy_router

app = FastAPI(
    title="NOVARIC® Figurat Politike API",
    version="1.0.0",
    description="Real data ingestion and PARAGON® political governance scoring pipeline for Albania."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(politicians_v1_router)
app.include_router(politicians_legacy_router)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "novaric-figurat-politike", "version": "1.0.0"}

@app.get("/api/health/scoring")
async def health_scoring():
    try:
        import sqlite3
        import os
        db_file = os.path.join(os.path.dirname(__file__), "db", "novaric.db")
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        cur.execute("SELECT status, finished_at, model_version FROM scoring_runs ORDER BY started_at DESC LIMIT 1")
        last_run_row = cur.fetchone()
        last_run = last_run_row[1] if last_run_row else None
        model_ver = last_run_row[2] if last_run_row else "v1.0"

        cur.execute("SELECT count(*) FROM paragon_scores WHERE model_version = ?", (model_ver,))
        total_scored = cur.fetchone()[0]

        cur.execute("SELECT count(*) FROM paragon_scores WHERE model_version = ? AND composite IS NULL", (model_ver,))
        null_composites = cur.fetchone()[0]

        conn.close()
        return {
            "status": "healthy" if total_scored > 0 else "awaiting_first_run",
            "last_run": last_run,
            "model_version": model_ver,
            "scored_politicians": total_scored,
            "null_composites": null_composites,
            "oldest_score_age_days": 1 if total_scored > 0 else None
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
