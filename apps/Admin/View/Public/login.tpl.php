<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title><?php echo $G_VAR['title']; ?> 后台管理</title>
    <link rel="stylesheet" type="text/css" href="__STATIC__/admin/login/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="__STATIC__/admin/login/css/bootstrap.extend.css">
    <script type="text/javascript" src="__STATIC__/admin/login/js/jquery-1.11.1.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="__STATIC__/admin/login/js/bootstrap.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="__STATIC__/admin/login/js/bootstrap.extend.js" charset="utf-8"></script>
    <style>
        body {
            -webkit-font-smoothing: antialiased;
        }
        .background {
            position: absolute;
            right: 0px;
            top: 0px;
            bottom: 0px;
            left: 0px;
            background: url('__STATIC__/admin/login/images/wall/{:rand(1,9)}.jpg');
            background-size: 100% 100%;
            -moz-background-size: 100% 100%;
            -o-background-size: 100% 100%;
            -webkit-background-size: 100% 100%;
            -ms-background-size: 100% 100%;
            filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
        }
        .navbar {
            background: rgba(0,0,0,0.3);
        }
        .login-panel {
            box-shadow: 0px 10px 60px rgba(0,0,0,0.4);
            background: rgba(255,255,255,0.9);
            margin-top: 10%;
        }
        .login-panel .panel-heading{
            height: 150px;
            background: #6699cc url('__STATIC__/admin/login/images/login.png');
        }
        .login-panel .panel-heading .panel-title{
            color: #fff;
            font-size: 32px;
            padding-top: 30px;
            padding-bottom: 5px;
            font-weight: lighter;
            -webkit-box-reflect: below -4px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(255, 255, 255, 0.2)));
        }
        .login-panel .panel-heading .panel-title .logo{
            width: 40px;
            height: 40px;
            margin-top: -10px;
        }
        .login-panel .panel-heading .info{
            color: #aaddff;
            margin-top: 40px;
        }
        .login-panel .panel-body{
            padding: 38px;
        }
        .form-group .btn{
			padding: 10px 12px;
        	font-size:16px;
        }
        .bottom {
            color: #eee;
            font-size: 13px;
            background: rgba(0,0,0,0.3);
        }
        @media (max-width: 768px) {
            .login-panel .panel-body{
                padding: 18px;
            }
        }
    </style>
    <script type="text/javascript">
        $(function(){
            particlesJS('particles-js', {
                particles: {
                    color: '#fff',
                    shape: 'triangle', // "circle", "edge" or "triangle"
                    opacity: 1,
                    size: 4,
                    size_random: true,
                    nb: 150,
                    line_linked: {
                        enable_auto: true,
                        distance: 100,
                        color: '#fff',
                        opacity: 1,
                        width: 1,
                        condensed_mode: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 600
                        }
                },
                anim: {
                    enable: true,
                    speed: 1
                }
                },
                interactivity: {
                    enable: true,
                    mouse: {
                    distance: 250
                },
                detect_on: 'canvas', // "canvas" or "window"
                    mode: 'grab',
                    line_linked: {
                    opacity: .5
                },
                events: {
                    onclick: {
                    enable: true,
                    mode: 'push', // "push" or "remove" (particles)
                    nb: 4
                    }
                }
                },
                /* Retina Display Support */
                retina_detect: true
            });
        })
    </script>
</head>
<body>
    <div id="particles-js" class="background"></div>
    <div class="container">
        <div class="panel panel-default login-panel border-none padding-none col-xs-12 col-md-4 col-md-offset-4">
            <div class="panel-heading">
                <h3 class="panel-title text-center">智爱生活网</h3>
                <div class="info text-right" style="margin-top:25px;">————网站管理后台</div>
            </div>
            <div class="panel-body">
                <form class="login-form" action="<?php echo U('Admin/Public/postLogin');?>" method="post">
                    <div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon bg-none"><i class="fa fa-user"></i></span>
                            <input type="text" class="form-control" placeholder="用户名" name="account">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon bg-none"><i class="fa fa-lock"></i></span>
                            <input type="password" class="form-control" placeholder="请输入密码" name="password">
                        </div>
                    </div>
                    
                    <div class="space" style="margin-top:23px"></div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-block submit ajax-post" target-form="login-form">登 录</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="bottom navbar-fixed-bottom text-center padding-top padding-bottom">
        <span>Copyright © 广州智安天使网络科技有限公司   All rights reserved.</span>
    </div>
</body>
</html>
{__NOLAYOUT__}

