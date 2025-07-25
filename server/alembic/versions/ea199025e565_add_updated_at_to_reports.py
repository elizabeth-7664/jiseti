"""Add updated_at to reports

Revision ID: ea199025e565
Revises: 185ec0530cc9
Create Date: 2025-07-23 13:29:25.938844
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import datetime

# revision identifiers, used by Alembic.
revision: str = 'ea199025e565'
down_revision: Union[str, None] = '185ec0530cc9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Step 1: Add column as nullable
    op.add_column('reports', sa.Column('updated_at', sa.DateTime(), nullable=True))

    # Step 2: Set current timestamp for existing rows
    op.execute(
        f"UPDATE reports SET updated_at = '{datetime.datetime.utcnow().isoformat()}'"
    )

    # Step 3: Set column as NOT NULL
    op.alter_column('reports', 'updated_at', nullable=False)


def downgrade() -> None:
    op.drop_column('reports', 'updated_at')
