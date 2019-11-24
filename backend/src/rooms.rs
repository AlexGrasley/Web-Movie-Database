use crate::model::Room;
use crate::model::RowTranslation;
use crate::shared::select_thing_by_id;
use crate::DBConn;

use mysql::params;
use rocket::{self, get, http::Status, post};
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

static SELECT_ROOMS: &str = "SELECT room_id, capacity, theater_id FROM rooms";
static SELECT_ROOM_BY_ID: &str =
    "SELECT room_id, capacity, theater_id FROM rooms WHERE room_id = :id";
static INSERT_ROOM: &str =
    "INSERT INTO rooms (`capacity`, `theater_id`) VALUES (:capacity, :theater_id)";
