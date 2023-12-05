import os
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
import sqlalchemy
import simplejson as json
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask import request, session
from flask_session import Session

import sqlite3 as sql

app = Flask(__name__)
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
# app.secret_key = os.getenv("APP_SECRET_KEY")
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
Session(app)
CORS(app, supports_credentials=True)
load_dotenv()

def connect_with_connector() -> sqlalchemy.engine.base.Engine:
    """
    Initializes a connection pool for a Cloud SQL instance of MySQL.

    Uses the Cloud SQL Python Connector package.
    """
    # Note: Saving credentials in environment variables is convenient, but not
    # secure - consider a more secure solution such as
    # Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
    # keep secrets safe.

    instance_connection_name = os.environ[
        "INSTANCE_CONNECTION_NAME"
    ]  # e.g. 'project:region:instance'
    db_user = os.environ["DB_USER"]  # e.g. 'my-db-user'
    db_pass = os.environ["DB_PASS"]  # e.g. 'my-db-password'
    db_name = os.environ["DB_NAME"] # e.g. 'my-database'

    ip_type = IPTypes.PUBLIC

    connector = Connector(ip_type=ip_type)

    def getconn() -> pymysql.connections.Connection:
        conn: pymysql.connections.Connection = connector.connect(
            instance_connection_name,
            "pymysql",
            user=db_user,
            password=db_pass,
            db=db_name,
        )
        return conn

    pool = sqlalchemy.create_engine(
        "mysql+pymysql://",
        creator=getconn,
    )
    return pool


print("SUCCESS")
@app.route('/get_delays', methods=['GET'])
def get_delays():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        rows = db_conn.execute(
            statement=sqlalchemy.text("SELECT * FROM Delays LIMIT 100"), 
        ).fetchall()
        for row in rows:
            ans.append(tuple(row))
    pool.dispose()
    return json.dumps(ans)

@app.route('/put_user/', methods=['PUT'])
def put_user():
    username = request.args.get("username")
    email = request.args.get("email")
    password = request.args.get("password")

    pool = connect_with_connector()
    with pool.connect().execution_options(isolation_level = "SERIALIZABLE") as db_conn:
        db_conn.begin()
        max = tuple(db_conn.execute(
            statement=sqlalchemy.text("SELECT MAX(user_id) FROM Users"), 
        ))[0][0]

        print(max)
        statement=sqlalchemy.text('INSERT INTO Users (user_id, username, email, password) VALUES (:x, :y, :z, :w)')
        db_conn.execute( statement, parameters = dict(x = max + 1, y = username, z = email, w = password))
        db_conn.commit()
    pool.dispose()
    return str(max + 1)

@app.route('/get_user/', methods=['GET'])
def get_user():
    username = request.args.get("username")
    password = request.args.get("password")

    pool = connect_with_connector()
    with pool.connect().execution_options(isolation_level = "SERIALIZABLE") as db_conn:
        db_conn.begin()
        max = tuple(db_conn.execute(
            statement=sqlalchemy.text("SELECT MAX(user_id) FROM Users WHERE username = :user AND password = :code"), 
             parameters = dict(user = username, code = password)
        ))[0][0]

        assert(max != None)

        print(max)
    pool.dispose()
    return str(max)

@app.route('/del_user/', methods=['DELETE'])
def del_user():
    user_id= request.args.get("user_id")

    pool = connect_with_connector()
    with pool.connect().execution_options(isolation_level = "SERIALIZABLE") as db_conn:
        db_conn.begin()
        db_conn.execute(
            statement=sqlalchemy.text("DELETE FROM Users WHERE user_id = :user_id"), 
            parameters = dict(user_id = user_id)
        )
        db_conn.commit()

    pool.dispose()
    return str(None)

if __name__ == "__main__":
    app.run(debug=True, threaded=True)