CREATE TABLE IF NOT EXISTS `goodmovies`.`customers` (
  `customer_id` int(16) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `fname` VARCHAR(255),
  `lname` VARCHAR(255),
  `birthday` DATE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
