from app.db.database import engine, Base
from app.models import user 
from app.models import post
from app.models import like

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
