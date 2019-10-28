CREATE TABLE IF NOT EXISTS `goodmovies`.`rooms` (
  `room_id` int(16) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `capacity` INT(8) UNSIGNED NOT NULL,
  `theater_id` int(16) NOT NULL,
  CONSTRAINT `theater_id` FOREIGN KEY (`theater_id`) REFERENCES theaters (`theater_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
