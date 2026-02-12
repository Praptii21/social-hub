from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, likes, posts, comments, follow as follow_api
from app.models import user, post, like, follow as follow_model, comment
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)


app = FastAPI(title="Social Media API")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite
        "http://localhost:3000",  # CRA (safe to keep)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(likes.router)  # Include likes router
app.include_router(posts.router)  # Include posts router
app.include_router(comments.router)  # Include comments router
app.include_router(follow_api.router)  # Include follows router


@app.get("/")
def prapti():
    return {"message": "Welcome to the Social Media API!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

