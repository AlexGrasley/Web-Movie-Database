use crate::model::Customer;
use crate::DBConn;
use crate::shared::select_thing_by_id;
use crate::model::RowTranslation;

use mysql::params;
use rocket::{self, get, http::Status, post};
use rocket_contrib::json::Json;

#[get("/<id>")]
pub fn select_customer_by_id_handler(mut conn: DBConn, id: u64) -> Result<Json<Customer>, Status> {
    select_thing_by_id(&mut conn, id, SELECT_CUSTOMER_BY_ID)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Customer not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

#[post("/", format = "json", data = "<customer>")]
pub fn insert_customer_handler(
    mut conn: DBConn,
    customer: Json<Customer>,
) -> Result<Json<Customer>, Status> {
    let last_id = conn
        .prep_exec(
            INSERT_CUSTOMER,
            params! {
                "fname" => &customer.fname,
                "lname" => &customer.lname,
                "birthday" => &customer.birthday,
            },
        )
        .map(|res| res.last_insert_id());

    match last_id {
        Ok(id) => select_thing_by_id(&mut conn, id, SELECT_CUSTOMER_BY_ID)
            .map_err(|code| match code {
                404 => Status::new(404, "Customer not found"),
                400 => Status::new(400, "bad req"),
                _ => Status::new(500, "internal server error"),
            })
            .map(Json),
        Err(_) => Err(Status::new(500, "Couldn't create customer")),
    }
}

#[get("/")]
pub fn list_customers_handler(mut conn: DBConn) -> Result<Json<Vec<Customer>>, Status> {
    list_customers(&mut conn)
        .map(Json)
        .map_err(|code| match code {
            404 => Status::new(404, "Customers not found"),
            400 => Status::new(400, "bad req"),
            _ => Status::new(500, "internal server error"),
        })
}

pub fn list_customers(conn: &mut DBConn) -> Result<Vec<Customer>, u64> {
    match conn.prep_exec(SELECT_CUSTOMERS, ()) {
        Ok(res) => {
            let res = res
                .map(|row| row.unwrap())
                .map(RowTranslation::translate)
                .collect::<Vec<Customer>>();
            Ok(res)
        }
        Err(_) => Err(400),
    }
}

static SELECT_CUSTOMERS: &str = "SELECT customer_id, fname, lname, birthday FROM customers";
static SELECT_CUSTOMER_BY_ID: &str =
    "SELECT customer_id, fname, lname, birthday FROM customers WHERE customer_id = :id";
static INSERT_CUSTOMER: &str =
    "INSERT INTO customers (`fname`, `lname`, `birthday`) VALUES (:fname, :lname, :birthday)";
