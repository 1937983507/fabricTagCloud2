// 目前使用的色带编号
nowColorScheme = 1

// 存储色带变量
colorScheme = [
    ["rgb(239, 243, 255)", "rgb(189, 215, 231)", "rgb(107, 174, 214)", "rgb(49, 130, 189)", "rgb(8, 81, 156)"],
    ["rgb(240, 249, 232)", "rgb(186, 228, 188)", "rgb(123, 204, 196)", "rgb(67, 162, 202)", "rgb(8, 104, 172)"],
    ["rgb(5, 113, 176)", "rgb(146, 197, 222)", "rgb(247, 247, 247)", "rgb(244, 165, 130)", "rgb(202, 0, 32)"],
    ["rgb(77, 119, 153)", "rgb(127, 164, 196)", "rgb(197, 200, 212)", "rgb(212, 142, 149)", "rgb(181, 81, 91)"],
    ["rgb(69, 150, 230)", "rgb(143, 176, 222)", "rgb(196, 188, 199)", "rgb(192, 101, 107)", "rgb(166, 0, 0)"],
    ["rgb(43, 131, 186)", "rgb(171, 221, 164)", "rgb(255, 255, 191)", "rgb(253, 174, 97)", "rgb(215, 25, 28)"],
    ["rgb(255, 238, 153)", "rgb(212, 217, 76)", "rgb(119, 180, 108)", "rgb(61, 135, 153)", "rgb(43, 87, 217)"],
    ["rgb(211, 147, 103)", "rgb(234, 178, 140)", "rgb(245, 235, 212)", "rgb(193, 209, 219)", "rgb(131, 155, 168)"],
    ["rgb(255, 241, 162)", "rgb(225, 214, 170)", "rgb(163, 163, 166)", "rgb(101, 116, 154)", "rgb(0, 68, 159)"],
    ["rgb(65, 224, 208)", "rgb(143, 207, 193)", "rgb(203, 163, 151)", "rgb(241, 94, 87)", "rgb(255, 0, 0)"],
];

// 色带窗口初始化
function initcolorScheme() {
    var allColorSchemeDiv = document.getElementById("colorSchemes").getElementsByTagName("div");
    var allColorSchemeDivLength = allColorSchemeDiv.length;

    for (var ii = 0; ii < allColorSchemeDivLength; ii++) {
        var colorSpans = allColorSchemeDiv[ii].getElementsByTagName("span");
        for (var i = 0; i < 5; i++) {
            colorSpans[i].style.backgroundColor = colorScheme[ii][i];
        }
    }

    var legendSpans = document.getElementById("legend").getElementsByTagName("span");
    for (var i = 0; i < 5; i++) {
        legendSpans[i].style.backgroundColor = colorScheme[nowColorScheme][i];
    }



}


// 色带改变交互
function changeColorInteractive() {

    var allColorSchemeDiv = document.getElementById("colorSchemes").getElementsByTagName("div");
    var allColorSchemeDivLength = allColorSchemeDiv.length;

    // 默认选中最后一个色带
    allColorSchemeDiv[nowColorScheme].style.border = "2px solid rgb(221,221,221)";

    // 批量添加鼠标事件监控
    // 选中第k个色带
    for (let k = 0; k < allColorSchemeDivLength; k++) {
        allColorSchemeDiv[k].addEventListener("mousedown", function (e) { changeColor(k); });
    }
}


// 选择第nowColor个色带
function changeColor(nowColor) {
    // 更新当前选取的色带
    nowColorScheme = nowColor;
    var allColorSchemeDiv = document.getElementById("colorSchemes").getElementsByTagName("div");
    var allColorSchemeDivLength = allColorSchemeDiv.length;
    // 在选中色带的外侧浮现边框，其他色带消除边框
    for (var ii = 0; ii < allColorSchemeDivLength; ii++) {
        if (ii == nowColor) {
            allColorSchemeDiv[ii].style.border = "2px solid rgb(221,221,221)";
        }
        else {
            allColorSchemeDiv[ii].style.border = "2px solid rgb(255,255,255)";
        }
    }

    // 更新影响金字塔里面的color数据
    var poisPyramidLen = poisPyramid.length;
    for (var i = 0; i < poisPyramidLen; i++) {
        var jsonLen = Object.keys(poisPyramid[i]).length;
        for (var j = 0; j < jsonLen; j++) {
            if(poisPyramid[i][j].colorlevel=="one"){
                poisPyramid[i][j].fontColor = colorScheme[nowColor][0];
            }
            else if(poisPyramid[i][j].colorlevel=="two"){
                poisPyramid[i][j].fontColor = colorScheme[nowColor][1];
            }
            else if(poisPyramid[i][j].colorlevel=="three"){
                poisPyramid[i][j].fontColor = colorScheme[nowColor][2];
            }
            else if(poisPyramid[i][j].colorlevel=="four"){
                poisPyramid[i][j].fontColor = colorScheme[nowColor][3];
            }
            else{
                poisPyramid[i][j].fontColor = colorScheme[nowColor][4];
            }
        }
    }


    // 改图例颜色
    document.getElementById("legendColor1").style.backgroundColor = colorScheme[nowColor][0];
    document.getElementById("legendColor2").style.backgroundColor = colorScheme[nowColor][1];
    document.getElementById("legendColor3").style.backgroundColor = colorScheme[nowColor][2];
    document.getElementById("legendColor4").style.backgroundColor = colorScheme[nowColor][3];
    document.getElementById("legendColor5").style.backgroundColor = colorScheme[nowColor][4];

    // 逐一改变标签的色带
    var nowJsonLength = Object.keys(nowJson).length;
    for (var i = 1; i < nowJsonLength + 1; i++) {
        if (nowJson[i - 1].colorlevel == "one") {
            // 改标签颜色
            canvas.item(i).set({ fill: colorScheme[nowColor][0] });
            nowJson[i - 1].fontColor = colorScheme[nowColor][0];
        }
        else if (nowJson[i - 1].colorlevel == "two") {
            canvas.item(i).set({ fill: colorScheme[nowColor][1] });
            nowJson[i - 1].fontColor = colorScheme[nowColor][1];
        }
        else if (nowJson[i - 1].colorlevel == "three") {
            canvas.item(i).set({ fill: colorScheme[nowColor][2] });
            nowJson[i - 1].fontColor = colorScheme[nowColor][2];
        }
        else if (nowJson[i - 1].colorlevel == "four") {
            canvas.item(i).set({ fill: colorScheme[nowColor][3] });
            nowJson[i - 1].fontColor = colorScheme[nowColor][3];
        }
        else {
            canvas.item(i).set({ fill: colorScheme[nowColor][4] });
            nowJson[i - 1].fontColor = colorScheme[nowColor][4];
        }
    }



    // 更新画布，重绘
    canvas.renderAll();
}
