use crate::model::RowTranslation;
use crate::model::{DetailedTicket, Ticket};
use crate::shared::*;
use crate::DBConn;

use mysql::params;
use rocket::{self, delete, get, http::Status, patch, post};
use rocket_contrib::json::Json;

#[get("/<id>")]
pub fn select_ticket_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Ticket>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_TICKET_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Ticket not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[get("/<id>/detailed")]
pub fn select_detailed_ticket_by_id_handler(
    mut conn: DBConn,
    id: u64,
) -> Result<Json<DetailedTicket>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_DETAILED_TICKET_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "DetailedTicket>, Status not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[delete("/<id>")]
pub fn delete_ticket_by_id_handler(mut conn: DBConn, id: u64) -> Status {
    match delete_thing_by_id(&mut conn, id, "ticket") {
        200 => Status::new(200, "deleted"),
        404 => Status::new(404, "ticket not found"),
        _ => Status::new(500, "Internal Server Error"),
    }
}

#[post("/", format = "json", data = "<ticket>")]
pub fn insert_ticket_handler(
    mut conn: DBConn,
    ticket: Json<Ticket>,
) -> Result<Json<Ticket>, Status> {
    let last_id = conn
        .prep_exec(
            INSERT_TICKET,
            params! {
                "price" => &ticket.price,
                "showing_id" => &ticket.showing_id,
                "customer_id" => &ticket.customer_id,
            },
        )
        .map(|res| res.last_insert_id());

    match last_id {
        Ok(id) => select_thing_by_id(&mut conn, id, SELECT_TICKET_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Ticket not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        Err(_) => Err(Status::new(500, "Couldn't create ticket")),
    }
}

#[get("/")]
pub fn list_tickets_handler(mut conn: DBConn) -> Result<Json<Vec<Ticket>>, Status> {
    list_tickets(&mut conn)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Tickets not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn list_tickets(conn: &mut DBConn) -> Result<Vec<Ticket>, u64> {
    match conn.prep_exec(SELECT_TICKETS, ()) {
        Ok(res) => {
            let res = res
                .map(|row| row.unwrap())
                .map(RowTranslation::translate)
                .collect::<Vec<Ticket>>();
            Ok(res)
        }
        Err(_) => Err(400),
    }
}

#[get("/detailed")]
pub fn list_detailed_tickets_handler(
    mut conn: DBConn,
) -> Result<Json<Vec<DetailedTicket>>, Status> {
    list_detailed_tickets(&mut conn)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "DetailedTickets not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn list_detailed_tickets(conn: &mut DBConn) -> Result<Vec<DetailedTicket>, u64> {
    match conn.prep_exec(SELECT_DETAILED_TICKETS, ()) {
        Ok(res) => {
            let res = res
                .map(|row| row.unwrap())
                .map(RowTranslation::translate)
                .collect::<Vec<_>>();
            Ok(res)
        }
        Err(_) => Err(400),
    }
}

#[patch("/", format = "json", data = "<ticket>")]
pub fn update_ticket_by_id_handler(
    mut conn: DBConn,
    ticket: Json<Ticket>,
) -> Result<Json<Ticket>, Status> {
    conn.prep_exec(
        UPDATE_TICKET,
        params! {
            "ticket_id" => &ticket.ticket_id,
            "price" => &ticket.price,
            "showing_id" => &ticket.showing_id,
            "customer_id" => &ticket.customer_id,
        },
    )
    .map_err(|_| Status::new(500, "Internal server error"))?;

    match ticket.ticket_id {
        Some(id) => select_thing_by_id(&mut conn, id, SELECT_TICKET_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Ticket not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        _ => Err(Status::new(500, "Couldn't update ticket")),
    }
}

static SELECT_TICKETS: &str = "SELECT ticket_id, price, showing_id, customer_id FROM tickets";
static SELECT_TICKET_BY_ID: &str =
    "SELECT ticket_id, price, showing_id, customer_id FROM tickets WHERE ticket_id = :id";
static INSERT_TICKET: &str =
    "INSERT INTO tickets (`price`, `showing_id`, `customer_id`) VALUES (:price, :showing_id, :customer_id)";
static UPDATE_TICKET: &str =
    "UPDATE tickets SET `price` = :price, showing_id = :showing_id, `customer_id` = :customer_id WHERE ticket_id = :ticket_id";

static SELECT_DETAILED_TICKETS: &str = "SELECT
    t.ticket_id,
    t.price,
    s.room_id,
    CONCAT(c.fname, \" \", c.lname) AS name,
    s.time as showtime,
    m.name AS movie_name,
    t.showing_id
    FROM tickets AS t
    LEFT JOIN showings AS s ON (s.showing_id = t.showing_id)
    LEFT JOIN customers AS c ON (c.customer_id = t.customer_id)
    LEFT JOIN movies AS m ON (m.movie_id = s.movie_id)";

static SELECT_DETAILED_TICKET_BY_ID: &str = "SELECT
    t.ticket_id,
    t.price,
    s.room_id,
    CONCAT(c.fname, \" \", c.lname) AS name,
    s.time,
    m.name AS movie_name,
    t.showing_id
    FROM tickets AS t
    LEFT JOIN showings AS s ON (s.showing_id = t.showing_id)
    LEFT JOIN customers AS c ON (c.customer_id = t.customer_id)
    LEFT JOIN movies AS m ON (m.movie_id = s.movie_id)
    WHERE t.ticket_id = :id";
