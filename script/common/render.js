/**
 * ui控件渲染
 * dom: 占位符
 * callback: 回调函数
 */
function render (dom, callback) {
	if(typeof dom == "undefined") return;
    //读取传入的dom参数的所有子元素
    var len = dom.childNodes.length;
    for(var i = 0; i < len; i++) {
        //循环对各个dom子元素处理
        var curDom = dom.childNodes[i];
        //获取子元素的子元素数组
        var childDom = curDom.childNodes;
        //获取当前元素的id或name用于作控件的变量名，
        var comName = curDom.id || curDom.name;
        //如果重复就不渲染
        if(comName !== "" && typeof comName != "undefined" && comName != null) {
            if(typeof thisWindow.com[comName] === "undefined") {
                //读取元素的code属性
                var code = curDom.attributes.code;
                if(typeof code != "undefined") {
                    var code = code.nodeValue;
                    //把code属性转换成类对象
                    var comClass = eval(code);
                    if(typeof comClass != "undefined") {
                        //如果有对应的类对象，则再读取option属性
                        var option = curDom.attributes.option;
                        if(typeof option != "undefined") {
                            option = eval("(" + option.nodeValue + ")");
                        }
                        try {
                            //跟据code对应的ui控件对象，
                            var ui = new comClass(option, curDom, true);
                            //加入到com列表中，
                            thisWindow.com[curDom.id || curDom.name] = ui;
                            //返回当前容器，用于继续渲染子元素控件
                            curDom = ui.getRectDom();
                        } catch(e) {
                            //控件渲染错误时日志输出。
                            thisWindow.LogInfo("create class " + code
                            + " error:" + e.message);
                        }
                    } else {
                        //控件不存在时输出日志
                        thisWindow.LogInfo("class " + code + " can not found.");
                    }
                }
            } else {
                //如果id重复，提示，输出日志
                thisWindow.LogInfo(comName + " is exist");
            }
        }
        if(childDom.length > 0 && curDom != null && typeof curDom != "undefined") {
            //如果还有子元素，则继续渲染
            render(curDom);
        }
    }
    if(typeof callBack == "function") {
        callBack();
    }  
};

//第一次默认渲染body对象下的控件
render(document.body, function () {
	if ( typeof thisWindow.onAfterRender === "function" ) {
		//渲染后的事件
		thisWindow.onAfterRender();
	}
})
