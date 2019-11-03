CREATE TABLE IF NOT EXISTS `theaters` (
  `theater_id` INT(16) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `address` VARCHAR(255),
  `address_two` VARCHAR(255),
  `city` VARCHAR(255),
  `state` VARCHAR(255),
  `zip` VARCHAR(32)
) ENGINE = INNODB DEFAULT CHARSET = utf8;
