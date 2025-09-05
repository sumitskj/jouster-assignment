import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv


load_dotenv()


OPENAI_KEY = os.getenv("OPENAI_KEY")
DB_URL = os.getenv("DB_URL")