var container = document.getElementById('main_site_browsers_chart'),
    data =  [
        {data:0.1461, label:"IE-6"},
        {data:0.0534, label:"IE-7"},
        {data:0.3644, label: "IE-8"},
        {data:0.1051, label: "IE-9"},
        {data:0.17, label: "Chrome"},
        {data:0.032, label: "Firefox"},
        {data:0.06, label: "Safari"},
        {data:0.069, label: "Others"}
    ],
    container1 = document.getElementById('tuangou_browsers_chart'),
    data1 =  [
        {data:0.1693, label:"IE-6"},
        {data:0.0605, label:"IE-7"},
        {data:0.4124, label: "IE-8"},
        {data:0.1046, label: "IE-9"},
        {data:0.145, label: "Chrome"},
        {data:0.02, label: "Firefox"},
        {data:0.035, label: "Safari"},
        {data:0.0532, label: "Others"}
    ];        
    showBrowsersPie(container, data);
    showBrowsersPie(container1, data1);


function showBrowsersPie(container, data){
    var options = {
        width: 960,
        height: 600,
        margin:0,
        pie:{
            radius:250,
            easing:"back-ease-out"
        },
        legend:{
            height: 250,
            itemType:"rect",
             position:["right","top"]
        }
    };
    container.innerHTML = "";
    new DPChart(container, data, options);
}