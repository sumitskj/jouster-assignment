from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

from app.config.properties import DB_URL


def init_db(app: FastAPI) -> None:
    register_tortoise(
        app,
        db_url=DB_URL,
        modules={"models": ["app.entities.analysis"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )


