use crate::model::RowTranslation;
use crate::DBConn;

use mysql::params;

use std::ops::Try;

pub fn select_thing_by_id<T: RowTranslation>(
    conn: &mut DBConn,
    id: u64,
    query: &str,
) -> Result<T, u64> {
    match conn.prep_exec(query, params! {"id" => id}) {
        Ok(res) => {
            let results: Vec<T> = res.map(|row| row.unwrap()).map(T::translate).collect();
            let mut items = results.into_iter();
            items.next().into_result().map_err(|_| 404)
        }
        Err(e) => {
            eprintln!("Error Occurred Selecting thing by ID: {:?}", e);
            Err(500)
        }
    }
}

pub fn delete_thing_by_id(conn: &mut DBConn, id: u64, item_key: &str) -> u64 {
    match conn.prep_exec(
        format!("DELETE FROM {0}s WHERE {0}_id=:id", item_key),
        params! {"id" => id},
    ) {
        Ok(res) => {
            if res.affected_rows() == 0 {
                404
            } else {
                200
            }
        }
        Err(_) => 500,
    }
}
