use crate::DBConn;
use crate::model::RowTranslation;

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
            let mut customers = results.into_iter();
            customers.next().into_result().map_err(|_| 404)
        }
        Err(_) => Err(500),
    }
}
