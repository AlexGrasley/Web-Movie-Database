CREATE TABLE IF NOT EXISTS `goodmovies`.`theaters` (
  `theater_id` int(16) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `address` VARCHAR(255),
  `address_two` VARCHAR(255),
  `city` VARCHAR(255),
  `state` VARCHAR(255),
  `zip` VARCHAR(32)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
