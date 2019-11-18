use chrono::{NaiveDate, NaiveDateTime};
// use mysql::prelude::ConvIr;
use mysql::prelude::*;
use mysql::Value;
use mysql_common::value::convert::FromValue;
use mysql_common::value::convert::FromValueError;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Customer {
    pub customer_id: Option<u64>,
    pub fname: Option<String>,
    pub lname: Option<String>,
    pub birthday: NaiveDate,
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

pub struct RatingIr {
    dat: String,
}

impl ConvIr<Rating> for RatingIr {
    fn new(v: Value) -> Result<RatingIr, FromValueError> {
        match v {
            Value::Bytes(bytes) => match String::from_utf8(bytes.clone()) {
                Ok(s) if s == "E" || s == "PG" || s == "PG13" || s == "R" || s == "AO" => {
                    Ok(RatingIr { dat: s })
                }
                Ok(_) | Err(_) => Err(FromValueError(Value::Bytes(bytes))),
            },
            Value::NULL => Ok(RatingIr {
                dat: "NULL".to_string(),
            }),
            v => Err(FromValueError(v)),
        }
    }

    fn commit(self) -> Rating {
        match self.dat.as_str() {
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
        Value::Bytes(self.dat.into_bytes())
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
#[derive(Serialize, Deserialize, Debug)]
pub struct Room {
    pub room_id: Option<u64>,
    pub capacity: u32,
    pub theater_id: u64,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Showing {
    pub showing_id: Option<u64>,
    pub time: NaiveDateTime,
    pub movie_id: u64,
    pub room_id: u64,
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
#[derive(Serialize, Deserialize, Debug)]
pub struct Ticket {
    pub ticket_id: Option<u64>,
    pub price: f64,
    pub showing_id: Option<u64>,
    pub customer_id: Option<u64>,
}
