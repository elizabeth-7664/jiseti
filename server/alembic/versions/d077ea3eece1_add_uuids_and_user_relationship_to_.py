"""Add UUIDs and user relationship to comments

Revision ID: d077ea3eece1
Revises: 2d5c549f7d8e
Create Date: 2025-07-24 08:21:02.980272
"""

from alembic import op
import sqlalchemy as sa
import uuid


# revision identifiers, used by Alembic.
revision = 'd077ea3eece1'
down_revision = '2d5c549f7d8e'
branch_labels = None
depends_on = None


def upgrade():
    # Drop the old comments table if it exists
    op.drop_table("comments")

    # Recreate comments table with UUID primary key and proper FKs
    op.create_table(
        "comments",
        sa.Column("id", sa.Uuid(), primary_key=True, default=uuid.uuid4),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.Uuid(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("report_id", sa.Uuid(), sa.ForeignKey("reports.id", ondelete="CASCADE")),
    )


def downgrade():
    op.drop_table("comments")

    # Revert back to old comments schema (integer id)
    op.create_table(
        "comments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id")),
        sa.Column("report_id", sa.Uuid(), sa.ForeignKey("reports.id", ondelete="CASCADE")),
    )
