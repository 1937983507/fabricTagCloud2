// 获取本地IP地址
// 使用IP地址获得本机的经纬度
// 显示当前经纬度下的高德地图
// 添加POI点覆盖物
// 支持用户绘制圆形范围


// 获取本机的IP 
function getIP() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("get", "https://api.ipify.org?format=json", false);
    xmlhttp.send();
    var item = JSON.parse(xmlhttp.responseText);
    var ip = item.ip;
    console.log(ip);
    return ip;
}

// 获取本机的经纬度
// 调用高德Web API-IP定位，每日有5000配额
function getPos(ip) {
    // 构建url
    var url = "https://restapi.amap.com/v3/ip?key=a7a5be837d1645cd49c74a601187bc35&ip=" + ip;
    // 建立所需的对象
    var httpRequest = new XMLHttpRequest();
    // 打开连接  将请求参数写在url中 
    httpRequest.open('GET', url, true);
    // 发送请求  将请求参数写在URL中
    httpRequest.send();
    // 获取数据后的处理程序
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            // 获取到json字符串
            var ret = httpRequest.responseText;
            // 转为JSON对象
            var json = JSON.parse(ret);
            // console.log(json);
            if (json["status"] == 0) {
                console.log("请求失败");
                // 加载地图(北京的)
                initAMAP(mainLongitude, mainLatitude);
            }
            else {
                var rectangle = json["rectangle"];
                // console.log(rectangle);
                var pos_arr = rectangle.split(';');  // 得到两个坐标串
                // console.log(pos_arr);
                var x1 = Number(pos_arr[0].split(',')[0]);
                var y1 = Number(pos_arr[0].split(',')[1]);
                var x2 = Number(pos_arr[1].split(',')[0]);
                var y2 = Number(pos_arr[1].split(',')[1]);
                mainLongitude = (x1 + x2) / 2;
                mainLatitude = (y1 + y2) / 2;
                console.log(mainLongitude, mainLatitude);
                // 加载地图
                initAMAP(mainLongitude, mainLatitude);
                // return [longitude, latitude];          
            }
        }
    };
}

// 获取当前的经纬度（Google浏览器调用会存在问题）
function get_location() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // 显示地理信息（更新经纬度）
            mainLongitude = position.coords.longitude;
            mainLatitude = position.coords.latitude;
            console.log(mainLongitude, mainLatitude);
            // 调用显示地图
            initAMAP(mainLongitude, mainLatitude);
        }, function (err) {
            // 错误处理
            switch (err.code) {
                case 1:
                    console.log("位置服务被拒绝。");
                    initAMAP(mainLongitude, mainLatitude);
                    break;
                case 2:
                    console.log("暂时获取不到位置信息。");
                    initAMAP(mainLongitude, mainLatitude);
                    break;
                case 3:
                    console.log("获取信息超时。");
                    initAMAP(mainLongitude, ainLatitude);
                    break;
                default:
                    console.log("未知错误。");
                    initAMAP(mainLongitude, mainLatitude);
                    break;
            }
        }, {
            enableHighAccuracy: true,
            maximumAge: 100,
            accuracy: 100
        })
    } else {
        console.log("你的浏览器不支持使用HTML5来获取地理位置信息");
        initAMAP(mainLongitude, mainLatitude);
    }
}

// 加载高德地图（用户所在地理位置的高德地图）
function initAMAP() {
    //初始化地图对象，加载地图
    map = new AMap.Map("container", {
        // center: [120.585301, 31.301078],  //苏州
        // center: [114.057939,23.143527],  //深圳
        zoom: 7,
        viewMode: '3D',
    });


    // 搜索定位
    // 输入提示(每日100配额)
    var autoOptions = {
        input: "searchPosText"
    };
    AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
        var auto = new AMap.AutoComplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
            map: map
        });  //构造地点查询类
        auto.on("select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);  //关键字查询查询
        }
    });


    // 同时引入工具条插件，比例尺插件和鹰眼插件
    AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.HawkEye',
        'AMap.MapType',
        'AMap.Geolocation',
        'AMap.ControlBar',
    ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar({
            position: {
                top: '110px',
                left: '40px'
            }
        }));

        // 工具条方向盘
        map.addControl(new AMap.ControlBar({
            position: {
                top: '10px',
                left: '10px',
            }
        }))

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new AMap.Scale());

        // // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        // map.addControl(new AMap.HawkEye({ isOpen: true }));51

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        map.addControl(new AMap.MapType());

        // // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        // map.addControl(new AMap.Geolocation());
    });


    //创建右键菜单
    var contextMenu = new AMap.ContextMenu();
    //右键放大
    contextMenu.addItem("放大一级", function () {
        map.zoomIn();
    }, 0);
    //右键缩小
    contextMenu.addItem("缩小一级", function () {
        map.zoomOut();
    }, 1);
    //右键显示全国范围
    contextMenu.addItem("缩放至全国范围", function (e) {
        map.setZoomAndCenter(4, [108.946609, 34.262324]);
    }, 2);
    //地图绑定鼠标右击事件——弹出右键菜单
    map.on('rightclick', function (e) {
        contextMenu.open(map, e.lnglat);
        contextMenuPositon = e.lnglat;
    });


    // // 高德定位参数
    // var options = {
    //     'showButton': true,//是否显示定位按钮
    //     'buttonPosition': 'LB',//定位按钮的位置
    //     'timeout': 10000,  // 超过10秒后停止定位，默认：无穷大
    //     /* LT LB RT RB */
    //     'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
    //     'showMarker': true,//是否显示定位点
    //     'markerOptions': {//自定义定位点样式，同Marker的Options
    //         'offset': new AMap.Pixel(-18, -36),
    //         'content': '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
    //     },
    //     'showCircle': true,//是否显示定位精度圈
    //     'circleOptions': {//定位精度圈的样式
    //         'strokeColor': '#0093FF',
    //         'noSelect': true,
    //         'strokeOpacity': 0.5,
    //         'strokeWeight': 1,
    //         'fillColor': '#02B0FF',
    //         'fillOpacity': 0.25
    //     }
    // }
    // // 高德定位插件
    // AMap.plugin(["AMap.Geolocation"], function () {
    //     var geolocation = new AMap.Geolocation(options);
    //     map.addControl(geolocation);
    //     geolocation.getCurrentPosition(function (status, result) {
    //         if (status == 'complete') {
    //             onComplete(result)
    //         } else {
    //             onError(result)
    //         }
    //     });
    // });
    // //解析定位结果
    // function onComplete(data) {
    //     var str = [];
    //     str.push('定位结果：' + data.position);
    //     str.push('定位类别：' + data.location_type);
    //     if (data.accuracy) {
    //         str.push('精度：' + data.accuracy + ' 米');
    //     }//如为IP精确定位结果则没有精度信息
    //     str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    //     console.log("定位成功", str);
    // }
    // //解析定位错误信息
    // function onError(data) {
    //     console.log("定位失败", data.message);
    // }


    // // 获取地图中心
    // console.log(map.getCenter());

}


// 添加POI点覆盖物
function showPOI() {


    // 海量点对象的覆盖物
    var style = {
        url: 'https://webapi.amap.com/images/mass/mass0.png',
        anchor: new AMap.Pixel(3, 3),  //图标偏移量
        size: new AMap.Size(15, 15),
        zIndex: 1,
    }

    // 海量点对象
    var mass = new AMap.MassMarks(allPOI, {
        opacity: 0.8,  // 透明度，0表示完全透明
        zIndex: 111,   // 图层叠加的顺序值，0表示最底层
        cursor: 'pointer',  //鼠标悬停的样式
        // alwaysRender: false,  //是否实时重绘，超过10000建议false
        style: style
    });

    // 显示鼠标悬停位置处的点文本
    var marker = new AMap.Marker({ content: ' ', map: map });

    // 当鼠标悬停时
    mass.on('mouseover', function (e) {
        // 添加某一点标记
        marker.show();
        marker.setPosition(e.data.lnglat);
        marker.setLabel({ content: e.data.pname })
    });
    mass.on('mouseout', function (e) {
        // 隐藏某一点标记
        marker.hide();
    });

    // 设置显示MassMark的地图对象
    mass.setMap(map);

}



// 绘制圆形范围
function begin_circle() {

    // 禁用开始绘制按钮，防止出现两次绘制
    var beginButtom = document.getElementById('begin');
    beginButtom.disabled = true;
    beginButtom.style.color = "rgb(221,221,221)";
    beginButtom.style.borderColor = "rgb(221,221,221)";

    // 鼠标工具
    var mouseTool = new AMap.MouseTool(map);
    //监听draw事件可获取画好的覆盖物
    mouseTool.on('draw', function (e) {
        // 获取覆盖物对象
        var circle = e.obj;

        //关闭绘制，保留覆盖物
        mouseTool.close(false);

        // 启动编辑
        var circleEditor = new AMap.CircleEditor(map, circle);
        circleEditor.open();
        // console.log(circleEditor);
    })

    // 绘制圆形范围的样式
    mouseTool.circle({
        fillColor: '#00b0ff',
        strokeColor: '#80d8ff'
    });
}


// 清除圆形范围的绘制
function clear_circle() {
    var circle = map.getAllOverlays('circle')[0];
    map.remove(circle);

    var marker = map.getAllOverlays('marker')[0];
    map.remove(marker);

    console.log(map.getAllOverlays('marker'));

}


// 初始化参数
function initPara() {

    // 将绘制的区域范围
    minX = 999; minY = 999;
    maxX = -999; maxY = -999;

    // json格式的POI数据--
    myJson = [];

    tagCloudScale = 4;

}



// 单击完成绘制圆形范围
function finish_circle() {


    // 每一次完成绘制后，初始化参数
    initPara();

    // 清除canvas已绘制的元素
    canvas.clear();
    // 移除所有监听事件、清除所有元素
    canvas.dispose();
    // 初始化canvas
    canvas = new fabric.Canvas('myCanvas', {
        backgroundColor: 'rgb(0,0,0)',
        selectionColor: 'blue',
        selectionLineWidth: 2,
        // selection: false, // 禁用组选择
        crossOrigin: 'anonymous',
        fireRightClick: true, // 启用右键，button的数字为3
        stopContextMenu: true, // 禁止默认右键菜单
    });

    // 获取绘制的圆形覆盖物对象
    var overlaysList = map.getAllOverlays('circle');
    var circle = overlaysList[0];


    // 更新用户绘制的中心点及其半径 
    circleRadius = circle.getRadius();  // 半径
    circleX = circle.getCenter().lng;  // 经度
    circleY = circle.getCenter().lat;  // 纬度
    circleLocation = [circleX, circleY];

    // console.log(circleX,circleY,circleRadius);


    // 直接按照中心点与半径进行筛选
    getCirclePOIs(circleLocation, circleRadius);


    // 获取目前应绘制的POI数据
    nowJson = poisPyramid[4];
    // 开始生成标签云
    getTagCloud(nowJson);



}