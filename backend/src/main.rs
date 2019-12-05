#![feature(proc_macro_hygiene, decl_macro, try_trait)]

mod customers;
mod debug_inserts;
mod model;
mod movies;
mod rooms;
mod shared;
mod showings;
mod table_ops;
mod theater;
mod tickets;

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
                list_movies_handler,
                delete_movie_by_id_handler,
                update_movie_by_id_handler,
            ],
        )
        .mount(
            "/api/customers",
            routes![
                select_customer_by_id_handler,
                insert_customer_handler,
                list_customers_handler,
                delete_customer_by_id_handler,
                update_customer_by_id_handler,
            ],
        )
        .mount(
            "/api/rooms",
            routes![
                select_room_by_id_handler,
                insert_room_handler,
                list_rooms_handler,
                delete_room_by_id_handler,
                update_room_by_id_handler,
            ],
        )
        .mount(
            "/api/showings",
            routes![
                select_showing_by_id_handler,
                insert_showing_handler,
                list_showings_handler,
                delete_showing_by_id_handler,
                update_showing_by_id_handler,
                select_detailed_showing_by_id_handler,
                list_detailed_showings_handler,
            ],
        )
        .mount(
            "/api/theaters",
            routes![
                select_theater_by_id_handler,
                insert_theater_handler,
                list_theaters_handler,
                delete_theater_by_id_handler,
                update_theater_by_id_handler,
            ],
        )
        .mount(
            "/api/tickets",
            routes![
                select_ticket_by_id_handler,
                insert_ticket_handler,
                list_tickets_handler,
                delete_ticket_by_id_handler,
                update_ticket_by_id_handler,
                select_detailed_ticket_by_id_handler,
                list_detailed_tickets_handler,
            ],
        )
        .attach(DBConn::fairing())
        .attach(ControlAllowOrigin)
        .attach(ControlAllowMethods)
        .launch();
}

use rocket::fairing::{Fairing, Info, Kind};
use rocket::{Request, Response};

struct ControlAllowOrigin;
impl Fairing for ControlAllowOrigin {
    fn info(&self) -> Info {
        Info {
            name: "ControlAlloworigin Header",
            kind: Kind::Response,
        }
    }

    fn on_response(&self, _: &Request, response: &mut Response) {
        // response.adjoin_raw_header(
        //     "Access-Control-Allow-Origin",
        //     "http://web.engr.oregonstate.edu",
        // );
        response.adjoin_raw_header("Access-Control-Allow-Origin", "*");
    }
}

struct ControlAllowMethods;
impl Fairing for ControlAllowMethods {
    fn info(&self) -> Info {
        Info {
            name: "ControlAllowMethods Header",
            kind: Kind::Response,
        }
    }

    fn on_response(&self, req: &Request, response: &mut Response) {
        if req.method() == rocket::http::Method::Options {
            response.adjoin_raw_header("Access-Control-Allow-Methods", "OPTIONS, POST, PATCH, GET");
        }
    }
}

#[get("/ping")]
pub fn ping() -> &'static str {
    "pong"
}
