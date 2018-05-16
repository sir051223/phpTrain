-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2018-05-16 10:20:54
-- 服务器版本： 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_train`
--

-- --------------------------------------------------------

--
-- 表的结构 `za_access`
--

CREATE TABLE `za_access` (
  `role_id` smallint(6) UNSIGNED NOT NULL,
  `g` varchar(20) NOT NULL COMMENT '项目',
  `m` varchar(20) NOT NULL COMMENT '模块',
  `a` varchar(20) NOT NULL COMMENT '方法'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `za_admin_account`
--

CREATE TABLE `za_admin_account` (
  `uid` int(11) NOT NULL COMMENT '用户uid',
  `unitname` varchar(50) DEFAULT 'aoyuan' COMMENT '所属单位名',
  `account` varchar(64) NOT NULL COMMENT '用户名',
  `password` varchar(32) DEFAULT NULL COMMENT '密码',
  `status` tinyint(2) DEFAULT '0' COMMENT '账号状态 0=启用，1=禁用 ',
  `addtime` int(11) NOT NULL DEFAULT '0' COMMENT '添加时间',
  `adduid` int(11) DEFAULT NULL COMMENT '添加人',
  `updatetime` int(11) DEFAULT '0' COMMENT '更新时间',
  `updateuid` int(11) DEFAULT NULL COMMENT '更新人',
  `logintotal` int(11) NOT NULL DEFAULT '0' COMMENT '总登陆次数',
  `lastlogin` int(11) DEFAULT '0' COMMENT '最后登陆时间',
  `role_id` int(8) NOT NULL COMMENT '角色id',
  `loginip` varchar(60) DEFAULT NULL COMMENT '最后登录ip',
  `mobile` varchar(20) DEFAULT NULL COMMENT '后台管理员手机'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `za_admin_account`
--

INSERT INTO `za_admin_account` (`uid`, `unitname`, `account`, `password`, `status`, `addtime`, `adduid`, `updatetime`, `updateuid`, `logintotal`, `lastlogin`, `role_id`, `loginip`, `mobile`) VALUES
(1, 'any', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 0, 1440041686, 1, 0, NULL, 8113, 1526438128, 1, '127.0.0.1', NULL),
(345, 'any', 'erji', 'e10adc3949ba59abbe56e057f20f883e', 0, 1526462434, 1, 0, NULL, 0, 0, 2, NULL, '13828460969');

-- --------------------------------------------------------

--
-- 表的结构 `za_admin_log`
--

CREATE TABLE `za_admin_log` (
  `logid` int(11) NOT NULL COMMENT '日志自增id',
  `unitname` varchar(50) DEFAULT NULL COMMENT '所属单位名',
  `uid` int(11) NOT NULL COMMENT '用户uid',
  `account` varchar(64) NOT NULL COMMENT '用户名',
  `table` varchar(128) DEFAULT NULL COMMENT '操作表名',
  `subject` varchar(128) DEFAULT NULL COMMENT '日志标题',
  `summary` varchar(300) DEFAULT NULL COMMENT '日志摘要',
  `category` varchar(64) DEFAULT NULL COMMENT '日志分类',
  `action` varchar(30) DEFAULT NULL COMMENT '操作方法名',
  `datakey` int(11) DEFAULT NULL COMMENT '涉及到的数据记录id',
  `logtime` int(11) NOT NULL DEFAULT '0' COMMENT '日志记录时间',
  `logip` varchar(15) DEFAULT NULL COMMENT '日志记录ip'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `za_admin_log`
--

INSERT INTO `za_admin_log` (`logid`, `unitname`, `uid`, `account`, `table`, `subject`, `summary`, `category`, `action`, `datakey`, `logtime`, `logip`) VALUES
(20358, NULL, 1, 'admin', NULL, '添加管理员', '成功！', 'User', 'account_add', 345, 1526462434, '127.0.0.1');

-- --------------------------------------------------------

--
-- 表的结构 `za_article`
--

CREATE TABLE `za_article` (
  `id` int(11) UNSIGNED NOT NULL,
  `unitname` varchar(50) NOT NULL COMMENT '所属单位',
  `author` int(11) UNSIGNED DEFAULT '0' COMMENT '发布者id',
  `keywords` varchar(150) NOT NULL COMMENT 'seo关键字',
  `source` varchar(150) DEFAULT NULL COMMENT '转载文章的来源',
  `content` longtext COMMENT '文章内容',
  `title` varchar(200) DEFAULT NULL COMMENT '文章标题',
  `excerpt` text COMMENT '文章摘要',
  `status` int(2) DEFAULT '1' COMMENT 'post状态，1已审核，0未审核',
  `comment_status` int(2) DEFAULT '1' COMMENT '评论状态，1允许，0不允许',
  `addtime` int(11) DEFAULT '0' COMMENT '文章添加日期，永久不变，一般不显示给用户',
  `updatetime` int(11) DEFAULT '0' COMMENT '更新时间，可在前台修改，显示给用户',
  `cat_id` int(11) UNSIGNED DEFAULT '0' COMMENT '所属文章分类',
  `smeta` text COMMENT 'post的扩展字段，保存相关扩展属性，如缩略图；格式为json',
  `hitscount` int(11) DEFAULT '0' COMMENT '点击查看数',
  `likecount` int(11) DEFAULT '0' COMMENT '点赞数',
  `istop` tinyint(1) NOT NULL DEFAULT '0' COMMENT '置顶 1置顶； 0不置顶',
  `recommended` tinyint(1) NOT NULL DEFAULT '0' COMMENT '推荐 1推荐 0不推荐',
  `article_logo` varchar(100) DEFAULT NULL COMMENT '文章logo',
  `issuedtime` int(11) NOT NULL DEFAULT '1444361807' COMMENT '发布时间',
  `list_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `za_article_cat`
--

CREATE TABLE `za_article_cat` (
  `id` int(11) UNSIGNED NOT NULL COMMENT '分类id',
  `name` varchar(200) DEFAULT NULL COMMENT '分类名称',
  `description` longtext COMMENT '分类描述',
  `parent_id` int(11) UNSIGNED DEFAULT '0' COMMENT '分类父id',
  `seo_title` varchar(500) DEFAULT NULL,
  `seo_keywords` varchar(500) DEFAULT NULL,
  `seo_description` varchar(500) DEFAULT NULL,
  `listorder` int(5) NOT NULL DEFAULT '0' COMMENT '排序',
  `cat_logo` varchar(100) DEFAULT NULL COMMENT '分类logo'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `za_menu`
--

CREATE TABLE `za_menu` (
  `id` smallint(6) UNSIGNED NOT NULL,
  `parentid` smallint(6) UNSIGNED NOT NULL DEFAULT '0',
  `app` char(20) CHARACTER SET utf8 NOT NULL COMMENT '应用名称app',
  `model` char(20) CHARACTER SET utf8 NOT NULL COMMENT '控制器',
  `action` char(20) CHARACTER SET utf8 NOT NULL COMMENT '操作名称',
  `data` char(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '额外参数',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '菜单类型  1：权限认证+菜单；0：只作为菜单',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '状态，1显示，0不显示',
  `name` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '菜单名称',
  `icon` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '菜单图标',
  `remark` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '备注',
  `listorder` smallint(6) UNSIGNED NOT NULL DEFAULT '0' COMMENT '排序ID',
  `owner` varchar(20) CHARACTER SET utf8 NOT NULL DEFAULT 'normal' COMMENT '菜单归属 weixin:微信菜单  normal:普通菜单'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `za_menu`
--

INSERT INTO `za_menu` (`id`, `parentid`, `app`, `model`, `action`, `data`, `type`, `status`, `name`, `icon`, `remark`, `listorder`, `owner`) VALUES
(286, 0, 'User', 'Indexadmin', 'default', '', 1, 1, '用户管理', 'group', '', 2, 'normal'),
(290, 286, 'User', 'Indexadmin', 'default3', '', 1, 1, '管理组', '', '', 0, 'normal'),
(291, 290, 'Admin', 'Rbac', 'index', '', 1, 1, '角色管理', '', '', 0, 'normal'),
(292, 290, 'Admin', 'User', 'index', '', 1, 1, '管理员', '', '', 0, 'normal'),
(293, 0, 'Admin', 'Menu', 'default', '', 1, 1, '菜单管理', 'list', '', 3, 'normal'),
(297, 293, 'Admin', 'Menu', 'index', '', 1, 1, '后台菜单', '', '', 0, 'normal'),
(340, 307, 'Admin', 'Loupan', 'mpage', '', 0, 0, '新移动落地页', '', '', 0, 'normal');

-- --------------------------------------------------------

--
-- 表的结构 `za_role`
--

CREATE TABLE `za_role` (
  `id` smallint(6) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL DEFAULT '角色名称',
  `status` tinyint(1) UNSIGNED DEFAULT NULL COMMENT '状态',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` int(11) UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(11) UNSIGNED NOT NULL DEFAULT '0' COMMENT '更新时间',
  `listorder` int(3) NOT NULL DEFAULT '0' COMMENT '排序字段'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `za_role`
--

INSERT INTO `za_role` (`id`, `name`, `status`, `remark`, `create_time`, `update_time`, `listorder`) VALUES
(1, '超级管理员', 1, '拥有网站最高管理员权限！', 1329633709, 1329633709, 0),
(2, '管理员', 1, '普通管理员', 1526462214, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `za_access`
--
ALTER TABLE `za_access`
  ADD KEY `groupId` (`role_id`),
  ADD KEY `gma` (`g`,`m`,`a`,`role_id`);

--
-- Indexes for table `za_admin_account`
--
ALTER TABLE `za_admin_account`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `za_admin_log`
--
ALTER TABLE `za_admin_log`
  ADD PRIMARY KEY (`logid`);

--
-- Indexes for table `za_article`
--
ALTER TABLE `za_article`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `za_article_cat`
--
ALTER TABLE `za_article_cat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `za_menu`
--
ALTER TABLE `za_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `za_role`
--
ALTER TABLE `za_role`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `za_admin_account`
--
ALTER TABLE `za_admin_account`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户uid', AUTO_INCREMENT=346;
--
-- 使用表AUTO_INCREMENT `za_admin_log`
--
ALTER TABLE `za_admin_log`
  MODIFY `logid` int(11) NOT NULL AUTO_INCREMENT COMMENT '日志自增id', AUTO_INCREMENT=20359;
--
-- 使用表AUTO_INCREMENT `za_article`
--
ALTER TABLE `za_article`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `za_article_cat`
--
ALTER TABLE `za_article_cat`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类id';
--
-- 使用表AUTO_INCREMENT `za_menu`
--
ALTER TABLE `za_menu`
  MODIFY `id` smallint(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=382;
--
-- 使用表AUTO_INCREMENT `za_role`
--
ALTER TABLE `za_role`
  MODIFY `id` smallint(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
