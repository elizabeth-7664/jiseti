import asyncio
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlalchemy import pool
from alembic import context
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Alembic Config object
config = context.config
fileConfig(config.config_file_name)

# Set DB URL from env
DATABASE_URL = os.getenv("DATABASE_URL")
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Import Base metadata
from app.db import Base
from app.models import user, report  # import all models

target_metadata = Base.metadata

def run_migrations_online():
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
    )

    async def run_migrations():
        async with connectable.connect() as connection:
            await connection.run_sync(do_run_migrations)

    def do_run_migrations(sync_connection):
        context.configure(
            connection=sync_connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()

    asyncio.run(run_migrations())

run_migrations_online()
