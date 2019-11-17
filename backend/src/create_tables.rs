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
