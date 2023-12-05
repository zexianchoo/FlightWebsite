import os
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
import sqlalchemy
import simplejson as json
from dotenv import load_dotenv

from flask import jsonify
from flask import Flask
from flask_cors import CORS
from flask import request, session
from flask_session import Session

from datetime import datetime
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


print("CONNECTION SUCCESS")
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
        max = tuple(db_conn.execute(
            statement=sqlalchemy.text("SELECT MAX(user_id) FROM Users"), 
        ))[0][0]

        print(max)
        statement=sqlalchemy.text('INSERT INTO Users (user_id, username, email, password) VALUES (:x, :y, :z, :w)')
        db_conn.execute( statement, parameters = dict(x = max + 1, y = username, z = email, w = password))
        db_conn.commit()
    return str(max + 1)

@app.route('/update_email/', methods=['PUT'])
def update_email():
    user_id = request.args.get("user_id")
    email = request.args.get("email")

    pool = connect_with_connector()
    with pool.connect().execution_options(isolation_level = "SERIALIZABLE") as db_conn:
        max = tuple(db_conn.execute(
            statement=sqlalchemy.text("SELECT MAX(user_id) FROM Users"), 
        ))[0][0]

        print(max)
        statement=sqlalchemy.text('UPDATE Users SET email = :email WHERE user_id = :user_id')
        db_conn.execute( statement, parameters = dict(email = email, user_id = user_id))
        db_conn.commit()
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

@app.route('/get_advanced/', methods=['PUT'])
def get_advanced():

    user_id= request.args.get("user_id")
    startDate= request.args.get("startDate")
    endDate= request.args.get("endDate")
    dayOfWeek= request.args.get("dayOfWeek")

    pool = connect_with_connector()
    ans = []
    with pool.connect().execution_options(isolation_level = "SERIALIZABLE") as db_conn:
        if user_id != None:
            db_conn.begin()
            max = tuple(db_conn.execute(
                statement=sqlalchemy.text("SELECT MAX(search_id) FROM Searches"), 
            ))[0][0]

            statement=sqlalchemy.text('INSERT INTO Searches (search_id, date_searched, search_start_date, search_end_date, search_airline, user_id) VALUES (:a, :b, :c, :d, :e, :f)')
            db_conn.execute( statement, parameters = dict(a = max + 1, b = str(datetime.now()), c = startDate, d = endDate, e = "AA", f = str(user_id)))
            db_conn.commit()
        
        rows = db_conn.execute(
            statement=sqlalchemy.text("call tran(:week_day, :start_date, :end_date)"), parameters = dict(week_day = dayOfWeek, start_date = startDate, end_date = endDate)
        ).fetchall()
        for row in rows:
            ans.append(tuple(row))
    pool.dispose()
    return json.dumps(ans)

@app.route('/get_airline', methods=['GET'])
def get_airline():
    pool = connect_with_connector()
    ret = []
    with pool.connect() as db_conn:
        # Correctly bind the parameter in the execute method
        print()
        query = db_conn.execute(
            sqlalchemy.text("SELECT * FROM Flights WHERE AIRLINE = :airline_name LIMIT 10"),
            {"airline_name": request.args.get('airline_name')}
        )
        rows = query.fetchall()
        # print(rows[:10])
        for row in rows:
            ret.append(tuple(row))  # Assuming you want a dictionary format
    pool.dispose()
    return ret

# Route for getting all airlines
@app.route('/get_all_airlines', methods=['GET'])
def get_all_airlines():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        rows = db_conn.execute(
            statement=sqlalchemy.text("SELECT * FROM Airlines"), 
        ).fetchall()

        for row in rows:
            airline_data = {
                'IATA_CODE': row[0],  
                'AIRLINE': row[1],
            }
            ans.append(airline_data)
    pool.dispose()
    return jsonify(ans)  

if __name__ == "__main__":
    app.run(debug=True, threaded=True)