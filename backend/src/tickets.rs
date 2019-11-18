use crate::model::Ticket;
use crate::DBConn;

use mysql::params;

use rocket::{self, get, http::Status, post};
use rocket_contrib::json::Json;
use std::ops::Try;

#[get("/<id>")]
pub fn select_ticket_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Ticket>, Status> {
    select_ticket_by_id(&mut conn, id)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Ticket not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn select_ticket_by_id(conn: &mut DBConn, id: u64) -> Result<Ticket, u64> {
    match conn.prep_exec(SELECT_TICKET_BY_ID, params! {"id" => id}) {
        Ok(res) => {
            let results: Vec<Ticket> = res
                .map(|row| row.unwrap())
                .map(|row| {
                    let (ticket_id, price, showing_id, customer_id) = mysql::from_row(row);
                    Ticket {
                        ticket_id,
                        price,
                        showing_id,
                        customer_id,
                    }
                })
                .collect();

            let mut tickets = results.into_iter();
            tickets.next().into_result().map_err(|_| 404)
            // Ok(Json(ticket))
        }
        Err(_) => Err(400),
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
                "ticket_id" => &ticket.ticket_id,
                "price" => &ticket.price,
                "showing_id" => &ticket.showing_id,
                "customer_id" => &ticket.customer_id,
            },
        )
        .map(|res| res.last_insert_id());

    match last_id {
        Ok(id) => select_ticket_by_id(&mut conn, id)
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
                .map(|row| {
                    let (ticket_id, price, showing_id, customer_id) = mysql::from_row(row);
                    Ticket {
                        ticket_id,
                        price,
                        showing_id,
                        customer_id,
                    }
                })
                .collect::<Vec<Ticket>>();
            Ok(res)

            // Ok(Json(ticket))
        }
        Err(_) => Err(400),
    }
}

static SELECT_TICKETS: &str = "SELECT ticket_id, price, showing_id, customer_id FROM tickets";
static SELECT_TICKET_BY_ID: &str =
    "SELECT ticket_id, price, showing_id, customer_id FROM tickets WHERE ticket_id = :id";
static INSERT_TICKET: &str =
    "INSERT INTO tickets (`price`, `showing_id`, `customer_id`) VALUES (:price, :showing_id, :customer_id)";
