// 实现左右窗口拖拽显示

function dragControllerDiv() {

    // 左右窗口拖拽显示
    var resize = document.getElementsByClassName("resize");
    var left = document.getElementsByClassName("leftBox");
    var right = document.getElementsByClassName("rightBox");
    var box = document.getElementsByClassName("outside");

    var inputCard = document.getElementsByClassName("input-card");

    for (let i = 0; i < resize.length; i++) {

        // 鼠标按下事件
        resize[i].onmousedown = function (e) {
            //颜色改变提醒
            resize[i].style.background = "#818181";
            var startX = e.clientX;
            resize[i].left = resize[i].offsetLeft;

            // 鼠标拖动事件
            document.onmousemove = function (e) {
                var endX = e.clientX;
                var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度

                var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
                if (moveLen < 300) moveLen = 300; // 左边区域的最小宽度为300px
                if (moveLen > maxT - 300) moveLen = maxT - 300; //右边区域最小宽度为300px

                resize[i].style.left = moveLen; // 设置左侧区域的宽度
                // inputCard[i].style.left = moveLen;

                for (let j = 0; j < left.length; j++) {
                    left[j].style.width = moveLen + "px";
                    right[j].style.width = box[i].clientWidth - moveLen - 10 + "px";
                    inputCard[j].style.left = moveLen - 135 + "px";
                }
            };

            // 鼠标松开事件
            document.onmouseup = function (evt) {
                //颜色恢复
                resize[i].style.background = "#d6d6d6";
                document.onmousemove = null;
                document.onmouseup = null;
                resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            };
            resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
            return false;
        };
    }


    //=======================================================================


    var resize2 = document.getElementsByClassName("resize2");
    var top = document.getElementsByClassName("topBox");
    var bottom = document.getElementsByClassName("bottomBox");


    for (let i = 0; i < resize2.length; i++) {

        // 鼠标按下事件
        resize2[i].onmousedown = function (e) {
            //颜色改变提醒
            resize2[i].style.background = "#818181";
            var startY = e.clientY;
            console.log(startY)

            resize2[i].top = resize2[i].offsetTop;

            // 鼠标拖动事件
            document.onmousemove = function (e) {
                var endY = e.clientY;
                // console.log("endY - startY：", endY - startY);
                var moveLen = resize2[i].top + (endY - startY); // （endx-startx）=移动的距离。resize2[i].left+移动的距离=左边区域最后的宽度

                // console.log( "moveLen:", moveLen);

                // var maxT = box[i].clientHeight - resize2[i].offsetLeft; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
                // if (moveLen < 32) moveLen = 32; // 左边区域的最小宽度为32px
                // if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px



                resize2[i].style.top = moveLen; // 设置左侧区域的宽度

                for (let j = 0; j < top.length; j++) {
                    top[j].style.height = moveLen + "px";
                    bottom[j].style.height = box[i].clientHeight - moveLen - 20 + "px";
                    inputCard[j].style.top = moveLen - 110  + "px";
                }
            };

            // 鼠标松开事件
            document.onmouseup = function (evt) {
                //颜色恢复
                resize2[i].style.background = "#d6d6d6";
                document.onmousemove = null;
                document.onmouseup = null;
                resize2[i].releaseCapture && resize2[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            };


            resize2[i].setCapture && resize2[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
            return false;
        };
    }


}
