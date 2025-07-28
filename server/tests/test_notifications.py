import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import create_database, database_exists
from sqlalchemy.pool import StaticPool
from uuid import uuid4

from app.models import Base, Notification
from app.schemas.notification import NotificationCreate
from app.services.notification_service import create_notification, get_notifications_for_user


# Setup in-memory SQLite database
@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_create_notification(db_session):
    user_id = uuid4()
    report_id = uuid4()
    data = NotificationCreate(
        user_id=user_id,
        message="Test notification",
        type="info",
        report_id=report_id
    )

    notification = create_notification(db_session, data)

    assert notification.id is not None
    assert notification.user_id == data.user_id
    assert notification.message == data.message
    assert notification.type == data.type
    assert notification.report_id == data.report_id
    assert notification.created_at is not None


def test_get_notifications_for_user(db_session):
    user_id = uuid4()

    # Create two notifications for the same user
    for i in range(2):
        data = NotificationCreate(
            user_id=user_id,
            message=f"Message {i}",
            type="info",
            report_id=uuid4()
        )
        create_notification(db_session, data)

    # Create one for a different user
    other_user_id = uuid4()
    create_notification(
        db_session,
        NotificationCreate(
            user_id=other_user_id,
            message="Other user message",
            type="info",
            report_id=uuid4()
        )
    )

    # Fetch only notifications for `user_id`
    user_notifications = get_notifications_for_user(db_session, user_id)
    assert len(user_notifications) == 2
    for notif in user_notifications:
        assert notif.user_id == user_id
