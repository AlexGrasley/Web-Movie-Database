use chrono::{NaiveDate, NaiveDateTime};
use mysql::prelude::*;
use mysql::Value;
use mysql_common::value::convert::{FromValue, FromValueError};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Customer {
    pub customer_id: Option<u64>,
    pub fname: Option<String>,
    pub lname: Option<String>,
    pub birthday: Option<NaiveDate>,
}

impl RowTranslation for Customer {
    fn translate(row: Row) -> Self {
        let (customer_id, fname, lname, birthday) = mysql::from_row(row);
        Customer {
            customer_id,
            fname,
            lname,
            birthday,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
pub enum Rating {
    E,
    PG,
    PG13,
    R,
    AO,
    Unrated,
}

pub struct RatingIr(&'static str);

impl ConvIr<Rating> for RatingIr {
    fn new(v: Value) -> Result<RatingIr, FromValueError> {
        match v {
            Value::Bytes(bytes) => match bytes.as_slice() {
                b"E" => Ok(RatingIr("E")),
                b"PG" => Ok(RatingIr("PG")),
                b"PG13" => Ok(RatingIr("PG13")),
                b"R" => Ok(RatingIr("R")),
                b"AO" => Ok(RatingIr("AO")),
                _ => Err(FromValueError(Value::Bytes(bytes))),
            },
            Value::NULL => Ok(RatingIr("NULL")),
            v => Err(FromValueError(v)),
        }
    }

    fn commit(self) -> Rating {
        match self.0 {
            "E" => Rating::E,
            "PG" => Rating::PG,
            "PG13" => Rating::PG13,
            "R" => Rating::R,
            "AO" => Rating::AO,
            "NULL" => Rating::Unrated,
            _ => unreachable!(),
        }
    }

    fn rollback(self) -> Value {
        Value::Bytes(self.0.as_bytes().to_vec())
    }
}

impl FromValue for Rating {
    type Intermediate = RatingIr;
}

impl std::convert::From<Rating> for Value {
    fn from(rating: Rating) -> Self {
        match rating {
            Rating::E => Value::Bytes(b"E".to_vec()),
            Rating::PG => Value::Bytes(b"PG".to_vec()),
            Rating::PG13 => Value::Bytes(b"PG13".to_vec()),
            Rating::R => Value::Bytes(b"R".to_vec()),
            Rating::AO => Value::Bytes(b"AO".to_vec()),
            Rating::Unrated => Value::NULL,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Movie {
    pub movie_id: Option<u64>,
    pub name: String,
    pub rating: Option<Rating>,
    pub genre: Option<String>,
    // minutes
    pub length: u64,
}

impl RowTranslation for Movie {
    fn translate(row: Row) -> Self {
        let (movie_id, name, rating, genre, length) = mysql::from_row(row);
        Movie {
            movie_id,
            name,
            rating,
            genre,
            length,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Room {
    pub room_id: Option<u64>,
    pub capacity: Option<u32>,
    pub theater_id: Option<u64>,
}

impl RowTranslation for Room {
    fn translate(row: Row) -> Self {
        let (room_id, capacity, theater_id) = mysql::from_row(row);
        Room {
            room_id,
            capacity,
            theater_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Showing {
    pub showing_id: Option<u64>,
    pub time: Option<NaiveDateTime>,
    pub movie_id: Option<u64>,
    pub room_id: Option<u64>,
}

impl RowTranslation for Showing {
    fn translate(row: Row) -> Self {
        let (showing_id, time, movie_id, room_id) = mysql::from_row(row);
        Showing {
            showing_id,
            time,
            movie_id,
            room_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DetailedShowing {
    pub showing_id: Option<u64>,
    pub time: Option<NaiveDateTime>,
    pub room_id: Option<u64>,
    pub movie_name: Option<String>,
    pub theater_name: Option<String>,
    pub theater_id: Option<u64>,
}

impl RowTranslation for DetailedShowing {
    fn translate(row: Row) -> Self {
        let (showing_id, time, room_id, movie_name, theater_name, theater_id) =
            mysql::from_row(row);
        Self {
            showing_id,
            time,
            room_id,
            movie_name,
            theater_name,
            theater_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Theater {
    pub theater_id: Option<u64>,
    pub name: Option<String>,
    pub address: Option<String>,
    pub address_two: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub zip: Option<String>,
}

impl RowTranslation for Theater {
    fn translate(row: Row) -> Self {
        let (theater_id, name, address, address_two, city, state, zip) = mysql::from_row(row);
        Self {
            theater_id,
            name,
            address,
            address_two,
            city,
            state,
            zip,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Ticket {
    pub ticket_id: Option<u64>,
    pub price: Option<f64>,
    pub showing_id: Option<u64>,
    pub customer_id: Option<u64>,
}

impl RowTranslation for Ticket {
    fn translate(row: Row) -> Self {
        let (ticket_id, price, showing_id, customer_id) = mysql::from_row(row);
        Ticket {
            ticket_id,
            price,
            showing_id,
            customer_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DetailedTicket {
    pub ticket_id: Option<u64>,
    pub room_id: Option<u64>,
    pub movie_name: Option<String>,
    pub customer_name: Option<String>,
    pub showtime: Option<NaiveDateTime>,
    pub showing_id: Option<u64>,
    pub price: Option<f64>,
}

impl RowTranslation for DetailedTicket {
    fn translate(row: Row) -> Self {
        let (ticket_id, price, room_id, customer_name, showtime, movie_name, showing_id) =
            mysql::from_row(row);
        Self {
            ticket_id,
            price,
            room_id,
            customer_name,
            showtime,
            movie_name,
            showing_id,
        }
    }
}

use mysql::Row;
pub trait RowTranslation {
    fn translate(row: Row) -> Self;
}
