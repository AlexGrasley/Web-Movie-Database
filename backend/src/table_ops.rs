use crate::DBConn;
use rocket::{self, delete, http::Status, post};

#[post("/create_tables")]
pub fn create_tables(mut conn: DBConn) -> Status {
    //! THE ORDER IS IMPORTANT HERE
    for stmt in [
        CREATE_CUSTOMERS_QUERY,
        CREATE_MOVIES_QUERY,
        CREATE_THEATERS_QUERY,
        CREATE_ROOMS_QUERY,
        CREATE_SHOWINGS_QUERY,
        CREATE_TICKETS_QUERY,
    ]
    .iter()
    {
        let exe = conn.query(stmt);
        if let Err(e) = exe {
            eprintln!("Error: {:?}", e);
            return Status::new(500, "error creating tables");
        }
    }

    Status::new(201, "created")
}

#[delete("/drop_tables")]
pub fn drop_tables(mut conn: DBConn) -> Status {
    //! THE ORDER IS IMPORTANT HERE
    for stmt in [
        DROP_TABLE_TICKETS,
        DROP_TABLE_SHOWINGS,
        DROP_TABLE_ROOMS,
        DROP_TABLE_THEATERS,
        DROP_TABLE_MOVIES,
        DROP_TABLE_CUSTOMERS,
    ]
    .iter()
    {
        let exe = conn.query(stmt);
        if let Err(e) = exe {
            eprintln!("Error: {:?}", e);
            return Status::new(500, "error dropping tables");
        }
    }

    Status::new(204, "deleted")
}

use crate::debug_inserts::INSERTS;
#[post("/insert_debug_data")]
pub fn insert(mut conn: DBConn) -> Status {
    //! THE ORDER IS IMPORTANT HERE
    for stmt in INSERTS.iter() {
        let exe = conn.query(stmt);
        if let Err(e) = exe {
            eprintln!("Error: {:?}", e);
            return Status::new(500, "error inserting into tables");
        }
    }

    Status::new(201, "created")
}

pub static CREATE_CUSTOMERS_QUERY: &str = "CREATE TABLE `customers` (
    `customer_id` INT(16) NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(255) DEFAULT NULL,
    `lname` VARCHAR(255) DEFAULT NULL,
    `birthday` DATE DEFAULT NULL,
    PRIMARY KEY (`customer_id`)
) ENGINE=INNODB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;";

pub static CREATE_MOVIES_QUERY: &str = "CREATE TABLE `movies` (
  `movie_id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `rating` ENUM('E','PG','PG13','R','AO') DEFAULT NULL,
  `genre` VARCHAR(255) DEFAULT NULL,
  `length` INT(16) UNSIGNED NOT NULL,
  PRIMARY KEY (`movie_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;";

pub static CREATE_ROOMS_QUERY: &str =
"CREATE TABLE `rooms` (
  `room_id` INT(16) NOT NULL AUTO_INCREMENT,
  `capacity` INT(8) UNSIGNED NOT NULL,
  `theater_id` INT(16) NOT NULL,
  PRIMARY KEY (`room_id`),
  KEY `theater_id` (`theater_id`),
  CONSTRAINT `theater_id` FOREIGN KEY (`theater_id`) REFERENCES `theaters` (`theater_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;";

pub static CREATE_SHOWINGS_QUERY: &str =
"CREATE TABLE `showings` (
  `showing_id` INT(16) NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL,
  `movie_id` INT(16) NOT NULL,
  `room_id` INT(16) NOT NULL,
  PRIMARY KEY (`showing_id`),
  KEY `movie_id` (`movie_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;";

pub static CREATE_THEATERS_QUERY: &str = "CREATE TABLE `theaters` (
  `theater_id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `address_two` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(255) DEFAULT NULL,
  `state` VARCHAR(255) DEFAULT NULL,
  `zip` VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (`theater_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;";

pub static CREATE_TICKETS_QUERY: &str =
"CREATE TABLE `tickets` (
  `ticket_id` INT(16) NOT NULL AUTO_INCREMENT,
  `price` DECIMAL(10,0) NOT NULL,
  `showing_id` INT(16) DEFAULT NULL,
  `customer_id` INT(16) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `showing_id` (`showing_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `showing_id` FOREIGN KEY (`showing_id`) REFERENCES `showings` (`showing_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;
";

// DROP

pub static DROP_TABLE_CUSTOMERS: &str = "DROP TABLE IF EXISTS `customers`";
pub static DROP_TABLE_MOVIES: &str = "DROP TABLE IF EXISTS `movies`";
pub static DROP_TABLE_ROOMS: &str = "DROP TABLE IF EXISTS `rooms`";
pub static DROP_TABLE_SHOWINGS: &str = "DROP TABLE IF EXISTS `showings`";
pub static DROP_TABLE_THEATERS: &str = "DROP TABLE IF EXISTS `theaters`";
pub static DROP_TABLE_TICKETS: &str = "DROP TABLE IF EXISTS `tickets`";
