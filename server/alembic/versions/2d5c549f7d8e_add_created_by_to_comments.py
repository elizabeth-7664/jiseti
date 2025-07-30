"""Add created_by to comments

Revision ID: 2d5c549f7d8e
Revises: ea199025e565
Create Date: 2025-07-24 07:46:58.764245
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2d5c549f7d8e'
down_revision: Union[str, None] = 'ea199025e565'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check if column already exists before adding
    with op.batch_alter_table("comments") as batch_op:
        batch_op.add_column(sa.Column('created_by', sa.Uuid(), nullable=True))
        batch_op.create_foreign_key("fk_created_by_user", "users", ["created_by"], ["id"])


def downgrade() -> None:
    with op.batch_alter_table("comments") as batch_op:
        batch_op.drop_constraint("fk_created_by_user", type_="foreignkey")
        batch_op.drop_column("created_by")
