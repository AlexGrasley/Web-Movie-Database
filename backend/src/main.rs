#![feature(proc_macro_hygiene, decl_macro, try_trait)]

mod customers;
mod debug_inserts;
mod model;
mod movies;
mod rooms;
mod showings;
mod table_ops;
mod theater;
mod tickets;
mod shared;

use mysql;
use rocket::{self, get, routes};
use rocket_contrib::database;

use customers::*;
use movies::*;
use rooms::*;
use showings::*;
use table_ops::*;
use theater::*;
use tickets::*;

#[database("mariadb")]
pub struct DBConn(mysql::Conn);

fn main() {
    rocket::ignite()
        .mount("/api", routes![ping, create_tables, drop_tables, insert])
        .mount(
            "/api/movies",
            routes![
                select_movie_by_id_handler,
                insert_movie_handler,
                list_movies_handler
            ],
        )
        .mount(
            "/api/customers",
            routes![
                select_customer_by_id_handler,
                insert_customer_handler,
                list_customers_handler
            ],
        )
        .mount(
            "/api/rooms",
            routes![
                select_room_by_id_handler,
                insert_room_handler,
                list_rooms_handler
            ],
        )
        .mount(
            "/api/showings",
            routes![
                select_showing_by_id_handler,
                insert_showing_handler,
                list_showings_handler
            ],
        )
        .mount(
            "/api/theaters",
            routes![
                select_theater_by_id_handler,
                insert_theater_handler,
                list_theaters_handler
            ],
        )
        .mount(
            "/api/tickets",
            routes![
                select_ticket_by_id_handler,
                insert_ticket_handler,
                list_tickets_handler
            ],
        )
        .attach(DBConn::fairing())
        .launch();
}

#[get("/ping")]
pub fn ping() -> &'static str {
    "pong"
}
