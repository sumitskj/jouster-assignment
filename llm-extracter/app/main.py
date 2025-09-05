from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.api import api_router
from app.config.db import init_db


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


init_db(app)


@app.get("/")
def read_root():
    return {"message": "LLM Extractor API"}
