# Heatmap
一个基于HTML5 canvas的热力图绘制的JavaScript库。
## 它是如何工作的
- 更具输入的数据算出相关坐标中的落点数`count`
- 求取`count`的最大值`max`
- 更具`count/max`在相关坐标点上绘制镜像的alpha渐变
- 获取canvas上的`imageData`，遍历整个图像数据，根据坐标点的alpha通道值在色环上取值，再绘制在改点上

## 如何使用
- 不依赖于其他任何类库
- 引用`heatmap.js`到页面中
- 使用`new Heatmap(canvasElement, config)`初始化一个Heatmap实例，`canvasElement`为HTML5 canvas元素
- 可配置项有：
    - **readius**（可选）：Number，单个热点的半径
    - **opacity**（可选）：Number，Heatmap的透明度
## 使用示例

```javascript
var config = {
    readius:50,
    opacity:0.9 
};

//实例化热力图对象
var heatmap =  new Heapmap(document.getElmentById("canvas"), config);

//初始化（动态设置）数据集
heatmap.setPointSet([[43,645], [5436,1], [1,76], [6546,65] /*...*/]);
//or
heatmap.setPointSet([{x:54,y:65,count:5},{x:54,y:65,count:6} /*...*/]);

//也可以动态的添加点，heatmap可以动态更新
heatmap.addPoint([35,75]);

//动态添加数据集
heatmap.addPointSet([[43,645], [5436,1], [1,76], [6546,65] /*...*/]);
heatmap.addPointSet([{x:54,y:65,count:5},{x:54,y:65,count:6} /*...*/]);
``` 
