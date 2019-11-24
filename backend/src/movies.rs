use crate::model::Movie;
use crate::model::RowTranslation;
use crate::shared::select_thing_by_id;
use crate::DBConn;

use mysql::params;
use rocket::{self, get, http::Status, post};
use rocket_contrib::json::Json;

#[get("/<id>")]
pub fn select_movie_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Movie>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_MOVIE_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Movie not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[post("/", format = "json", data = "<movie>")]
pub fn insert_movie_handler(mut conn: DBConn, movie: Json<Movie>) -> Result<Json<Movie>, Status> {
    let last_id = conn
        .prep_exec(
            INSERT_MOVIE,
            params! {
                "name" => &movie.name,
                "rating" => movie.rating,
                "genre" => &movie.genre,
                "length" => movie.length
            },
        )
        .map(|res| res.last_insert_id());

    match last_id {
        Ok(id) => select_thing_by_id(&mut conn, id, SELECT_MOVIE_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Movie not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        Err(_) => Err(Status::new(500, "Couldn't create movie")),
    }
}

#[get("/")]
pub fn list_movies_handler(mut conn: DBConn) -> Result<Json<Vec<Movie>>, Status> {
    list_movies(&mut conn).map(Json).map_err(|code| match code {
        404 => Status::new(404, "Movies not found"),
        400 => Status::new(400, "bad req"),
        _ => Status::new(500, "internal server error"),
    })
}

pub fn list_movies(conn: &mut DBConn) -> Result<Vec<Movie>, u64> {
    match conn.prep_exec(SELECT_MOVIES, ()) {
        Ok(res) => {
            let res = res
                .map(|row| row.unwrap())
                .map(RowTranslation::translate)
                .collect::<Vec<Movie>>();
            Ok(res)
        }
        Err(_) => Err(400),
    }
}

static SELECT_MOVIES: &str = "SELECT movie_id, name, rating, genre, length FROM movies";
static SELECT_MOVIE_BY_ID: &str =
    "SELECT movie_id, name, rating, genre, length FROM movies WHERE movie_id = :id";
static INSERT_MOVIE: &str =
    "INSERT INTO movies (`name`, `rating`, `genre`, `length`) VALUES (:name, :rating, :genre, :length)";
