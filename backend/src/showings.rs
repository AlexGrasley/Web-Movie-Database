use crate::model::RowTranslation;
use crate::model::Showing;
use crate::shared::select_thing_by_id;
use crate::DBConn;

use mysql::params;
use rocket::{self, get, http::Status, post};
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

static SELECT_SHOWINGS: &str = "SELECT showing_id, time, movie_id, room_id FROM showings";
static SELECT_SHOWING_BY_ID: &str =
    "SELECT showing_id, time, movie_id, room_id FROM showings WHERE showing_id = :id";
static INSERT_SHOWING: &str =
    "INSERT INTO showings (`time`, `movie_id`, `room_id`) VALUES (:time, :movie_id, :room_id)";
