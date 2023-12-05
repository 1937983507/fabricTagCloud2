// 单击添加排名与通行时间


function addRankTime() {


    // 单击添加排名
    const addRankBtm = document.getElementById('addRank');
    addRankBtm.addEventListener('change', addRankFunction);

    // 添加排名函数
    function addRankFunction() {
        // const isChecked = event.target.checked;
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
        // 中心不变
        canvas.setViewportTransform(vpt);

        // 获取POI数据
        nowJson = poisPyramid[tagCloudScale];
        // 绘制标签云
        getTagCloud(nowJson);
    }

    // 单击添加通行时间
    const addTimeBtm = document.getElementById('addTime');
    addTimeBtm.addEventListener('change', addTimeFunction);

    // 添加通行时间函数
    async function addTimeFunction() {
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
        // 中心不变
        canvas.setViewportTransform(vpt);

        // 获取POI数据
        nowJson = poisPyramid[tagCloudScale];


        // 若是选中添加通行时间，则计算各POI点与中心点的通行时间
        const addTimeBtm = document.getElementById('addTime');
        var isAddTime = addTimeBtm.checked;
        if (isAddTime) {
            // console.log(circleX, circleY);
            // 遍历获取通行时间
            var nowJsonLen = Object.keys(nowJson).length;
            for (var i = 0; i < nowJsonLen; i++) {
                // 根据起终点经纬度规划驾车导航路线
                // 高德驾车路径，获取通行时间
                const res = await getTime([circleX, circleY], nowJson[i]);
                var res_distance = res.routes[0].distance;  //距离单位：m
                var res_time = res.routes[0].time;  //时间单位：s
                nowJson[i].distance2 = res_distance / 1000;  //距离单位：km
                nowJson[i].time = Math.round(res_time / 60);  // 距离单位：min
            }
        }
        // 绘制标签云
        getTagCloud(nowJson);
    }


    // 输入中心经纬度与当前POI点，计算通行时间
    function getTime(lnglat, poi) {
        return new Promise((resolve, reject) => {
            // 高德驾车路径查询，一天只有5000配额
            driving.search(new AMap.LngLat(lnglat[0], lnglat[1]), new AMap.LngLat(poi.X_gcj02, poi.Y_gcj02), (status, result) => {
                // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                if (status === 'complete') {
                    resolve(result)
                } else {
                    console.log("error", result)
                }
            });
        });
    }



}