#![feature(proc_macro_hygiene, decl_macro)]

use mysql;

use rocket;
use rocket::http::Status;
use rocket::routes;
use rocket::{get, post};
use rocket_contrib::database;
// use rocket_contrib::json::Json;

mod create_tables;
use create_tables::*;

#[database("mariadb")]
pub struct DBConn(mysql::Conn);

fn main() {
    rocket::ignite()
        .mount("/api", routes![ping, create_tables])
        .attach(DBConn::fairing())
        .launch();
}

#[get("/ping")]
pub fn ping() -> &'static str {
    "pong"
}

#[post("/create_tables", format = "application/json")]
pub fn create_tables(mut conn: DBConn) -> Status {
    for stmt in [
        CREATE_CUSTOMERS_QUERY,
        CREATE_MOVIES_QUERY,
        CREATE_ROOMS_QUERY,
        CREATE_SHOWINGS_QUERY,
        CREATE_THEATERS_QUERY,
        CREATE_TICKETS_QUERY,
    ]
    .iter()
    {
        let exe = conn.query(stmt);
        if exe.is_err() {
            return Status::new(500, "error creating tables");
        }
    }

    Status::new(204, "created")
}
