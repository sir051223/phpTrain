<?php
/** +----------------------------------------------------------------------
 *  | 智安科技  -- 文章管理 模型
 *  +----------------------------------------------------------------------
 *  | Copyright (c) 2015 智安科技  All rights reserved.
 *  +----------------------------------------------------------------------
 *  | Author: Cengp $   2015-08-30
 *  +----------------------------------------------------------------------
 */
namespace Common\Model;

class ArticleModel extends CommonModel
{

    protected $connection = 'EXT_CONFIG';

	/*自动验证*/
    protected $_validate = [
        ['title', 'require', '文章标题不能为空！', 1, 'regex', 3],
    	['excerpt', 'require', '文章摘要不能为空！', 1, 'regex', 3]
    ];

    /*自动完成*/
    protected $_auto = [
    	['issuedtime','strtotime',3,'function']
    ];

    public function getList($cond = null)
    {
    	$res = $this->table('za_article A')->join('left join za_article_cat B ON A.cat_id = B.id')
    			->join('left join db_common.za_admin_account C ON A.author = C.uid ')
				->field('A.*, B.name, C.account')
				->where($cond)->order('id desc')->select();
    	return $res;
    }

    /**
     * 随机特惠新闻   特惠新闻id固定为8
     */
    public function randNews($article_ids = '')
    {
    	if ($article_ids == '') {
	    	$ids = $this->field('id')->where(array('cat_id' => 8))->select();
	    	$rand_id = array_rand($ids);
	    	$rand_id = $ids[$rand_id]['id'];
	    	$res = $this->field('id, title, addtime, cat_id')->where(array('id' => $rand_id))->select();
    	} else {
    		$ids = json_decode($article_ids);
    		$cond['id'] = array('in', $ids);
    		$res = $this->field('id, title, addtime, cat_id')->where($cond)->select();
    	}
    	return $this->getCatname($res);
    }

    public function getCatname($arr)
    {
    	foreach ($arr AS $k => $v){
    		$arr[$k]['cat_name'] = D('ArticleCat')->where(array('id' => $v['cat_id']))->getField('name');
    	}
    	return $arr;
    }

    /**
     * 随机新闻列表
     */
    public function randNewsList()
    {
    	$maxid = $this->max('id');
    	$oid = rand(0, $maxid);
    	$cond['cat_id'] = array('neq',  6);
    	return $this->field('id, title, addtime')->where($cond)->order('id = '.$oid.' desc')->limit(8)->select();
    }

    /**
     * 获取推荐文章进行轮播
     */
    public function ArtCarousel()
    {
        $ArtCarousel = D('Article')->where('recommended=1')->order('list_order desc')->limit(4)->Field('id, cat_id, title, article_logo')->select();
        foreach ($ArtCarousel as $k => $v) {
            $ArtCarousel[$k]['name'] = D('ArticleCat')->where(['id' => $v['cat_id']])->getField('name');
        }
        return $ArtCarousel;
    }

    /**
     * 获取推荐文章进行轮播
     */
    public function ArtList($p, $cat_id, $start_limit, $city)
    {
        if (!empty($p) && $cat_id>=0) {
            if ($cat_id == 0) {
                $ArtList = D('Article')->order('list_order desc')->Field('id, cat_id, title, article_logo, excerpt, addtime')->limit($start_limit, 10)->select();
            } else {
                $ArtList = D('Article')->order('list_order desc')->limit($start_limit, 10)->where(['cat_id' => $cat_id])->Field('id, cat_id, title, article_logo, excerpt, addtime')->select();
            }
            // 查询满足要求的总记录数
            if ($cat_id == 0) {
                $count = D('Article')->count();
            } else {
                $count = D('Article')->where(['cat_id' => $cat_id])->count();
            }
        } else {
            $ArtList = D('Article')->order('list_order desc')->limit(10)->Field('id, cat_id, title, article_logo, excerpt, addtime')->select();
            $count = D('Article')->count();// 查询满足要求的总记录数
        }
        foreach ($ArtList as $k => $v) {
            $ArtList[$k]['name'] = D('ArticleCat')->where(['id' => $v['cat_id']])->getField('name');
            $ArtList[$k]['addtime'] = date('Y-m-d', $ArtList[$k]['addtime']);
        }
        //获取精选文章和推荐楼盘
        $ArtList_count = count($ArtList);
        if (3 > $ArtList_count) {
            $num = 3;
        } elseif(3 < $ArtList_count && 5 > $ArtList_count) {
            $num = 4;
        } elseif(5 < $ArtList_count && 7 > $ArtList_count) {
            $num = 5;
        } else {
            $num = 6;
        }
        //获取精选文章
        $ArtList['article'] = $this->articleList($num);
        //获取推荐楼盘
        $ArtList['building'] = $this->buildingList($num, $city);
        $ArtList['page'] = intval(ceil($count/10));
        return $ArtList;
    }

    /**
     * 获取精选（置顶）文章
     */
    public function ArtIstop()
    {
        $ArtIstop = D('Article')->order('list_order desc')->where('istop=1')->Field('id, cat_id, title, article_logo, excerpt, addtime')->select();
        foreach ($ArtIstop as $k => $v) {
            $ArtIstop[$k]['name'] = D('ArticleCat')->where(['id' => $v['cat_id']])->getField('name');
            $ArtIstop[$k]['addtime'] = date('Y-m-d', $ArtIstop[$k]['addtime']);
        }
        return $ArtIstop;
    }

    /**
     * 文章详情
     */
    public function ArtDetail($id, $city)
    {
        $info = D('Article')->where(['id' => $id])->find();
        foreach ($info as $k => $v) {
            $info['author'] = D('AdminAccount')->where(['uid' => $v['author']])->getField('account');
        }
        $info['content'] = htmlspecialchars_decode($info['content']);
        //获取精选文章
        $info['article'] = $this->articleList(6, $id);
        //获取推荐楼盘
        $info['building'] = $this->buildingList(6, $city);
        return $info;
    }

    /**
     * 相关文章
     */
    public function randArtList($id)
    {
        $where['status'] = array('eq', '1');
        $where['id'] = array('neq', $id);
        $cat_id = D('Article')->where(['id' => $id])->getField('cat_id');
        $where['cat_id'] = array('eq', $cat_id);
        $list = D('Article')->order('list_order desc')->where($where)->limit(8)->Field('id, title, article_logo, excerpt, cat_id, addtime')->select();
        if (count($list) != 8) {
            $num = 8 - count($list);
            $map['cat_id'] = array('neq', $cat_id);
            $map['istop'] = array('eq', '0');
            $map['status'] = $where['status'];
            if ($num != 8){
                $list_add = D('Article')->order('list_order desc')->where($map)->limit($num)->Field('id, title')->select();
                $list =array_merge($list, $list_add);
            } else {
                $list = D('Article')->order('list_order desc')->where($map)->limit($num)->Field('id, title')->select();
            }
        }
        return $list;
    }

    /**
     * 精选文章
     */
    public function articleList($num, $id, $type = NULL)
    {
        //文章详情则除去再看文章
        if (!empty($id)) {
            $where['id'] = array('neq', $id);
            $where['istop'] = array('eq', '1');
            $articleList = D('Article')->where($where)->order('list_order desc')->limit($num)->Field('istop, id, cat_id, title, article_logo, excerpt, addtime')->select();
        } else {
            if (!$type) {
                $where['istop'] = array('eq', '1');
            }
            $articleList = D('Article')->where($where)->order('list_order desc')->limit($num)->Field('istop, id, cat_id, title, article_logo, excerpt, addtime')->select();
        }

        foreach ($articleList as $k => $v) {
            $articleList[$k]['name'] = D('ArticleCat')->where(['id' => $v['cat_id']])->getField('name');
            $articleList[$k]['addtime'] = date('Y-m-d', $articleList[$k]['addtime']);
        }
        return $articleList;
    }

     /**
     * 推荐楼盘
     */
    public function buildingList($num, $city, $page = array())
    {
        $city['list_show'] = 1;
        $city['is_del'] = 0;
        $buildingList = D('House')->field('id, name, location, house_cat, webprice, ad_logo, city, province, avgprice')->where($city)->order("list_order asc")->limit($num)->select();
        foreach ($buildingList as $k => $v) {
            $buildingList[$k]['imgurl'] = D('HouseImg')->where(['house_id' => $v['id']])->order('listorder desc')->getField('imgurl');
            $where['id'] = ['in', json_decode($v['house_cat'])];
            $houseType = D('HouseCat')->where($where)->getField('name', true);
            $buildingList[$k]['houseType'] = implode('/', $houseType);
        }
        $page = array_merge($page, $buildingList);
        if ($num != count($page)) {
            if ($city['cityname']) {
                unset($city['cityname']);
                $city['city'] = ['neq', $city['city']];
                $city['type'] = 1;
                $num = $num - count($page);
                $page = $this->buildingList($num, $city, $page);
            } else if ($city['type'] == 1) {
                $city['province'] = ['neq', $city['province']];
                unset($city['type']);
                $page = $this->buildingList($num, $city, $page);
            }
        }
        return $page;
    }

    /**
     * 移动端楼盘列表
     */
    public function mobileList($page, $cat_id)
    {
        if ($cat_id == 0) {
            $ArtList = D('Article')->order('list_order desc')->where(['cat_id' => ['neq', 6]])->Field('id, cat_id, title, article_logo, excerpt, addtime')->limit(0, $page)->select();
            $count = D('Article')->count();
        } else {
            $ArtList = D('Article')->order('list_order desc')->limit(0, $page)->where(['cat_id' => $cat_id])->Field('id, cat_id, title, article_logo, excerpt, addtime')->select();
            $count = D('Article')->where(['cat_id' => $cat_id])->count();
        }
        foreach ($ArtList as $k => $v) {
            $ArtList[$k]['name'] = D('ArticleCat')->where(['id' => $v['cat_id']])->getField('name');
            $ArtList[$k]['addtime'] = date('Y-m-d', $ArtList[$k]['addtime']);
        }
        return ['list' => $ArtList, 'count' => $count];
    }

    /**
     * ajax获取更多
     */
    public function _getMore($p, $cat_id)
    {
        $list = D('Article')->mobileList($p, $cat_id);
        $li = '';
        foreach ($list['list'] as $k => $v) {
            $li .= '<li>';
            $li .= '<a href="/Wap/Article/detail?id='.$v['id'].'">';
            if ($v['article_logo']) {
                $li .= '<img src="/'.$v['article_logo'].'">';
            } else {
                $li .= '<img src="'.__STATIC__.'/wap/201708/images/img3.jpg">';
            }
            $li .= '<div class="words">';
            $li .= '<p class="title">'.$v['title'].'</p>';
            $li .= '<p class="tags">'.$v['excerpt'].'</p>';
            $li .= '</div>';
            $li .= '<p class="sort">'.$v['name'].'<span> '.$v['addtime'].'</span></p>';
            $li .= '</a>';
            $li .= '</li>';
        }

        $res['li'] = $li;
        if (count($list['list']) < $p) {
            $res['more'] = 1;
        }
        return $res;
    }
}

?>