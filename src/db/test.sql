CREATE DATABASE amiibos CHARACTER SET "utf8";

USE amiibos;

CREATE TABLE characters (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;
CREATE TABLE amiiboseries (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;
CREATE TABLE gameseries (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;
CREATE TABLE types (name VARCHAR(255) PRIMARY KEY) ENGINE = InnoDB;

CREATE TABLE amiibos (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    image VARCHAR(255),
    fk_amiiboseries VARCHAR(255),
    fk_characters VARCHAR(255),
    fk_gameseries VARCHAR(255),
    fk_types VARCHAR(255),
    FOREIGN KEY (fk_amiiboseries) REFERENCES amiiboseries(name),
    FOREIGN KEY (fk_characters) REFERENCES characters(name),
    FOREIGN KEY (fk_gameseries) REFERENCES gameseries(name),
    FOREIGN KEY (fk_types) REFERENCES types(name)
) ENGINE = InnoDB;