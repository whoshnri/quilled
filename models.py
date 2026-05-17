from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_caching import Cache
from tools import timestamp
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from datetime import datetime, timezone, timedelta
from slugify import slugify
import re
#import the module to calculate time ago or assign it directly
from flask import Flask, send_from_directory
import os
import socket
from dotenv import load_dotenv
from sqlalchemy.engine.url import make_url
load_dotenv()


# In app.py
def create_app():
    app = Flask(__name__, static_folder="./frontend/dist", static_url_path="")
    # configuration
    return app

app = create_app()

def resolve_database_uri():
    database_url = os.environ.get('DATABASE_URL', '').strip()
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    # Render/prod should fail loudly if database connectivity is broken.
    is_production = (
        os.environ.get("RENDER", "").lower() == "true"
        or os.environ.get("FLASK_ENV", "").lower() == "production"
    )

    if not database_url:
        os.makedirs(app.instance_path, exist_ok=True)
        return f"sqlite:///{os.path.join(app.instance_path, 'local-dev.db')}"

    if not is_production:
        parsed_url = make_url(database_url)
        host = parsed_url.host
        if host:
            try:
                socket.getaddrinfo(host, None)
            except socket.gaierror:
                os.makedirs(app.instance_path, exist_ok=True)
                fallback_uri = f"sqlite:///{os.path.join(app.instance_path, 'local-dev.db')}"
                print(
                    f"WARNING: Could not resolve database host '{host}'. "
                    f"Using local SQLite fallback at {fallback_uri}."
                )
                return fallback_uri

    return database_url

app.config['SQLALCHEMY_DATABASE_URI'] = resolve_database_uri()
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "pool_pre_ping": True,
    "pool_recycle": 1800,
}
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 0
app.config["JWT_SECRET_KEY"] = "@as5XIUdc"
app.config["JWT_BLACKLIST_ENABLED"] = True
app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return db.session.query(TokenBlocklist.id).filter_by(jti=jti).first() is not None
cache = Cache(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)


# --- Password Hashing ---
def hash_password(string):
    return bcrypt.generate_password_hash(string).decode('utf-8')

# --- Password unHashing
def verify_password(plain_password, hashed_password):
    return bcrypt.check_password_hash(hashed_password, plain_password)


class User(db.Model):
    __tablename__ = 'user'
    username = db.Column(db.String(50), nullable=False , unique=True)
    uuid = db.Column(db.String(200), primary_key=True, unique=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    pfp = db.Column(db.LargeBinary, nullable=True)
    posts = db.relationship('Blog', backref='user', lazy=True)
    logged = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, username, email, password, uuid):
        self.username = username
        self.email = email
        self.password = password
        self.uuid = uuid


class Blog(db.Model):
    __tablename__ = 'blog'
    id = db.Column(db.Integer, primary_key=True)
    pid = db.Column(db.String(200))
    title = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(50), db.ForeignKey('user.username'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    views = db.Column(db.Integer, nullable=False, default=0)
    likes = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False)
    posted_on = db.Column(db.String, nullable=False)


    def __init__(self, author, category, content, title, posted_on, desc):
        self.author = author
        self.category = category
        self.content = content
        self.title = title
        self.posted_on = posted_on
        self.created_at = datetime.now(timezone.utc)
        self.pid = slugify(title)
        self.desc = desc




class Comments(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    blog_pid = db.Column(db.String)
    comment = db.Column(db.String(), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.String, nullable=False)

    def __init__(self, blog_pid,name, timestamp, comment):
        self.blog_pid = blog_pid
        self.name = name
        self.timestamp = timestamp
        self.comment = comment



class InteractionTracker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_pid = db.Column(db.String)
    ip_address = db.Column(db.String(100))
    day = db.Column(db.String, nullable=False)
    interaction_type = db.Column(db.String(10))


    def __init__(self, blog_pid,ip_address,interaction_type,):
        self.blog_pid = blog_pid
        self.ip_address = ip_address
        self.interaction_type = interaction_type
        self.day = timestamp()

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Images(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(50), db.ForeignKey('user.username'), nullable=False)
    content = db.Column(db.LargeBinary , nullable=False)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)





