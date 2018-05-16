<?php
/**
 * Created by PhpStorm.
 * User: Ardrey
 * Date: 2016/6/3
 * Time: 16:35
 */

/**
 * @param string $param
 * @return string
 * 生成唯一id
 */
function makeUniqueId($param="")
{
    $str=md5(uniqid().rand(1,10000).$param);
    return $str;
}

/**
 * 截取指定2个字符之间字符串的方法
 * @param unknown $kw1
 * @param unknown $mark1
 * @param unknown $mark2
 * @return number|string
 */
function getNeedBetween($kw1, $mark1, $mark2)
{
    $kw = $kw1;
    $st = stripos($kw, $mark1);
    $ed = stripos($kw, $mark2);
    if (($st == false || $ed == false) || $st>=$ed)
        return 0;
    $kw = substr($kw, ($st + strlen($mark1)), ($ed - $st - strlen($mark2) - 5));
        return $kw;
}


