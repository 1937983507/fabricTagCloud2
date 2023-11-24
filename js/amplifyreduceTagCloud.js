
// 记录当前标签云的放缩尺度（0-6，初始为4，0为缩小到最小，6为放大到最大）
tagCloudScale = 4;
MaxtagCloudScale = 6;


// 放大标签云
function amplifyTagCloud() {
    // 若已经到了最大放缩尺度，则停止缩放
    if (tagCloudScale == MaxtagCloudScale) return;
    // 修正放缩比例
    tagCloudScale = tagCloudScale + 1;
    // 重绘标签云
    getNewTagCloud(tagCloudScale);
}

// 缩小标签云
function reduceTagCloud() {
    // 若到了最小的放缩尺度，则停止缩放
    if (tagCloudScale == 0) return;
    // 修正方放缩比例
    tagCloudScale = tagCloudScale - 1;
    // 重绘标签云
    getNewTagCloud(tagCloudScale);
}

// 绘制新的标签云
function getNewTagCloud(i) {
    // 放大缩小案件的颜色 
    var amplifyBtm = document.getElementById("amplifyBtm");
    var reduceBtm = document.getElementById("reduceBtm");
    if (tagCloudScale == 0) {
        reduceBtm.style.filter = "grayscale(100%)";
    }
    else if (tagCloudScale == MaxtagCloudScale) {
        amplifyBtm.style.filter = "grayscale(100%)";
    }
    else {
        amplifyBtm.style.filter = "grayscale(0%)";
        reduceBtm.style.filter = "grayscale(0%)";
    }


    // 清除图例事件
    const legendColor1 = document.getElementById("legendColor1");
    const legendColor2 = document.getElementById("legendColor2");
    const legendColor3 = document.getElementById("legendColor3");
    const legendColor4 = document.getElementById("legendColor4");
    const legendColor5 = document.getElementById("legendColor5");
    legendColor1.removeEventListener("mouseover", useHighlight1);
    legendColor2.removeEventListener("mouseover", useHighlight2);
    legendColor3.removeEventListener("mouseover", useHighlight3);
    legendColor4.removeEventListener("mouseover", useHighlight4);
    legendColor5.removeEventListener("mouseover", useHighlight5);
    legendColor1.removeEventListener("mouseout", clearHighlight);
    legendColor2.removeEventListener("mouseout", clearHighlight);
    legendColor3.removeEventListener("mouseout", clearHighlight);
    legendColor4.removeEventListener("mouseout", clearHighlight);
    legendColor5.removeEventListener("mouseout", clearHighlight);




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
        crossOrigin: 'anonymous'
    });
    // 中心不变
    canvas.setViewportTransform(vpt);

    // 获取POI数据
    nowJson = poisPyramid[i];
    // 绘制标签云
    getTagCloud(nowJson);

    // // 色带改变交互
    // changeColorInteractive();
    // // 字号下拉框初始化
    // initFontSelection();
    // // 字号字体改变交互
    // changeFontInteractive();

}



