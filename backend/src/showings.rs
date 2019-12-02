use crate::model::RowTranslation;
use crate::model::{DetailedShowing, Showing};
use crate::shared::*;
use crate::DBConn;

use mysql::params;
use rocket::{self, delete, get, http::Status, patch, post};
use rocket_contrib::json::Json;

#[get("/<id>")]
pub fn select_showing_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Showing>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_SHOWING_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Showing not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[get("/<id>/detailed")]
pub fn select_detailed_showing_by_id_handler(
    mut conn: DBConn,
    id: u64,
) -> Result<Json<DetailedShowing>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_DETAILED_SHOWING_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Showing not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[delete("/<id>")]
pub fn delete_showing_by_id_handler(mut conn: DBConn, id: u64) -> Status {
    match delete_thing_by_id(&mut conn, id, "showing") {
        200 => Status::new(200, "deleted"),
        404 => Status::new(404, "showing not found"),
        _ => Status::new(500, "Internal Server Error"),
    }
}

#[post("/", format = "json", data = "<showing>")]
pub fn insert_showing_handler(
    mut conn: DBConn,
    showing: Json<Showing>,
) -> Result<Json<Showing>, Status> {
    let last_id = conn
        .prep_exec(
            INSERT_SHOWING,
            params! {
                "time" => &showing.time,
                "movie_id" => &showing.movie_id,
                "room_id" => &showing.room_id,
            },
        )
        .map(|res| res.last_insert_id());

    match last_id {
        Ok(id) => select_thing_by_id(&mut conn, id, SELECT_SHOWING_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Showing not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        Err(_) => Err(Status::new(500, "Couldn't create showing")),
    }
}

#[get("/detailed")]
pub fn list_detailed_showings_handler(
    mut conn: DBConn,
) -> Result<Json<Vec<DetailedShowing>>, Status> {
    list_detailed_showings(&mut conn)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "DetailedShowings not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn list_detailed_showings(conn: &mut DBConn) -> Result<Vec<DetailedShowing>, u64> {
    match conn.prep_exec(SELECT_DETAILED_SHOWINGS, ()) {
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

#[get("/")]
pub fn list_showings_handler(mut conn: DBConn) -> Result<Json<Vec<Showing>>, Status> {
    list_showings(&mut conn)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Showings not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn list_showings(conn: &mut DBConn) -> Result<Vec<Showing>, u64> {
    match conn.prep_exec(SELECT_SHOWINGS, ()) {
        Ok(res) => {
            let res = res
                .map(|row| row.unwrap())
                .map(RowTranslation::translate)
                .collect::<Vec<Showing>>();
            Ok(res)
        }
        Err(_) => Err(400),
    }
}

#[patch("/", format = "json", data = "<showing>")]
pub fn update_showing_by_id_handler(
    mut conn: DBConn,
    showing: Json<Showing>,
) -> Result<Json<Showing>, Status> {
    conn.prep_exec(
        UPDATE_SHOWING,
        params! {
            "showing_id" => &showing.showing_id,
            "time" => &showing.time,
            "movie_id" => &showing.movie_id,
            "room_id" => &showing.room_id,
        },
    )
    .map_err(|_| Status::new(500, "Internal server error"))?;

    match showing.showing_id {
        Some(id) => select_thing_by_id(&mut conn, id, SELECT_SHOWING_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Showing not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        _ => Err(Status::new(500, "Couldn't update showing")),
    }
}

static SELECT_SHOWINGS: &str = "SELECT showing_id, time, movie_id, room_id FROM showings";
static SELECT_SHOWING_BY_ID: &str =
    "SELECT showing_id, time, movie_id, room_id FROM showings WHERE showing_id = :id";
static INSERT_SHOWING: &str =
    "INSERT INTO showings (`time`, `movie_id`, `room_id`) VALUES (:time, :movie_id, :room_id)";
static UPDATE_SHOWING: &str =
    "UPDATE showings SET time = :time, movie_id = :movie_id, room_id = :room_id WHERE showing_id = :showing_id";

static SELECT_DETAILED_SHOWINGS: &str = "SELECT
     s.showing_id,
     s.time AS time,
     s.room_id,
     m.name AS movie_name,
     t.name AS theater_name,
     t.theater_id
     FROM showings AS s
     LEFT JOIN movies AS m ON (m.movie_id = s.movie_id)
     LEFT JOIN rooms AS r ON (r.room_id = s.room_id)
     LEFT JOIN theaters AS t ON (t.theater_id = r.room_id)";

static SELECT_DETAILED_SHOWING_BY_ID: &str = "SELECT
     s.showing_id,
     s.time AS time,
     s.room_id,
     m.name AS movie_name,
     t.name AS theater_name,
     t.theater_id
     FROM showings AS s
     LEFT JOIN movies AS m ON (m.movie_id = s.movie_id)
     LEFT JOIN rooms AS r ON (r.room_id = s.room_id)
     LEFT JOIN theaters AS t ON (t.theater_id = r.room_id)
     WHERE showing_id = :id";
