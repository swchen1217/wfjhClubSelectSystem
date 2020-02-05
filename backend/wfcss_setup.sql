-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2020-02-04 00:51:27
-- 伺服器版本： 10.1.40-MariaDB
-- PHP 版本： 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `wfcss`
--

-- --------------------------------------------------------

--
-- 資料表結構 `announcement`
--

CREATE TABLE `announcement` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `hyperlink` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `posttime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `clubs`
--

CREATE TABLE `clubs` (
  `id` int(255) NOT NULL,
  `name` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `teacher` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `grade` int(8) NOT NULL,
  `isSpecial` tinyint(1) NOT NULL,
  `sort_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `result`
--

CREATE TABLE `result` (
  `sid` int(255) NOT NULL,
  `cid` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `second`
--

CREATE TABLE `second` (
  `sid` int(11) NOT NULL,
  `cid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `selected`
--

CREATE TABLE `selected` (
  `class` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `selects`
--

CREATE TABLE `selects` (
  `sid` int(255) NOT NULL,
  `definite` int(255) NOT NULL,
  `alternate1` int(255) NOT NULL,
  `alternate2` int(255) NOT NULL,
  `alternate3` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `students`
--

CREATE TABLE `students` (
  `sid` int(11) NOT NULL,
  `grade` int(255) NOT NULL,
  `class` int(255) NOT NULL,
  `number` int(255) NOT NULL,
  `name` varchar(256) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `system`
--

CREATE TABLE `system` (
  `id` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `value` varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `account` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `isAdmin` int(255) NOT NULL,
  `class` int(255) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`account`, `password`, `name`, `isAdmin`, `class`, `created`) VALUES
('admin', 'f1c27a30dae287cc7cf0fcf7d9416aee', '管理員', 1, -1, '2020-01-17 21:50:00');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sort_id` (`sort_id`);

--
-- 資料表索引 `result`
--
ALTER TABLE `result`
  ADD PRIMARY KEY (`sid`);

--
-- 資料表索引 `second`
--
ALTER TABLE `second`
  ADD PRIMARY KEY (`sid`);

--
-- 資料表索引 `selected`
--
ALTER TABLE `selected`
  ADD PRIMARY KEY (`class`);

--
-- 資料表索引 `selects`
--
ALTER TABLE `selects`
  ADD PRIMARY KEY (`sid`);

--
-- 資料表索引 `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`sid`);

--
-- 資料表索引 `system`
--
ALTER TABLE `system`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`account`);

--
-- 在傾印的資料表使用自動增長(AUTO_INCREMENT)
--

--
-- 使用資料表自動增長(AUTO_INCREMENT) `announcement`
--
ALTER TABLE `announcement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
