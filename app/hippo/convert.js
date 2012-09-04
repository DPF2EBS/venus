window.__convertToBrowser = function (arr, name) {

    //arr 原始数据
    //name 'chrome...' browser
    //type 'domready' or 'onlaod'
    var data = {},
        data2  ={}
    var onload = {name:name, data:data},
        domready = {name:name,data:data2}
    arr.forEach(function (item) {
        var date = item[2].split(' ')[0]
        data[date]= (item[0] / 1000).toFixed(2)
        data2[date] = (item[1]/1000).toFixed(2)

    });

    return {
        onload: onload,
        domready:domready
    }
}

window.__convertToType = function (arr,noYear) {
    var
        onloadData = {},
        onload = {name:'onload', data:onloadData},
        domreadyData = {},
        domready = {name:'domready', data:domreadyData},
        result = [onload, domready]

    arr.forEach(function (item) {
        var date = item[2].split(' ')[0]
        if(noYear){
            date = date.split(/-|\//);
            date = date[1]+'-'+date[2];
        }
        onloadData[date] = (item[0] / 1000).toFixed(2);
        domreadyData[date] = (item[1] / 1000).toFixed(2);
    })
    return result


}