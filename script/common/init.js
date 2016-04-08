function scriptUtil () {
	//加载导入的js列表
	this.scriptList = {};
	//加载css列表
	this.cssList = {};
	//创建的控件类
	this.com = {};
}

scriptUtil.prototype = {
	/**
	 * 日志输出
	 * src: 字符串
	 */
	LogInfo: function (src) {
		if ( window.console.info ) {
			window.console.info(src);
		}
	},
	/**
	 * 是否加载判断
	 * src: 加载的文件名
	 */
	isImport: function (src) {
		return ( typeof this.scriptList[src] != "undefined" || typeof this.cssList[src] != "undefined" );
	},
	/**
	 * 文件类型
	 * src: 文件路径
	 */
	srcType: function (src) {
		var srcAry = src.split(".");
		if ( srcAry.length > 1 ) {
			return srcAry[srcAry.length - 1].toUpperCase();
		} else {
			return "";
		}
	},
	/**
	 * 获取根目录
	 */
	 getPath: function () {
		 //获取默认的init.js文件路径
		 var srcUrl = document.getElementsByTagName("script")[0].src;
		 var re = /[\/\\]+/g;

		 //判断是否是硬盘, 或服务器上的userList
		 if ( /([a-zA-Z]:)|([hH][tT][tT][pP]:\/\/)/.test(srcUrl) ) {
			 //获取html的url
			 var docUrl = document.URL;
			 //拆分成数组
			 var srcAry = srcUrl.split(re);
			 var docAry = docUrl.split(re);
			 var indexs = 0;
			 //循环找到第一个不相同的目录
			 for ( var i= 0, len = srcAry.length < docAry.length ? srcAry.length : docAry.length; i < len; i++ ) {
				 if ( srcAry[i] !== docAry[i] ) {
					 indexs = i;
					 break;
				 }
			 }

			 //test.html 目录回寻到根目录
			 var path = "";
			 for ( var i = indexs, len = docAry.length; i < len - 1; i++ ) {
				 path += "../";
			 }
			 for ( var i = indexs, len = srcAry.length; i < len - 1; i++ ) {
				 path += srcAry[i] + "/";
			 }
			 return path;
		 } else {
			 //如果是相对目录则直接使用
			 var srcAry = srcUrl.split(re);
			 var path = "";
			 for ( var i = 0, len = srcAry.length; i < len; i++ ) {
				 path += srcAry[i] + "/";
			 }
			 return path;
		 }
	 },
	 /**
	  * 加载文件,
	  * src: 加载的文件, 字符串或者数组
	  * callback: 回掉函数
	  * sPath: 指定路径, 默认为空
	  */
	 Import: function (src, callback, sPath) {
		 //路径
		 if ( typeof sPath === "undefined" ) sPath = "";
		 //转化成数组
		 var src = src || [];
		 if ( typeof src === "string" ) {
			 src = [src];
		 }
		 //获取head元素
		 var _doc = document.getElementsByTagName("head")[0];
		 var importObj = {};
		 if ( src.length > 0 ) {
			 var curSrc = sPath + src[0];
			 //删除数组内第一个文件名
			 src.splice(0, 1);
			 var srctype = this.srcType(curSrc);
			 if ( typeof this.scriptList[curSrc] === "undefined" && typeof this.cssList[curSrc] === "undefined" ) {

				 //如果没加载过
				 if ( srctype === "JS"  ) {
					 //加载js文件
					 importObj = document.createElement("script");
					 importObj.type = "text/javascript";
					 importObj.language = "javascript";
					 importObj.src = curSrc;
					 this.scriptList[curSrc] = 0;
				 } else if ( srctype === "CSS" ) {
					 //加载样式文件
					 importObj = document.createElement("link");
					 importObj.rel = "stylesheet";
					 importObj.type = "text/css";
					 importObj.href = curSrc;
					 this.cssList[curSrc] = 0;
				 }
				 //保存相关对象importObj中
				 importObj.csrc = curSrc;
				 importObj.csType = srctype;
				 importObj.self = this;
				 //加载成功事件
				 importObj.onload = importObj.onreadystatechange = function () {
					 var csrc = this.csrc;
					 if ( !this.readyState || this.readyState === "load" || this.readyState === "complete" ) {
						 var cst = this.csType;
						 var Self = this.self;
						 //打上加载的成功标志
						 if ( cst === "JS" ) {
							 Self.scriptList[csrc] = "scuess";
							 Self.LogInfo("import script " + csrc + " scuess.");
						 } else if ( "CSS" === cst ) {
							 Self.cssList[csrc] = "scuess";
							 Self.LogInfo("import css " + csrc + " scuess.");
						 }
						 this.onload = this.onreadystatechange = null;
						 //继续加载后续文件
						 if ( src.length > 0 ) {
							 Self.Import(src, callback, sPath);
						 } else if ( typeof callback === "function" ) {
							 callback(true);
						 }
						 this.self = null;
					 }
				 };

				 //导入错误事件
				 importObj.onerror = function () {
					 var Self = this.self;
					 var csrc = this.csrc;
					 var cst = this.cstype;
					 //打上加载标志
					 if ( cst === "JS" ) {
						 Self.scriptList[csrc] = "error";
						 Self.LogInfo("import script " + csrc + " scuess.");
					 } else if ( cst === "CSS" ) {
						 Self.cssList[csrc] = "error";
						 Self.LogInfo("import css " + csrc + " scuess.");
					 }
					 //清除加载失败的文件
					 _doc.removeChild(importObj);
					 this.onerror = null;
					 //继续加载后续文件
					 if ( src.length > 0 ) {
						 Self.Import(src, callback, sPath);
					 } else if(typeof callBack == "function") {
						 //回调
                        callBack(true);
					 }
					 this.self = null;
				 }
				 //添加加载文件到head中
                _doc.appendChild(importObj);
			 } else {
				 if(src.length > 0) {
	             	this.Import(src, callBack, sPath);
	             } else if(typeof callBack == "function") {
	            	callBack(true);
	             }
			 }
		 } else if ( typeof callBack == "function" ) {
			 callBack(true);
		 }
	 }

}

//win object
var thisWindow = new scriptUtil();

function startUp () {
	//获取相对路径
	var initsrc = thisWindow.getPath();
	//加载列表js文件
	thisWindow.Import(["staticScript.js"], function (state) {
		if ( state && typeof staticScript != "undefined" ) {
			var len = staticScript.length;
			//加载列表中的文件
			thisWindow.Import(staticScript, function (state) {
				//处理页面显示事件
				if ( typeof thisWindow.onShow === "function" ) {
					thisWindow.onShow();
				}
			}, initsrc);
		}
	}, initsrc);
}

//等待body加载后, 执行startUp
var sartHandel = setInterval(function () {
	if ( document.getElementsByTagName("body") != null ) {
		clearInterval(sartHandel);
		startUp();
	} else {
		thisWindow.LogInfo("waitting loading...");
	}
}, 20);
