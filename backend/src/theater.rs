use crate::model::Theater;
use crate::DBConn;

use mysql::params;

use rocket::{self, get, http::Status, post};
use rocket_contrib::json::Json;
use std::ops::Try;

#[get("/<id>")]
pub fn select_theater_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Theater>, Status> {
    select_theater_by_id(&mut conn, id)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Theater not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn select_theater_by_id(conn: &mut DBConn, id: u64) -> Result<Theater, u64> {
    match conn.prep_exec(SELECT_THEATER_BY_ID, params! {"id" => id}) {
        Ok(res) => {
            let results: Vec<Theater> = res
                .map(|row| row.unwrap())
                .map(|row| {
                    let (theater_id, name, address, address_two, city, state, zip) =
                        mysql::from_row(row);
                    Theater {
                        theater_id,
                        name,
                        address,
                        address_two,
                        city,
                        state,
                        zip,
                    }
                })
                .collect();

            let mut theaters = results.into_iter();
            theaters.next().into_result().map_err(|_| 404)
            // Ok(Json(theater))
        }
        Err(_) => Err(400),
    }
}

#[post("/", format = "json", data = "<theater>")]
pub fn insert_theater_handler(
    mut conn: DBConn,
    theater: Json<Theater>,
) -> Result<Json<Theater>, Status> {
    let last_id = conn
        .prep_exec(
            INSERT_THEATER,
            params! {
                "name" => &theater.name,
                "address" => &theater.address,
                "address_two" => &theater.address_two,
                "city" => &theater.city,
                "state" => &theater.state,
                "zip" => &theater.zip,
            },
        )
        .map(|res| res.last_insert_id());

    match last_id {
        Ok(id) => select_theater_by_id(&mut conn, id)
            .map_err(|code| match code {
                404 => Status::new(404, "Theater not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        Err(_) => Err(Status::new(500, "Couldn't create theater")),
    }
}

#[get("/")]
pub fn list_theaters_handler(mut conn: DBConn) -> Result<Json<Vec<Theater>>, Status> {
    list_theaters(&mut conn)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Theaters not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn list_theaters(conn: &mut DBConn) -> Result<Vec<Theater>, u64> {
    match conn.prep_exec(SELECT_THEATERS, ()) {
        Ok(res) => {
            let res = res
                .map(|row| row.unwrap())
                .map(|row| {
                    let (theater_id, name, address, address_two, city, state, zip) =
                        mysql::from_row(row);
                    Theater {
                        theater_id,
                        name,
                        address,
                        address_two,
                        city,
                        state,
                        zip,
                    }
                })
                .collect::<Vec<Theater>>();
            Ok(res)

            // Ok(Json(theater))
        }
        Err(_) => Err(400),
    }
}

static SELECT_THEATERS: &str =
    "SELECT theater_id, name, address, address_two, city, state, zip FROM theaters";
static SELECT_THEATER_BY_ID: &str =
    "SELECT theater_id, name, address, address_two, city, state, zip FROM theaters WHERE theater_id = :id";
static INSERT_THEATER: &str =
    "INSERT INTO theaters (`name`, `address`, `address_two`, `city`, `state`, `zip`) VALUES (:name, :address, :address_two, :city, :state, :zip)";
