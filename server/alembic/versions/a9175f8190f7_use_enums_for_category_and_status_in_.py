"""Use enums for category and status in reports

Revision ID: a9175f8190f7
Revises: fc7efb42d800
Create Date: 2025-07-28 18:15:33.548027
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a9175f8190f7'
down_revision: Union[str, None] = 'fc7efb42d800'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

recordtype = sa.Enum('red-flag', 'intervention', name='recordtype')
reportstatus = sa.Enum('draft', 'under-investigation', 'rejected', 'resolved', name='reportstatus')

def upgrade() -> None:
    # Create ENUM types
    recordtype.create(op.get_bind(), checkfirst=True)
    reportstatus.create(op.get_bind(), checkfirst=True)

    # Clean invalid existing data (or convert them)
    op.execute("DELETE FROM reports WHERE category NOT IN ('red-flag', 'intervention')")
    op.execute("DELETE FROM reports WHERE status NOT IN ('draft', 'under-investigation', 'rejected', 'resolved')")

    # Alter columns with explicit cast using `USING`
    op.execute("""
        ALTER TABLE reports 
        ALTER COLUMN category 
        TYPE recordtype 
        USING category::text::recordtype
    """)
    op.execute("""
        ALTER TABLE reports 
        ALTER COLUMN status 
        TYPE reportstatus 
        USING status::text::reportstatus
    """)

def downgrade() -> None:
    op.execute("""
        ALTER TABLE reports 
        ALTER COLUMN status 
        TYPE VARCHAR(50)
        USING status::text
    """)
    op.execute("""
        ALTER TABLE reports 
        ALTER COLUMN category 
        TYPE VARCHAR(50)
        USING category::text
    """)

    reportstatus.drop(op.get_bind(), checkfirst=True)
    recordtype.drop(op.get_bind(), checkfirst=True)
