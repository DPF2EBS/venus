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
<title>Venus，前端可视化方案</title>
<script type="text/javascript">
var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-36468754-1']);
  _gaq.push(['_trackPageview']);
var vga=function(key){_gaq.push(['_trackPageview', key||''])},pageTracker={_trackPageview:vga};
</script>
<meta name="ROBOTS" content="NOINDEX, NOFOLLOW">
<link type="text/css" rel="stylesheet" href="../../Styles/page.css"></link>
<style>
h1, h2, h3 {margin-left:-25px; position:relative;}
h1 {margin-top:0;}
#sources li input {margin-left:2px}
#add {margin:5px 0 1em 40px}
.hide {display:none}
.items{overflow:hidden;margin-left:13px;}
.items li {height:40px;line-height:40px;background-color:#FFF;margin:10px;border-radius:4px;}
.items label {background-color:#999;padding-left:20px;cursor:pointer;color:#FFF;margin-right:30px;width:110px;display:inline-block;border-top-left-radius:4px;border-bottom-left-radius: 4px;}
.link-me {margin:10px 20px;margin-bottom:0px;}
.ext {text-decoration:none;color:#08C;}
.ext:hover {background-color:#08C;color:#FFF;}
.intro {color:#666;}
</style>
<body>
	<div class="header">
    	<div class="header-cont clearfix">
        <a class="header-logo" href="../../index.html"><img src="../../image/logonew.png" /></a>
        <div class="header-nav">
        	<ul>
            	<li><a href="../../index.html">首页</a></li>
              <li><a href="../../api.html">接口文档</a></li>
              <li><a href="../../svgpie.html">演示</a></li>
              <li><a href="../../svgcase.html">案例</a></li>
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
<ol id="sources" class="items">
   <li id="li0" class="Hide">
   		<label><input id="J_base" type="checkbox" checked="checked" size="20" value="js/base.min.js">&nbsp;基础</label>
		<span class="intro">基础</span>
   </li>
   <li id="li1">
   		<label><input id="J_svg" type="checkbox" checked="checked" size="20" value="js/svgchart.min.js" data-type="svgchart.min.js">&nbsp;基础图形</label>
		<span class="intro">基础图形包含柱状图、线状图、饼图和点图四种类型的图形</span>
   </li> 
   <li id="li2">
      <label><input id="J_topo" type="checkbox" size="20" value="js/topology.min.js" data-type="topology.min.js">&nbsp;拓扑图</label>
    <span class="intro">拓扑图是一种使用svg技术，展示节点间层级关系的可视化方案</span>
   </li>
   <li id="li3">
      <label><input id="J_heatmap" type="checkbox" size="20" value="js/heatmap.js" data-type="heatmap.min.js">&nbsp;热力图</label>
    <span class="intro">热力图是一个基于html5canvas实现，可以根据您提供的数据生成热力图的类库，它还能根据数据的变更动态更新</span>
   </li>
</ol>
<div id=bmUris></div>

<p style="margin:10px 20px;"><button id="update" class="button white" data="svgchart.min.js">确定所选图形并下载</button>
<span id="results" class="link-me hide">
    <a id="uriA" class="ext">/min</a>
</span>
</p>

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
<script type="text/javascript">
   (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
</script>
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
