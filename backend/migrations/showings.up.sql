CREATE TABLE IF NOT EXISTS `goodmovies`.`showings` (
  `showing_id` int(16) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `time` DATETIME NOT NULL,
  `movie_id` int(16) NOT NULL,
  `room_id` int(16) NOT NULL,
  CONSTRAINT `movie_id` FOREIGN KEY (`movie_id`) REFERENCES movies (`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `room_id` FOREIGN KEY (`room_id`) REFERENCES rooms (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
