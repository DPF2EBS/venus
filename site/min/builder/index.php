<?php
if (phpversion() < 5) {
    exit('Minify requires PHP5 or greater.');
}

// check for auto-encoding
$encodeOutput = (function_exists('gzdeflate')
                 && !ini_get('zlib.output_compression'));

// recommend $min_symlinks setting for Apache UserDir
$symlinkOption = '';
if (0 === strpos($_SERVER["SERVER_SOFTWARE"], 'Apache/')
    && preg_match('@^/\\~(\\w+)/@', $_SERVER['REQUEST_URI'], $m)
) {
    $userDir = DIRECTORY_SEPARATOR . $m[1] . DIRECTORY_SEPARATOR;
    if (false !== strpos(__FILE__, $userDir)) {
        $sm = array();
        $sm["//~{$m[1]}"] = dirname(dirname(__FILE__));
        $array = str_replace('array (', 'array(', var_export($sm, 1));
        $symlinkOption = "\$min_symlinks = $array;";
    }
}

require dirname(__FILE__) . '/../config.php';

if (! $min_enableBuilder) {
    header('Location: /');
    exit();
}

$setIncludeSuccess = set_include_path(dirname(__FILE__) . '/../lib' . PATH_SEPARATOR . get_include_path());
// we do it this way because we want the builder to work after the user corrects
// include_path. (set_include_path returning FALSE is OK).
try {
    require_once 'Minify/Cache/File.php';
} catch (Exception $e) {
    if (! $setIncludeSuccess) {
        echo "Minify: set_include_path() failed. You may need to set your include_path "
            ."outside of PHP code, e.g., in php.ini.";    
    } else {
        echo $e->getMessage();
    }
    exit();
}
require 'Minify.php';

$cachePathCode = '';
if (! isset($min_cachePath) && ! function_exists('sys_get_temp_dir')) {
    $detectedTmp = Minify_Cache_File::tmp();
    $cachePathCode = "\$min_cachePath = " . var_export($detectedTmp, 1) . ';';
}

ob_start();
?>
<!DOCTYPE html>
<title>Minify URI Builder</title>
<meta name="ROBOTS" content="NOINDEX, NOFOLLOW">
<link type="text/css" rel="stylesheet" href="../../Styles/page.css"></link>
<style>
h1, h2, h3 {margin-left:-25px; position:relative;}
h1 {margin-top:0;}
#sources {margin:0; padding:0;}
#sources li input {margin-left:2px}
#add {margin:5px 0 1em 40px}
.hide {display:none}
.items{overflow:hidden;}
.items li {height:40px;line-height:40px;background-color:#FFF;margin:10px;}
.items label {background-color:#F48307;padding-left:20px;cursor:pointer;color:#FFF;margin-right:30px;width:130px;display:inline-block;}
.link-me {margin:10px 20px;margin-bottom:0px;}
.ext {text-decoration:none;color:#66C;}
.ext:hover {background-color:#66C;color:#FFF;}
.intro {color:#666;}
</style>
<body>
	<div class="header">
    	<div class="header-cont clearfix">
            <a class="header-logo" href="#logo"><img src="../../image/logo.png" /></a>
            <div class="header-nav">
            	<ul>
                	<li><a href="../../index.html">首页</a></li>
                    <li><a href="../../api.html">接口文档</a></li>
                    <li class="J_menu">
						<a href="../../canvaspie.html" class="J_trigger">演示</a>
						<ul class="demo-menu J_list Hide">
							<li><a href="../../canvaspie.html">canvas</a></li>
							<li><a href="../../svgpie.html">svg</a></li>
						</ul>
					</li>
                    <li class="J_menu">
						<a href="../../canvascase.html" class="J_trigger">案例</a>
						<ul class="demo-menu J_list Hide">
							<li><a href="../../canvascase.html">canvas</a></li>
							<li><a href="../../svgcase.html">svg</a></li>
						</ul>
					</li>
					<li><a href="../../min/" target="_blank">下载</a></li>
                </ul>
		 </div>
		</div>
</div>
<?php if ($symlinkOption): ?>
    <div class=topNote><strong>Note:</strong> It looks like you're running Minify in a user
 directory. You may need the following option in /min/config.php to have URIs
 correctly rewritten in CSS output:
 <br><textarea id=symlinkOpt rows=3 cols=80 readonly><?php echo htmlspecialchars($symlinkOption); ?></textarea>
</div>
<?php endif; ?>
<?php if ($cachePathCode): ?>
<p class=topNote><strong>Note:</strong> <code><?php echo
    htmlspecialchars($detectedTmp); ?></code> was discovered as a usable temp directory.<br>To
    slightly improve performance you can hardcode this in /min/config.php:
    <code><?php echo htmlspecialchars($cachePathCode); ?></code></p>
<?php endIf; ?>

<div id="app" class="main">
<div class="intro-panel">
        <div class="isay-top pngfix"></div>
        <div class="isay-middle pngfix">
            <div class="intro-box clearfix">
                <h2>SVG下载区</h2>
            </div>
        </div>
		<div class="isay-bottom pngfix"></div>
</div>
<ol id="sources" class="items">
   <li id="li0">
   		<label><input type="checkbox" size="20" value="js/raphael-min.js">raphael.min.js</label>
		<span class="intro">Raphael.js是第三方库，我们基于此库来开发，所以这个是核心文件。</span>
   </li>
   <li id="li1">
   		<label><input type="checkbox" size="20" value="js/lang.js">lang.js</label>
		<span class="intro">Lang.js是基础的函数扩展库，比如常见的Array的each方法等。</span>
   </li> 
   <li id="li2">
   		<label><input type="checkbox" size="20" value="js/common.js">common.js</label>
		<span class="intro">Common.js是一些可视化工程所需的工具函数，比如getColor这样的函数获取随机的函数</span>
   </li>
	<li id="li3">
   		<label><input type="checkbox" size="20" value="js/venus.js">venus.js</label>
		<span class="intro">Venus.js是venus命名空间和配置的定义。</span>
   </li>
   <li id="li4">
   		<label><input type="checkbox" size="20" value="js/customevent.js">customevent.js</label>
		<span class="intro">Customevent.js是关于svg图形的事件的部分实现。（目前还是很弱）</span>
   </li>
   <li id="li5">
   		<label><input type="checkbox" size="20" value="js/svgchart.js">svgchart.js</label>
		<span class="intro">Svgchart.js是svg基础图形的总体实现步骤的代码实现，是架构和蓝图。</span>
   </li>
   <li id="li6">
   		<label><input type="checkbox" size="20" value="js/types/line.js">line.js</label>
		<span class="intro">Line.js是线图绘制的具体实现。</span>
   </li>
   <li id="li7">
   		<label><input type="checkbox" size="20" value="js/types/bar.js">bar.js</label>
		<span class="intro">Bar.js是柱状图绘制的具体实现。</span>
   </li>
   <li id="li8">
   		<label><input type="checkbox" size="20" value="js/types/pie.js">pie.js</label>
		<span class="intro">Pie.js是饼图绘制的具体实现。</span>
   </li>
   <li id="li9">
   		<label><input type="checkbox" size="20" value="js/types/dot.js">dot.js</label>
		<span class="intro">Dot.js是点图的绘制的具体实现。</span>
   </li> 
</ol>
<div id=bmUris></div>

<p><button id="update" class="button white">选择项合并下载</button></p>

<div id="results" class="link-me hide">
    <a id="uriA" class="ext">/min</a>
</div>
</div>
<div class="footer footer-static clearfix">
  <ul>
    <li><a target="_blank" href="http://www.dianping.com/aboutus" rel="nofollow">关于大众点评</a>|</li>
    <li><a target="_blank" href="http://www.dianping.com/" rel="nofollow">大众点评网</a>|</li>
    <li><a target="_blank" href="http://t.dianping.com/" rel="nofollow">点评团</a>|</li>
    <li><a target="_blank" href="index.html" rel="nofollow">关于我们</a></li>
  </ul>      
  <p>©2012 点评商务前端团队, All Rights Reserved.　　本站发布的所有内容，未经许可，不得转载。</p>      
</div>
<script>window.jQuery || document.write('<script src="jquery-1.6.3.min.js"><\/script>')</script>
<script>
(function () {
    var src = "../?f=" + location.pathname.replace(/\/[^\/]*$/, '/_index.js').substr(1);
    document.write('<\script src="' + src + '"><\/script>');
})();
</script>
</body>
<?php
$content = ob_get_clean();

// setup Minify
Minify::setCache(
    isset($min_cachePath) ? $min_cachePath : ''
    ,$min_cacheFileLocking
);
Minify::$uploaderHoursBehind = $min_uploaderHoursBehind;

Minify::serve('Page', array(
    'content' => $content
    ,'id' => __FILE__
    ,'lastModifiedTime' => max(
        // regenerate cache if any of these change
        filemtime(__FILE__)
        ,filemtime(dirname(__FILE__) . '/../config.php')
        ,filemtime(dirname(__FILE__) . '/../lib/Minify.php')
    )
    ,'minifyAll' => true
    ,'encodeOutput' => $encodeOutput
));
