# Heatmap
һ������HTML5 canvas������ͼ���Ƶ�JavaScript�⡣
## ������ι�����
- ������������������������е������`count`
- ��ȡ`count`�����ֵ`max`
- ����`count/max`�����������ϻ��ƾ����alpha����
- ��ȡcanvas�ϵ�`imageData`����������ͼ�����ݣ�����������alphaͨ��ֵ��ɫ����ȡֵ���ٻ����ڸĵ���

## ���ʹ��
- �������������κ����
- ����`heatmap.js`��ҳ����
- ʹ��`new Heatmap(canvasElement, config)`��ʼ��һ��Heatmapʵ����`canvasElement`ΪHTML5 canvasԪ��
- ���������У�
    - **readius**����ѡ����Number�������ȵ�İ뾶
    - **opacity**����ѡ����Number��Heatmap��͸����
## ʹ��ʾ��

```javascript
var config = {
    readius:50,
    opacity:0.9 
};

//ʵ��������ͼ����
var heatmap =  new Heapmap(document.getElmentById("canvas"), config);

//��ʼ������̬���ã����ݼ�
heatmap.setPointSet([[43,645], [5436,1], [1,76], [6546,65] /*...*/]);
//or
heatmap.setPointSet([{x:54,y:65,count:5},{x:54,y:65,count:6} /*...*/]);

//Ҳ���Զ�̬����ӵ㣬heatmap���Զ�̬����
heatmap.addPoint([35,75]);

//��̬������ݼ�
heatmap.addPointSet([[43,645], [5436,1], [1,76], [6546,65] /*...*/]);
heatmap.addPointSet([{x:54,y:65,count:5},{x:54,y:65,count:6} /*...*/]);
``` 
