CREATE TABLE IF NOT EXISTS `goodmovies`.`tickets` (
  `ticket_id` int(16) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `price` DECIMAL NOT NULL,
  `showing_id` int(16),
  `customer_id` int(16),
  CONSTRAINT `showing_id` FOREIGN KEY (`showing_id`) REFERENCES showings (`showing_id`) ON DELETE
  SET
    NULL ON UPDATE CASCADE,
    CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES customers (`customer_id`) ON DELETE
  SET
    NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
