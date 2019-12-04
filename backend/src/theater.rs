use crate::model::RowTranslation;
use crate::model::Theater;
use crate::shared::*;
use crate::DBConn;

use mysql::params;
use rocket::{self, delete, get, http::Status, patch, post};
use rocket_contrib::json::Json;

#[get("/<id>")]
pub fn select_theater_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Theater>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_THEATER_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Theater not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[delete("/<id>")]
pub fn delete_theater_by_id_handler(mut conn: DBConn, id: u64) -> Status {
    match delete_thing_by_id(&mut conn, id, "theater") {
        200 => Status::new(200, "deleted"),
        404 => Status::new(404, "theater not found"),
        _ => Status::new(500, "Internal Server Error"),
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
        Ok(id) => select_thing_by_id(&mut conn, id, SELECT_THEATER_BY_ID)
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
                .map(RowTranslation::translate)
                .collect::<Vec<Theater>>();
            Ok(res)
        }
        Err(_) => Err(400),
    }
}

#[patch("/", format = "json", data = "<theater>")]
pub fn update_theater_by_id_handler(
    mut conn: DBConn,
    theater: Json<Theater>,
) -> Result<Json<Theater>, Status> {
    conn.prep_exec(
        UPDATE_THEATER,
        params! {
            "theater_id" => &theater.theater_id,
            "name" => &theater.name,
            "address" => &theater.address,
            "address_two" => &theater.address_two,
            "city" => &theater.city,
            "state" => &theater.state,
            "zip" => &theater.zip,
        },
    )
    .map_err(|_| Status::new(500, "Internal server error"))?;

    match theater.theater_id {
        Some(id) => select_thing_by_id(&mut conn, id, SELECT_THEATER_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Theater not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        _ => Err(Status::new(500, "Couldn't update theater")),
    }
}

static SELECT_THEATERS: &str =
    "SELECT theater_id, name, address, address_two, city, state, zip FROM theaters";
static SELECT_THEATER_BY_ID: &str =
    "SELECT theater_id, name, address, address_two, city, state, zip FROM theaters WHERE theater_id = :id";
static INSERT_THEATER: &str =
    "INSERT INTO theaters (`name`, `address`, `address_two`, `city`, `state`, `zip`) VALUES (:name, :address, :address_two, :city, :state, :zip)";
static UPDATE_THEATER: &str =
    "UPDATE theaters SET name = :name, address = :address, address_two = :address_two, city = :city, state = :state, zip = :zip WHERE theater_id = :theater_id";
