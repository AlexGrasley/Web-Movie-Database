CREATE TABLE IF NOT EXISTS `goodmovies`.`movies` (
  `movie_id` int(16) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `rating` ENUM('E', 'PG', 'PG13', 'R', 'AO'),
  `genre` VARCHAR(255),
  `length` INT(16) UNSIGNED NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
