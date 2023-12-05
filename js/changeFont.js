// 改变字体事件

// 全局变量，设置字号、字重、字体
g_oneFontSize = 45;
g_twoFontSize = 35;
g_threeFontSize = 25;
g_fourFontSize = 15;
g_fiveFontSize = 7;

g_fontWeight = 700;

g_typeface = "微软雅黑";


// 初始化下拉框
function initFontSelection() {

    // 字体大小
    var selectElement = document.getElementById("oneFontSize");
    for (var i = 59; i >= 2; i -= 2) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }
    // selectElement.selectedIndex = 1;
    selectElement.value = g_oneFontSize;


    var selectElement = document.getElementById("twoFontSize");
    for (var i = 59; i >= 2; i -= 2) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }
    // selectElement.selectedIndex = 6;
    selectElement.value = g_twoFontSize;

    var selectElement = document.getElementById("threeFontSize");
    for (var i = 59; i >= 2; i -= 2) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }
    // selectElement.selectedIndex = 11;
    selectElement.value = g_threeFontSize;

    var selectElement = document.getElementById("fourFontSize");
    for (var i = 59; i >= 2; i -= 2) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }
    // selectElement.selectedIndex = 16;
    selectElement.value = g_fourFontSize;

    var selectElement = document.getElementById("fiveFontSize");
    for (var i = 59; i >= 2; i -= 2) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }
    // selectElement.selectedIndex = 20;
    selectElement.value = g_fiveFontSize;

    //============================================================================

    // 字重
    var selectElement = document.getElementById("fontWeight");
    for (var i = 1000; i >= 100; i -= 100) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }
    // selectElement.selectedIndex = 6;
    selectElement.value = g_fontWeight;

    //============================================================================

    // 字体
    var selectElement = document.getElementById("typeface");
    selectElement.value = g_typeface;



    //============================================================================

    // 右键菜单栏的字重
    var selectElement = document.getElementById("afontWeight");
    for (var i = 1000; i >= 100; i -= 100) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }

}

// 字体改变交互
function changeFontInteractive() {
    // 触发改变字号事件
    document.getElementById("oneFontSize").addEventListener("change", changeFontSize);
    document.getElementById("twoFontSize").addEventListener("change", changeFontSize);
    document.getElementById("threeFontSize").addEventListener("change", changeFontSize);
    document.getElementById("fourFontSize").addEventListener("change", changeFontSize);
    document.getElementById("fiveFontSize").addEventListener("change", changeFontSize);


    // 触发改变字体事件
    document.getElementById("typeface").addEventListener("change", changetypeface);

    // 触发改变字重事件
    document.getElementById("fontWeight").addEventListener("change", changeFontWeight);

    // 触发改变字体事件
    document.getElementById("atypeface").addEventListener("change", changeAtypeface);

    // 触发改变字重事件
    document.getElementById("afontWeight").addEventListener("change", changeAFontWeight);


}

// 改变字号事件
function changeFontSize() {
    var oneFontSize = document.getElementById("oneFontSize").value;
    var twoFontSize = document.getElementById("twoFontSize").value;
    var threeFontSize = document.getElementById("threeFontSize").value;
    var fourFontSize = document.getElementById("fourFontSize").value;
    var fiveFontSize = document.getElementById("fiveFontSize").value;
    // console.log(oneFontSize, twoFontSize, threeFontSize, fourFontSize, fiveFontSize);

    // 更新全局变量
    g_oneFontSize = oneFontSize;
    g_twoFontSize = twoFontSize;
    g_threeFontSize = threeFontSize;
    g_fourFontSize = fourFontSize;
    g_fiveFontSize = fiveFontSize;

    // 更新字号大小
    var nowJsonLength = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLength; i++) {
        if (nowJson[i].sizelevel == "one") {
            nowJson[i].fontSize = oneFontSize;
        }
        else if (nowJson[i].sizelevel == "two") {
            nowJson[i].fontSize = twoFontSize;
        }
        else if (nowJson[i].sizelevel == "three") {
            nowJson[i].fontSize = threeFontSize;
        }
        else if (nowJson[i].sizelevel == "four") {
            nowJson[i].fontSize = fourFontSize;
        }
        else {
            nowJson[i].fontSize = fiveFontSize;
        }
    }

    // 更新影响金字塔里面的fontSize数据
    var poisPyramidLen = poisPyramid.length;
    for (var i = 0; i < poisPyramidLen; i++) {
        var jsonLen = Object.keys(poisPyramid[i]).length;
        for (var j = 0; j < jsonLen; j++) {
            if (poisPyramid[i][j].sizelevel == "one") {
                poisPyramid[i][j].fontSize = oneFontSize;
            }
            else if (poisPyramid[i][j].sizelevel == "two") {
                poisPyramid[i][j].fontSize = twoFontSize;
            }
            else if (poisPyramid[i][j].sizelevel == "three") {
                poisPyramid[i][j].fontSize = threeFontSize;
            }
            else if (poisPyramid[i][j].sizelevel == "four") {
                poisPyramid[i][j].fontSize = fourFontSize;
            }
            else {
                poisPyramid[i][j].fontSize = fiveFontSize;
            }
        }
    }



    // console.log(nowJson);
    // 清除canvas已绘制的元素
    canvas.clear();
    // 重新设置其背景
    canvas.setBackgroundColor('rgb(0,0,0)');
    // 开始生成标签云
    // 绘制中心点 
    drawCenter();
    // 绘制文本
    initDraw(nowJson);

    // 使用当前选中的色带
    changeColor(nowColorScheme);

}

// 改变字体事件
function changetypeface() {
    var typeface = document.getElementById("typeface").value;
    // console.log(typeface);

    // 更新全局变量
    g_typeface = typeface

    // 更新字体
    var nowJsonLength = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLength; i++) {
        nowJson[i].typeface = typeface;
        canvas.item(i + 1).set({ fontFamily: typeface });
    }

    // 更新影像金字塔里面的typeface数据
    var poisPyramidLen = poisPyramid.length;
    for (var i = 0; i < poisPyramidLen; i++) {
        var jsonLen = Object.keys(poisPyramid[i]).length;
        for (var j = 0; j < jsonLen; j++) {
            poisPyramid[i][j].typeface = typeface;
        }
    }

    // // console.log(nowJson);
    // // 清除canvas已绘制的元素
    // canvas.clear();
    // // 重新设置其背景
    // canvas.setBackgroundColor('rgb(0,0,0)');
    // // 开始生成标签云
    // // 绘制中心点 
    // drawCenter();
    // // 初次绘制文本
    // initDraw(nowJson);

    // 使用当前选中的色带
    changeColor(nowColorScheme);
    canvas.renderAll();
}

// 改变字重事件
function changeFontWeight() {
    var theFontWeight = document.getElementById("fontWeight").value;
    // console.log(typeface);

    // 更新字重
    g_fontWeight = theFontWeight;

    // 更新字体
    var nowJsonLength = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLength; i++) {
        nowJson[i].fontWeight = theFontWeight;
        canvas.item(i + 1).set({ fontWeight: theFontWeight });
    }


    // 更新影像金字塔里面的fontWeight数据
    var poisPyramidLen = poisPyramid.length;
    for (var i = 0; i < poisPyramidLen; i++) {
        var jsonLen = Object.keys(poisPyramid[i]).length;
        for (var j = 0; j < jsonLen; j++) {
            poisPyramid[i][j].fontWeight = theFontWeight;
        }
    }

    // // 清除canvas已绘制的元素
    // canvas.clear();
    // // 重新设置其背景
    // canvas.setBackgroundColor('rgb(0,0,0)');
    // // 开始生成标签云
    // // 绘制中心点 
    // drawCenter();
    // // 初次绘制文本
    // initDraw(nowJson);

    // 使用当前选中的色带
    changeColor(nowColorScheme);
    canvas.renderAll();
}


// 改变单个字体
function changeAtypeface(){
    var typeface = document.getElementById("atypeface").value;
    activeEl.set({ fontFamily: typeface });
    canvas.renderAll();

    // 隐藏菜单
    menu = document.getElementById("right_menu");
    menu.style = "visibility: hidden;left: 0;top: 0;z-index: -100;";
}

// 改变单个字重
function changeAFontWeight(){
    var theFontWeight = document.getElementById("afontWeight").value;
    activeEl.set({ fontWeight: theFontWeight });
    canvas.renderAll();

    // 隐藏菜单
    menu = document.getElementById("right_menu");
    menu.style = "visibility: hidden;left: 0;top: 0;z-index: -100;";
}