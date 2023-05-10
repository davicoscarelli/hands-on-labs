CREATE DATABASE IF NOT EXISTS `handsonlabsdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `handsonlabsdb`;

CREATE TABLE IF NOT EXISTS `accounts` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
  	`username` varchar(50) NOT NULL,
  	`password` varchar(255) NOT NULL,
  	`email` varchar(100) NOT NULL,
    `courses` varchar(255),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `accounts` (`id`, `username`, `password`, `email`, `courses`) VALUES (1, 'davicoscarelli', 'test123', 'test@test.com', '[]');