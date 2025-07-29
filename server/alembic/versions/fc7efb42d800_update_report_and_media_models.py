"""Update report and media models

Revision ID: fc7efb42d800
Revises: 155ecee52886
Create Date: 2025-07-28 17:46:24.793295
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'fc7efb42d800'
down_revision: Union[str, None] = '155ecee52886'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Nothing to do here — actual schema changes are in the next revision
    pass

def downgrade() -> None:
    # Nothing to undo here
    pass
