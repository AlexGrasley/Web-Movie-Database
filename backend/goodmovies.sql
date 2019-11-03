/*
SQLyog Community v13.1.5  (64 bit)
MySQL - 5.5.14 : Database - goodmovies
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


USE `cs340_grasleal`;

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `customer_id` INT(16) NOT NULL AUTO_INCREMENT,
  `fname` VARCHAR(255) DEFAULT NULL,
  `lname` VARCHAR(255) DEFAULT NULL,
  `birthday` DATE DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=INNODB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `customers` */

INSERT  INTO `customers`(`customer_id`,`fname`,`lname`,`birthday`) VALUES 
(3,'omnis','praesentium','2006-01-16');

/*Table structure for table `movies` */

DROP TABLE IF EXISTS `movies`;

CREATE TABLE `movies` (
  `movie_id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `rating` ENUM('E','PG','PG13','R','AO') DEFAULT NULL,
  `genre` VARCHAR(255) DEFAULT NULL,
  `length` INT(16) UNSIGNED NOT NULL,
  PRIMARY KEY (`movie_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*Data for the table `movies` */

/*Table structure for table `rooms` */

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `room_id` INT(16) NOT NULL AUTO_INCREMENT,
  `capacity` INT(8) UNSIGNED NOT NULL,
  `theater_id` INT(16) NOT NULL,
  PRIMARY KEY (`room_id`),
  KEY `theater_id` (`theater_id`),
  CONSTRAINT `theater_id` FOREIGN KEY (`theater_id`) REFERENCES `theaters` (`theater_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*Data for the table `rooms` */

/*Table structure for table `showings` */

DROP TABLE IF EXISTS `showings`;

CREATE TABLE `showings` (
  `showing_id` INT(16) NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL,
  `movie_id` INT(16) NOT NULL,
  `room_id` INT(16) NOT NULL,
  PRIMARY KEY (`showing_id`),
  KEY `movie_id` (`movie_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*Data for the table `showings` */

/*Table structure for table `theaters` */

DROP TABLE IF EXISTS `theaters`;

CREATE TABLE `theaters` (
  `theater_id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `address_two` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(255) DEFAULT NULL,
  `state` VARCHAR(255) DEFAULT NULL,
  `zip` VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (`theater_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*Data for the table `theaters` */

/*Table structure for table `tickets` */

DROP TABLE IF EXISTS `tickets`;

CREATE TABLE `tickets` (
  `ticket_id` int(16) NOT NULL AUTO_INCREMENT,
  `price` decimal(10,0) NOT NULL,
  `showing_id` int(16) DEFAULT NULL,
  `customer_id` int(16) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `showing_id` (`showing_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `showing_id` FOREIGN KEY (`showing_id`) REFERENCES `showings` (`showing_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tickets` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
