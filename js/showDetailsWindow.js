// 详情页面交互


function detailsWindowInteractive() {
    // 详情窗口拖拽
    let detailsWindow = document.querySelector('#detailsWindow')
    let moveOk = false
    let x = 0,
        y = 0
    detailsWindow.onmousedown = function (e) {
        x = e.pageX - detailsWindow.offsetLeft
        y = e.pageY - detailsWindow.offsetTop
        moveOk = true
    }
    window.onmouseup = function () {
        moveOk = false
    }
    window.onblur = function () {
        moveOk = false
    }
    window.onmousemove = function (e) {
        e.preventDefault();
        if (moveOk) {

            let left = e.pageX - x
            let top = e.pageY - y

            if (left < 0) left = 0
            if (top < 0) top = 0
            let maxLeft = window.innerWidth - detailsWindow.offsetWidth
            let maxTop = window.innerHeight - detailsWindow.offsetHeight
            if (left > maxLeft) left = maxLeft
            if (top > maxTop) top = maxTop

            detailsWindow.style.left = left + "px"
            detailsWindow.style.top = top + 'px'
        }
    }

    // 关闭要素详情窗口
    let closeDetailsWindow = document.querySelector("#closeDetailsWindow");
    closeDetailsWindow.addEventListener("mousedown", function (e) {
        let detailsWindow = document.getElementById('detailsWindow');
        detailsWindow.style.display = "none";
        // 清除所有的的高亮(不知为何不起作用)
        var myJsonLen = Object.keys(myJson).length;
        for (var i = 1; i < myJsonLen; i++) {
            canvas.item(i).set({ strokeWidth: 0 });
        }
        canvas.renderAll();
    })
}