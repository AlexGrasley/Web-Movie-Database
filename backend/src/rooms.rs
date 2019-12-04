use crate::model::Room;
use crate::model::RowTranslation;
use crate::shared::*;
use crate::DBConn;

use mysql::params;
use rocket::{self, delete, get, http::Status, patch, post};
use rocket_contrib::json::Json;

#[get("/<id>")]
pub fn select_room_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Room>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_ROOM_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Room not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[delete("/<id>")]
pub fn delete_room_by_id_handler(mut conn: DBConn, id: u64) -> Status {
    match delete_thing_by_id(&mut conn, id, "room") {
        200 => Status::new(200, "deleted"),
        404 => Status::new(404, "room not found"),
        _ => Status::new(500, "Internal Server Error"),
    }
}

#[post("/", format = "json", data = "<room>")]
pub fn insert_room_handler(mut conn: DBConn, room: Json<Room>) -> Result<Json<Room>, Status> {
    let last_id = conn
        .prep_exec(
            INSERT_ROOM,
            params! {
                "capacity" => &room.capacity,
                "theater_id" => &room.theater_id,
            },
        )
        .map(|res| res.last_insert_id());

    match last_id {
        Ok(id) => select_thing_by_id(&mut conn, id, SELECT_ROOM_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Room not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        Err(_) => Err(Status::new(500, "Couldn't create room")),
    }
}

#[get("/")]
pub fn list_rooms_handler(mut conn: DBConn) -> Result<Json<Vec<Room>>, Status> {
    list_rooms(&mut conn).map(Json).map_err(|code| match code {
        404 => Status::new(404, "Rooms not found"),
        400 => Status::new(400, "bad req"),
        _ => Status::new(500, "internal server error"),
    })
}

pub fn list_rooms(conn: &mut DBConn) -> Result<Vec<Room>, u64> {
    match conn.prep_exec(SELECT_ROOMS, ()) {
        Ok(res) => {
            let res = res
                .map(|row| row.unwrap())
                .map(RowTranslation::translate)
                .collect::<Vec<Room>>();
            Ok(res)
        }
        Err(_) => Err(400),
    }
}

#[patch("/", format = "json", data = "<room>")]
pub fn update_room_by_id_handler(mut conn: DBConn, room: Json<Room>) -> Result<Json<Room>, Status> {
    conn.prep_exec(
        UPDATE_ROOM,
        params! {
            "room_id" => &room.room_id,
            "capacity" => &room.capacity,
            "theater_id" => &room.theater_id,
        },
    )
    .map_err(|_| Status::new(500, "Internal server error"))?;

    match room.room_id {
        Some(id) => select_thing_by_id(&mut conn, id, SELECT_ROOM_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Room not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        _ => Err(Status::new(500, "Couldn't update room")),
    }
}

static SELECT_ROOMS: &str = "SELECT room_id, capacity, theater_id FROM rooms";
static SELECT_ROOM_BY_ID: &str =
    "SELECT room_id, capacity, theater_id FROM rooms WHERE room_id = :id";
static INSERT_ROOM: &str =
    "INSERT INTO rooms (`capacity`, `theater_id`) VALUES (:capacity, :theater_id)";
static UPDATE_ROOM: &str =
    "UPDATE rooms SET capacity = :capacity, theater_id = :theater_id WHERE room_id = :room_id";
