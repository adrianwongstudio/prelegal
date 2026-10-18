import sqlite3

from fastapi.testclient import TestClient

from prelegal_backend.db import init_db
from prelegal_backend.main import create_app


def test_init_db_creates_empty_users_table(tmp_path):
    db = tmp_path / "test.db"
    init_db(db)
    with sqlite3.connect(db) as conn:
        assert conn.execute("SELECT COUNT(*) FROM users").fetchone() == (0,)


def test_init_db_recreates_from_scratch(tmp_path):
    db = tmp_path / "test.db"
    init_db(db)
    with sqlite3.connect(db) as conn:
        conn.execute("INSERT INTO users (email, password_hash) VALUES ('a@b.c', 'x')")
    init_db(db)
    with sqlite3.connect(db) as conn:
        assert conn.execute("SELECT COUNT(*) FROM users").fetchone() == (0,)


def test_health_and_db_created_on_startup(tmp_path):
    db = tmp_path / "test.db"
    with TestClient(create_app(db, tmp_path / "missing")) as client:
        assert client.get("/api/health").json() == {"status": "ok"}
    assert db.exists()


def test_serves_static_frontend(tmp_path):
    static = tmp_path / "static"
    (static / "nda").mkdir(parents=True)
    (static / "index.html").write_text("login")
    (static / "nda" / "index.html").write_text("nda")
    with TestClient(create_app(tmp_path / "test.db", static)) as client:
        assert client.get("/").text == "login"
        assert client.get("/nda/").text == "nda"
        assert client.get("/api/health").status_code == 200
