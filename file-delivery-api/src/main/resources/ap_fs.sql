CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `image` varchar(255),
  `name` varchar(64) NOT NULL,
  `desc` varchar(255),
  `last_updated` DATE,
  `tags` varchar(255),
  `website` varchar(255),
  `isPrivate` tinyint(1) NOT NULL DEFAULT 0,
  `owner` varchar(32) NOT NULL,
  `location` varchar(128) NOT NULL
);
#
CREATE TABLE IF NOT EXISTS `modules` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(64) NOT NULL,
    `desc` VARCHAR(255),
    `image` VARCHAR(255),
    `port` INT(5),
    `framework` VARCHAR(64),
    `language` VARCHAR(32),
    `version` VARCHAR(32),
    `config_type` VARCHAR(255),
    `location` VARCHAR(255) NOT NULL UNIQUE,
    `project_id` INT(11) NOT NULL
);
#
CREATE TABLE IF NOT EXISTS `dockerfiles` (
    `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
CREATE TABLE IF NOT EXISTS `compose_blocks` (
    `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;