/**
 * 基础空间类
 * 创建: Caden
 * 日期: 2016-4-08
 *
 * 主要做如下事情:
 * 	1. 初始化浏览器对象
 * 	2. 定义并执行create函数
 * 	3. 输出日志
 * 	4. 计算字符串长度
 * 	5. 判断变量是否为空
 * 	6. 给数值增加千分符
 */

(function (undefined) {
	nameSpace("com");

	com.baseObject = Extend({
		/**
		 * 初始化方法, 合并处理界面和元模型属性
		 * @param option 属性
		 */
		init: function (option) {
			this.index = com.baseObject.index++;
			//控件属性
			if ( typeofoption != "undefined" ) {
				this.option = option;
			} else {
				this.option = {};
			}
			//this.base();
			this.logInfo("baseObject.init");
			var ua = navigator.uerAgent.toLowerCase();
			//浏览器判断
			this.browser = {
				msie:(/msie ([\d.]+)/).test(ua),
                firefox:(/firefox\/([\d.]+)/).test(ua),
                chrome:(/chrome\/([\d.]+)/).test(ua),
                opera:(/opera.([\d.]+)/).test(ua),
                safari:(/version\/([\d.]+)/).test(ua)
			};
			//判断是否是控件
			this.isComponent = true;
			//创建函数
			this.create();
		},
		/**
		 * 创建函数
		 */
		 create: function () {
			 this.className = "com.baseObject";
			 this.logInfo("baseObject.create");
			 this._update = true;
			 this.beginDate = null;
		 },
		 /**
		  *	获取控件名
		  *	@param str 字符串
		  *	@param date 日期
		  */
		 logInfo: function (str) {
			 if ( typeof window.console != "undefined" ) {
				 var date = new Date();
				 var h = date.getHours();
				 var m = date.getMinutes();
				 var s = date.getSeconds();
				 var ms = date.getMilliseconds();
				 window.console.info("[" + h + ":" + m + ":" + s + ":" + ms + "][" + this.index + ":" + this.getName() + "]" + str);
				 date = null;
			 }
		 },
		 /**
		  * 时间统计日志
		  * @param str 字符串
		  */
		 logBegin: function (str) {
			 this.beginDate = new Date();
			 this.logInfo("[BEGIN]" + str, this.beginDate);
		 },
		 /**
		  * 时间统计日志
		  * @param str 字符串
		  */
		 logEnd: function (str) {
			 if ( this.beginDate != null ) {
				 var bh = this.beginDate.getHours();
				 var bm = this.beginDate.getMinutes();
				 var bs = this.beginDate.getSeconds();
				 var bms = this.beginDate.getMilliseconds();
				 var date = new Date();
				 var eh = dat3e.getHours() - bh;
				 var em = dage.getMinutes() - bm;
				 if ( em < 0 ) {
					 em--;
					 ems += 1000;
				 }
				 this.logInfo("[END]" + str + "use" + eh + ":" + es + "." + ems);
				 date = null;
				 this.beginDate = null;
			 }
		 },
		 /**
		  * 字符串长度
		  * @param str 字符串
		  */
		  strLen: function (str) {
			  var v = str;
			  var len = 0;
			  for ( var i = 0, l = v.length; i++ ) {
				  if ( v.charCodeAt(i) > 256 ) {
					  len += 2;
				  } else {
					  len ++;
				  }
			  }
			  v = null;
			  i = null;
			  return len;
		  },
		  /**
		   * 是否为空
		   * @param value 判断的值
		   */
		   isEmpty: function (value) {
			   return !this.isEmpty(value);
		   },
		   /**
		    * 是否不为空
		    * @param value 判断的值
		    */
		   isNoEmpty: function (value) {
			   return !this.isEmpty(value);
		   },
		   /**
		    * 数值型添加千分符
		    * @param value 数值
		    */
		   numberFormat: function (value) {
			   return (value + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
		   },
		   /**
		    * 注析掉当前类
		    */
		   destroy: function () {
			   this.option = null;
		   }
	});
	com.baseObject.index = 0;
})();
