-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 27 oct. 2020 à 11:16
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de données : `amiibo`
--
CREATE DATABASE IF NOT EXISTS `amiibo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `amiibo`;

-- --------------------------------------------------------

--
-- Structure de la table `amiibo`
--

CREATE TABLE `amiibo` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text NOT NULL,
  `type_id` int(11) NOT NULL,
  `amiiboseries_id` int(11) NOT NULL,
  `gameseries_id` int(11) NOT NULL,
  `characters_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `amiiboseries`
--

CREATE TABLE `amiiboseries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `characters`
--

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `gameseries`
--

CREATE TABLE `gameseries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `type`
--

CREATE TABLE `type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `amiibo`
--
ALTER TABLE `amiibo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `amiiboseries_id` (`amiiboseries_id`),
  ADD KEY `gameseries_id` (`gameseries_id`),
  ADD KEY `characters_id` (`characters_id`);

--
-- Index pour la table `amiiboseries`
--
ALTER TABLE `amiiboseries`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `gameseries`
--
ALTER TABLE `gameseries`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `amiibo`
--
ALTER TABLE `amiibo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `amiiboseries`
--
ALTER TABLE `amiiboseries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `gameseries`
--
ALTER TABLE `gameseries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `type`
--
ALTER TABLE `type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `amiibo`
--
ALTER TABLE `amiibo`
  ADD CONSTRAINT `amiibo_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`),
  ADD CONSTRAINT `amiibo_ibfk_2` FOREIGN KEY (`characters_id`) REFERENCES `characters` (`id`),
  ADD CONSTRAINT `amiibo_ibfk_3` FOREIGN KEY (`amiiboseries_id`) REFERENCES `amiiboseries` (`id`),
  ADD CONSTRAINT `amiibo_ibfk_4` FOREIGN KEY (`gameseries_id`) REFERENCES `gameseries` (`id`);
COMMIT;
