// 绘制标签云



// 获取将要绘制的区域范围
function getRegion(nowJson) {
    // 要绘制的文本总数
    var nowJsonLen = Object.keys(nowJson).length;
    var maxDis = 0;
    for (var i = 0; i < nowJsonLen; i++) {
        // 求绘制的范围
        var tempX = nowJson[i].X_gcj02;
        var tempY = nowJson[i].Y_gcj02;
        if (tempX < minX) minX = tempX;
        if (tempX > maxX) maxX = tempX;
        if (tempY < minY) minY = tempY;
        if (tempY > maxY) maxY = tempY;

        // 获取最远距离
        // if (maxDis < nowJson[i].distance) maxDis = nowJson[i].distance;
    }

    // var showmaxDis = document.getElementById("maxDis");
    // showmaxDis.innerHTML = Math.trunc(maxDis) + "m";
}

// 经纬度与屏幕坐标的转换
function Latlon2ScreenCoordinates(nowJson) {
    // 要绘制的文本总数
    var nowJsonLen = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLen; i++) {
        var X = nowJson[i].X_gcj02;
        var Y = nowJson[i].Y_gcj02;
        var tempX = (X - minX) / (maxX - minX) * canvas.width;
        var tempY = (1 - (Y - minY) / (maxY - minY)) * canvas.height;

        // 四周的点向内部偏移
        if (tempX > canvas.width - 10) tempX = tempX - 100;
        if (tempY < 10) tempY = tempY + 10;
        if (tempY > canvas.height - 10) tempY = tempY - 10;

        // 转成屏幕坐标进行存储
        nowJson[i].screenX = tempX;
        nowJson[i].screenY = tempY;
        // console.log(nowJson[i].pname, nowJson[i].X, nowJson[i].Y);
    }
}


// 绘制中心点 
function drawCenter() {
    // 获取中心点图像对象
    // fabric.Image.fromURL('../img/center2.png', function (oImg) {
    //     // 在添加到画布之前，缩小图像, 并使其翻转。
    //     oImg.scale(0.2).set({ "top": originY, "left": originX });
    //     canvas.add(oImg);
    // });

    // 初始化该标签
    var tempPOI = new fabric.Text("中心位置", {
        left: originX,
        top: originY,
        fill: 'rgb(255, 255, 255)',
        fontSize: 60,
        strokeWidth: 5,
        fontWeight: 1000,
        stroke: 'rgba(255,255,255,0.7)',
        fontFamily: 'Comic Sans',
        textAlign: 'center',
        selectable: false  // 不可选中，默认是可以选中的
    });
    canvas.add(tempPOI);


}



// 初次绘制文本
async function initDraw(nowJson) {
    console.time('计时器');
    // 要绘制的文本总数
    var nowJsonLen = Object.keys(nowJson).length;

    // 偏移策略
    var strategy = 3;
    // 1为原始方案，会造成标签的堆积对齐
    // 2为随机数偏移方案，在保证不增加额外时间的前提下，优化堆积对齐现象
    // 3是顺逆时针偏移15度方案，可解决堆积对齐现象，但是时间复杂度将会大幅增加
    if (nowJsonLen < 300) {
        strategy = 3;
    }
    else {
        strategy = 2;
    }


    // 是否加排名
    const addRankBtm = document.getElementById('addRank');
    var isAddRank = addRankBtm.checked;
    // 是否加通行时间
    const addTimeBtm = document.getElementById('addTime');
    var isAddTime = addTimeBtm.checked;


    // 逐一对每一文本进行判断
    for (var i = 0; i < nowJsonLen; i++) {

        // 要显示的标签名称
        var pName = nowJson[i].pname;
        if (isAddRank) {
            pName += nowJson[i].rankInCity;
        }
        if (isAddTime) {
            pName += ("|" + nowJson[i].time);
        }

        if (strategy == 1) {
            // 初始位置为圆形中心
            var newX = originX;
            var newY = originY;
            // 初始化该标签
            var tempPOI = new fabric.Text(pName, {
                left: newX,
                top: newY,
                fill: nowJson[i].fontColor,
                fontSize: nowJson[i].fontSize,
                fontFamily: nowJson[i].typeface,
                fontWeight: nowJson[i].fontWeight,
                textAlign: 'center',
                selectable: false  // 不可选中，默认是可以选中的
            });
            canvas.add(tempPOI);


            // 计算偏移量
            var xx = nowJson[i].screenX - originX;
            var yy = nowJson[i].screenY - originY;
            var xie = Math.sqrt(xx * xx + yy * yy);
            xx = 20 * xx / xie;
            yy = 20 * yy / xie;
            // var random1 = Math.random() * (1.3 - 0.7) + 0.7;
            // var random2 = Math.random() * (1.3 - 0.7) + 0.7;
            // // console.log(random1, random2);
            // xx = 20 * random1 * xx / xie;
            // yy = 20 * random2 * yy / xie;

            var k = 1;

            // 开始偏移(朝着单一方向)
            while (true) {
                // 默认不需要偏移
                var isShift = false;

                // 通过resJson遍历已经绘制的元素
                // var resLength = Object.keys(resJson).length;
                // for (var j = 0; j < resLength; j++) {
                //     // console.log(canvas.item(j));
                //     if (tempPOI.intersectsWithObject(canvas.item(j))) {
                //         // 有重叠，得继续偏移
                //         isShift = true;
                //         // 计算偏移后的坐标
                //         newX = newX + xx;
                //         newY = newY + yy;
                //         // 开始移动标签
                //         tempPOI.set({ left: newX, top: newY });
                //         tempPOI.setCoords();
                //         // 退出遍历resJson
                //         break;
                //     }
                // }

                // 通过 canvas.forEachObject 遍历画布上所有元素
                canvas.forEachObject(function (obj) {
                    // console.log(obj);
                    // 排除当前正在移动的元素
                    if (obj === tempPOI) return

                    // 检查对象是否与另一个对象相交
                    if (tempPOI.intersectsWithObject(obj)) {
                        // 有重叠，得继续偏移
                        isShift = true;
                        // 计算偏移后的坐标
                        newX = originX + xx * k;
                        newY = originY + yy * k;
                        k++;
                        // 开始移动标签
                        tempPOI.set({ left: newX, top: newY });
                        tempPOI.setCoords();
                    }
                })


                if (!isShift) {
                    // 不需要偏移了，退出while循环
                    nowJson[i].newX = newX;
                    nowJson[i].newY = newY;
                    break;
                }

            }
        }
        else if (strategy == 2) {
            // 初始位置为圆形中心
            var newX = originX;
            var newY = originY;
            // 初始化该标签
            var tempPOI = new fabric.Text(pName, {
                left: newX,
                top: newY,
                fill: nowJson[i].fontColor,
                fontSize: nowJson[i].fontSize,
                fontFamily: nowJson[i].typeface,
                fontWeight: nowJson[i].fontWeight,
                textAlign: 'center',
                selectable: false  // 不可选中，默认是可以选中的
            });
            canvas.add(tempPOI);


            // 计算偏移量
            var xx = nowJson[i].screenX - originX;
            var yy = nowJson[i].screenY - originY;
            var xie = Math.sqrt(xx * xx + yy * yy);
            // xx = 20 * xx / xie;
            // yy = 20 * yy / xie;
            var random1 = Math.random() * (1.3 - 0.7) + 0.7;
            var random2 = Math.random() * (1.3 - 0.7) + 0.7;
            // console.log(random1, random2);
            xx = 20 * random1 * xx / xie;
            yy = 20 * random2 * yy / xie;

            var k = 1;

            // 开始偏移(朝着单一方向)
            while (true) {
                // 默认不需要偏移
                var isShift = false;

                // 通过resJson遍历已经绘制的元素
                // var resLength = Object.keys(resJson).length;
                // for (var j = 0; j < resLength; j++) {
                //     // console.log(canvas.item(j));
                //     if (tempPOI.intersectsWithObject(canvas.item(j))) {
                //         // 有重叠，得继续偏移
                //         isShift = true;
                //         // 计算偏移后的坐标
                //         newX = newX + xx;
                //         newY = newY + yy;
                //         // 开始移动标签
                //         tempPOI.set({ left: newX, top: newY });
                //         tempPOI.setCoords();
                //         // 退出遍历resJson
                //         break;
                //     }
                // }

                // 通过 canvas.forEachObject 遍历画布上所有元素
                canvas.forEachObject(function (obj) {
                    // console.log(obj);
                    // 排除当前正在移动的元素
                    if (obj === tempPOI) return

                    // 检查对象是否与另一个对象相交
                    if (tempPOI.intersectsWithObject(obj)) {
                        // 有重叠，得继续偏移
                        isShift = true;
                        // 计算偏移后的坐标
                        newX = originX + xx * k;
                        newY = originY + yy * k;
                        k++;
                        // 开始移动标签
                        tempPOI.set({ left: newX, top: newY });
                        tempPOI.setCoords();
                    }
                })


                if (!isShift) {
                    // 不需要偏移了，退出while循环
                    nowJson[i].newX = newX;
                    nowJson[i].newY = newY;
                    break;
                }

            }
        }
        else if (strategy == 3) {
            // [x,y]围绕中心点[cx,cy]旋转angle度。
            function rotate(cx, cy, x, y, angle) {
                var radians = (Math.PI / 180) * angle;
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
                var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
                return [nx, ny];
            }
            nowJson[i].screenLocations = [];
            nowJson[i].newScreenLocations = [];
            // nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, -15));
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, -10));
            // nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, -5));
            nowJson[i].screenLocations.push([nowJson[i].screenX, nowJson[i].screenY]);
            // nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, 5));
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, 10));
            // nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, 15));
            // console.log(nowJson[i].screenLocations);

            var maybeScreenLos = nowJson[i].screenLocations.length;

            // 第i个标签的第j个方向
            for (var j = 0; j < maybeScreenLos; j++) {

                // 初始位置为圆形中心
                var newX = originX;
                var newY = originY;
                // 初始化该标签
                var tempPOI = new fabric.Text(pName, {
                    left: newX,
                    top: newY,
                    fill: nowJson[i].fontColor,
                    fontSize: nowJson[i].fontSize,
                    fontFamily: nowJson[i].typeface,
                    fontWeight: nowJson[i].fontWeight,
                    textAlign: 'center',
                    selectable: false  // 不可选中，默认是可以选中的
                });
                canvas.add(tempPOI);


                // 计算偏移量
                var offsetXX = nowJson[i].screenLocations[j][0] - originX;
                var offsetYY = nowJson[i].screenLocations[j][1] - originY;

                var xie = Math.sqrt(offsetXX * offsetXX + offsetYY * offsetYY);
                var xx = offsetXX / xie * 20;
                var yy = offsetYY / xie * 20;


                // 开始偏移(朝着单一方向)
                while (true) {
                    // 默认不需要偏移
                    var isShift = false;

                    // 通过resJson遍历已经绘制的元素
                    // var resLength = Object.keys(resJson).length;
                    // for (var j = 0; j < resLength; j++) {
                    //     // console.log(canvas.item(j));
                    //     if (tempPOI.intersectsWithObject(canvas.item(j))) {
                    //         // 有重叠，得继续偏移
                    //         isShift = true;
                    //         // 计算偏移后的坐标
                    //         newX = newX + xx;
                    //         newY = newY + yy;
                    //         // 开始移动标签
                    //         tempPOI.set({ left: newX, top: newY });
                    //         tempPOI.setCoords();
                    //         // 退出遍历resJson
                    //         break;
                    //     }
                    // }

                    // 通过 canvas.forEachObject 遍历画布上所有元素
                    canvas.forEachObject(function (obj) {
                        // console.log(obj);
                        // 排除当前正在移动的元素
                        if (obj === tempPOI) return

                        // 检查对象是否与另一个对象相交
                        if (tempPOI.intersectsWithObject(obj)) {
                            // 有重叠，得继续偏移
                            isShift = true;
                            // 计算偏移后的坐标
                            newX = newX + xx;
                            newY = newY + yy;
                            // 开始移动标签
                            tempPOI.set({ left: newX, top: newY });
                            tempPOI.setCoords();
                        }
                    })


                    if (!isShift) {
                        // 不需要偏移了，退出while循环
                        nowJson[i].newScreenLocations[j] = [newX, newY];
                        canvas.remove(tempPOI);
                        break;
                    }
                }
            }

            // 寻找最近的摆放位置
            var theMinDistance = 99999999999;
            var theNewLocation = [];
            for (var j = 0; j < maybeScreenLos; j++) {
                var newXY = nowJson[i].newScreenLocations[j];
                var tempDis = (newXY[0] - originX) * (newXY[0] - originX) + (newXY[1] - originY) * (newXY[1] - originY);
                if (tempDis < theMinDistance) {
                    // 更新最近距离
                    theMinDistance = tempDis;
                    theNewLocation[0] = newXY[0];
                    theNewLocation[1] = newXY[1];
                }
            }

            // 正式绘制
            var tempPOI = new fabric.Text(pName, {
                left: theNewLocation[0],
                top: theNewLocation[1],
                fill: nowJson[i].fontColor,
                fontSize: nowJson[i].fontSize,
                fontFamily: nowJson[i].typeface,
                fontWeight: nowJson[i].fontWeight,
                textAlign: 'center',
                selectable: false  // 不可选中，默认是可以选中的
            });
            canvas.add(tempPOI);
        }

    }

    // // 更新影像金字塔数据，在下次绘制便不需要再进行数据偏移
    // poisPyramid[tagCloudScale] = nowJson;

    // 显示当前的POI数量
    var showPOINum = document.getElementById("showPOINum");
    showPOINum.innerHTML = "当前展示的景点数量：" + Object.keys(nowJson).length;

    console.timeEnd('计时器');

}




// 鼠标交互事件
function mouseInteractive(nowJson) {
    // 可以实现鼠标滚轮缩放 最小为原来的百分之一，最大为原来的20倍
    canvas.on('mouse:wheel', function (opt) {
        // console.log(this)
        const delta = opt.e.deltaY // 滚轮，向上滚一下是 -100，向下滚一下是 100
        zoom = canvas.getZoom() // 获取画布当前缩放值
        zoom *= 0.999 ** delta
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01

        // 以左上角为原点
        // this.canvas.setZoom(zoom)

        // 以鼠标所在位置为原点缩放
        canvas.zoomToPoint(
            { // 关键点
                x: opt.e.offsetX,
                y: opt.e.offsetY
            },
            zoom
        )

        // 记录当前的缩放与偏移
        vpt = this.viewportTransform;
        // console.log(vpt);


        opt.e.preventDefault()
        opt.e.stopPropagation()
    })

    // // 鼠标按下事件
    // canvas.on('mouse:down', function (e) {
    //     this.panning = true
    //     canvas.selection = false
    // })
    // // 鼠标抬起事件
    // canvas.on('mouse:up', function (e) {
    //     this.panning = false
    //     canvas.selection = true
    // })
    // // 移动画布事件
    // canvas.on('mouse:move', function (e) {
    //     if (this.panning && e && e.e) {
    //         var delta = new fabric.Point(e.e.movementX, e.e.movementY)
    //         canvas.relativePan(delta)
    //     }
    // })

    // 按下鼠标事件
    canvas.on('mouse:down', function (opt) {
        // console.log("down");
        var evt = opt.e;
        this.isDragging = true
        // 一直在变的坐标
        this.lastPosX = evt.clientX
        this.lastPosY = evt.clientY
        // 初始坐标
        this.preX = evt.clientX
        this.preY = evt.clientY
    })

    // 移动鼠标事件
    canvas.on('mouse:move', function (opt) {
        if (this.isDragging) {
            var e = opt.e;
            vpt = this.viewportTransform;
            vpt[4] += e.clientX - this.lastPosX
            vpt[5] += e.clientY - this.lastPosY
            this.requestRenderAll()
            this.lastPosX = e.clientX
            this.lastPosY = e.clientY

        }
    })

    // 松开鼠标事件
    canvas.on('mouse:up', function (opt) {
        // console.log("up");
        // 移动
        // console.log(vpt);
        this.setViewportTransform(vpt);
        // this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
    })



    // 鼠标单击事件，显示某类要素的详细信息+高亮此要素
    canvas.on('mouse:down', function (options) {
        // 如果单击的是对象
        if (options.target) {
            // console.log(options.target);
            if (options.target.text == "中心位置") {
                // 清除除中心位置外所有的的高亮
                var nowJsonLen = Object.keys(nowJson).length;
                for (var i = 1; i < nowJsonLen + 1; i++) {
                    canvas.item(i).set({ strokeWidth: 0 });
                }
                canvas.renderAll();
                return;
            }

            // console.log('an object was clicked! ', options.target);
            // 获取单击要素的ID
            var currindex = canvas.getObjects().indexOf(options.target) - 1;

            // 先清除所有的高亮
            var nowJsonLen = Object.keys(nowJson).length;
            for (var i = 1; i < nowJsonLen; i++) {
                canvas.item(i).set({ strokeWidth: 0 });
            }
            // 高亮此要素
            canvas.item(currindex + 1).set({ strokeWidth: 4, stroke: 'rgba(255,255,255,0.5)' })

            // 显示要素详情窗口
            let detailsWindow = document.getElementById('detailsWindow');
            detailsWindow.style.display = "block";

            // console.log(nowJson);



            var pid = currindex;
            var pname = nowJson[currindex].pname;
            var X = nowJson[currindex].X_wgs84;
            var Y = nowJson[currindex].Y_wgs84;
            var distance = nowJson[currindex].distance;
            var rankInChina = nowJson[currindex].rankInChina;
            var rankInCity = nowJson[currindex].rankInCity;

            var str = "地点名：" + pname + "\n经度：" + X + "\n纬度：" + Y + "\n与中心点距离：" + Math.trunc(distance) + "米\n在当前城市排名：" + rankInCity;

            let detailsInformation = document.getElementById('detailsInformation');
            detailsInformation.innerText = str;

        }
        // 如果单击的是背景
        else {
            // 清除所有的的高亮
            var nowJsonLen = Object.keys(nowJson).length;
            for (var i = 1; i < nowJsonLen + 1; i++) {
                canvas.item(i).set({ strokeWidth: 0 });
            }
            canvas.renderAll();
        }
    });





    // 获取标签对象
    const legendColor1 = document.getElementById("legendColor1");
    const legendColor2 = document.getElementById("legendColor2");
    const legendColor3 = document.getElementById("legendColor3");
    const legendColor4 = document.getElementById("legendColor4");
    const legendColor5 = document.getElementById("legendColor5");

    // 鼠标悬浮到对应的图例上，对应颜色的标签高亮显示
    legendColor1.addEventListener("mouseover", useHighlight1);
    legendColor2.addEventListener("mouseover", useHighlight2);
    legendColor3.addEventListener("mouseover", useHighlight3);
    legendColor4.addEventListener("mouseover", useHighlight4);
    legendColor5.addEventListener("mouseover", useHighlight5);

    // 鼠标移开图例，所有标签停止高亮显示
    legendColor1.addEventListener("mouseout", clearHighlight);
    legendColor2.addEventListener("mouseout", clearHighlight);
    legendColor3.addEventListener("mouseout", clearHighlight);
    legendColor4.addEventListener("mouseout", clearHighlight);
    legendColor5.addEventListener("mouseout", clearHighlight);



}


// 使用高亮显示
function useHighlight1() {
    var nowJsonLen = Object.keys(nowJson).length;
    var currColor = document.getElementById("legendColor1").style.backgroundColor;
    for (var i = 1; i < nowJsonLen + 1; i++) {
        if (currColor == nowJson[i - 1].fontColor) {
            canvas.item(i).set({ strokeWidth: nowJson[i - 1].fontSize / 12, stroke: 'rgba(255,255,255,0.8)' });
        }
        else {
            canvas.item(i).set({ strokeWidth: 0 });
        }
    }
    // 更新画布，重绘
    canvas.renderAll();
}
function useHighlight2() {
    var nowJsonLen = Object.keys(nowJson).length;
    var currColor = document.getElementById("legendColor2").style.backgroundColor;
    for (var i = 1; i < nowJsonLen + 1; i++) {
        if (currColor == nowJson[i - 1].fontColor) {
            canvas.item(i).set({ strokeWidth: nowJson[i - 1].fontSize / 12, stroke: 'rgba(255,255,255,0.8)' });
        }
        else {
            canvas.item(i).set({ strokeWidth: 0 });
        }
    }
    // 更新画布，重绘
    canvas.renderAll();
}
function useHighlight3() {
    var nowJsonLen = Object.keys(nowJson).length;
    var currColor = document.getElementById("legendColor3").style.backgroundColor;
    for (var i = 1; i < nowJsonLen + 1; i++) {
        if (currColor == nowJson[i - 1].fontColor) {
            canvas.item(i).set({ strokeWidth: nowJson[i - 1].fontSize / 12, stroke: 'rgba(255,255,255,0.8)' });
        }
        else {
            canvas.item(i).set({ strokeWidth: 0 });
        }
    }
    // 更新画布，重绘
    canvas.renderAll();
}
function useHighlight4() {
    var nowJsonLen = Object.keys(nowJson).length;
    var currColor = document.getElementById("legendColor4").style.backgroundColor;
    for (var i = 1; i < nowJsonLen + 1; i++) {
        if (currColor == nowJson[i - 1].fontColor) {
            canvas.item(i).set({ strokeWidth: nowJson[i - 1].fontSize / 12, stroke: 'rgba(255,255,255,0.8)' });
        }
        else {
            canvas.item(i).set({ strokeWidth: 0 });
        }
    }
    // 更新画布，重绘
    canvas.renderAll();
}
function useHighlight5() {
    var nowJsonLen = Object.keys(nowJson).length;
    var currColor = document.getElementById("legendColor5").style.backgroundColor;
    for (var i = 1; i < nowJsonLen + 1; i++) {
        if (currColor == nowJson[i - 1].fontColor) {
            canvas.item(i).set({ strokeWidth: nowJson[i - 1].fontSize / 12, stroke: 'rgba(255,255,255,0.8)' });
        }
        else {
            canvas.item(i).set({ strokeWidth: 0 });
        }
    }
    // 更新画布，重绘
    canvas.renderAll();
}
// 所有标签都停止高亮
function clearHighlight() {
    var nowJsonLen = Object.keys(nowJson).length;
    for (var i = 1; i < nowJsonLen + 1; i++) {
        canvas.item(i).set({ strokeWidth: 0 });
    }
    // 更新画布，重绘
    canvas.renderAll();
}



// 生成标签云
function getTagCloud(nowJson) {

    // 已经绘制的文本
    // resJson = [];

    // // 获取将要绘制的区域范围
    // getRegion(nowJson);
    // // 经纬度与屏幕坐标的转换
    // Latlon2ScreenCoordinates(nowJson);
    // 绘制中心点 
    drawCenter();
    // 初次绘制文本
    initDraw(nowJson);
    // 鼠标交互事件
    mouseInteractive(nowJson);

    // 记录当前的缩放与比例
    canvas.setViewportTransform(vpt);


    // 计算最远距离
    var maxDis = 0;
    var nowJsonLen = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLen; i++) {
        // 获取最远距离
        if (maxDis < nowJson[i].distance) maxDis = nowJson[i].distance;
    }
    var showmaxDis = document.getElementById("maxDis");
    showmaxDis.innerHTML = (maxDis / 1000).toFixed(2) + "km";






    // // 按排名升序排列
    // function up(a, b) {
    //     return a.rankInChina - b.rankInChina
    // }
    // // sort 会直接对原数据排序
    // myJson.sort(up);


    // // 默认展示7条
    // var showNum = 7;
    // var myJsonLen = Object.keys(myJson).length;
    // if (myJsonLen < 10) {
    //     // 若不足10条，则展示全部的数据
    //     showNum = myJsonLen;
    // }

    // for (var i = 0; i < showNum; i++) {
    //     var pname = myJson[i].pname;
    //     var X = myJson[i].X_wgs84;
    //     var Y = myJson[i].Y_wgs84;
    //     var distance = myJson[i].distance;
    //     var rankInChina = myJson[i].rankInChina;
    //     var rankInCity = myJson[i].rankInCity;

    //     addLi(pname, Math.trunc(distance), rankInCity);
    // }

    // // addLi("kzl", "123", "kkkkkkk");
    // // addLi("kzl", "123", "kkkkkkk");

    // function addLi(tempName, tempDis, tempRank) {
    //     var templi = document.createElement("li");
    //     templi.setAttribute("class", "newLi");
    //     addSpan(templi, "地点名：" + tempName);
    //     addSpan(templi, "与中心点距离：" + tempDis + "米");
    //     addSpan(templi, "在当前城市排名：" + tempRank);
    //     document.getElementById("sortDetailWindow").appendChild(templi);
    // }
    // //为姓名或邮箱等添加span标签，好设置样式
    // function addSpan(li, text) {
    //     var tempdiv = document.createElement("div");
    //     tempdiv.innerHTML = text;
    //     li.appendChild(tempdiv);
    // }



}


