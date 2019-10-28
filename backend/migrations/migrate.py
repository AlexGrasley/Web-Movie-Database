import mysql.connector as mariadb
import sys
import os
from enum import Enum
import time

up_end = ".up.sql"
down_end = ".down.sql"

# Order matters here
migrations = [
    "theaters",
    "rooms",
    "movies",
    "customers",
    "showings",
    "tickets",
]


def get_args():
    up_or_down = sys.argv[1]
    if up_or_down not in ["up", "down", "loop", "data"]:
        print("You must migrate up or down. (or `loop` for both)", file=sys.stderr)
        sys.exit(2)

    return up_or_down


def connect():
    mariadb_connection = mariadb.connect(
        user=os.environ['MOVIE_USER'], password=os.environ['MOVIE_PASS'], database=os.environ['MOVIE_DB'])

    return mariadb_connection


def load_queries(migrations, use_up: bool, multi=False):
    queries = []
    for name in migrations:
        name = f"./{name}{up_end if use_up else down_end}"
        file = open(name, "r")
        text = file.readlines()
        data = ""
        if multi:
            for line in text:
                queries.append(line.rstrip())
        else:
            for line in text:
                data += line

            queries.append(data)

    return queries


def up(conn):
    queries = load_queries(migrations, True)
    run_queries(conn, queries)


def down(conn):
    queries = load_queries(migrations, False)
    queries = queries[::-1]
    run_queries(conn, queries)


def dummy_data(conn):
    queries = load_queries(["data"], True, True)
    run_queries(conn, queries)


def run_queries(conn, queries):
    for query in queries:
        print(query)
        try:
            conn.execute(query)
        except Exception as e:
            print("Error executing query:", query, e, file=sys.stderr)


def main():
    up_or_down = get_args()
    connection = connect()
    cursor = connection.cursor(buffered=True)
    if up_or_down == "up":
        print("Going Up!")
        up(cursor)
    elif up_or_down == "down":
        print("Going Down!")
        down(cursor)
    elif up_or_down == "loop":
        print("You may now begin the push-up section.")
        print("Down")
        down(cursor)
        print("Up")
        up(cursor)
    elif up_or_down == "data":
        print("Going Dumb!")
        dummy_data(cursor)
    else:
        raise ValueError("Unreachable code reached.")


if __name__ == "__main__":
    main()
