/**
 * 可见窗口基类.
 * 创建: QZZ
 * 日期: 2014-04-06
 */
(function(undefined) {
	nameSpace("com.ui");

	com.ui.window = Extend(com.baseObject, {
            /**
		 * 初始化函数.
		 * @param option 属性
		 * @param control DOM元素
		 * @param isDom 是否dom元素, 如果是在html页面上布局，
		 *                            则option已自动解析，
		 */
	    init:function(option, control, isDom) {
		    this.base(option);
		    if(typeof control != "undefined") {
			    //获取dom元素
		    	this.thisWindow = control;
		    	if(!isDom) {
				    //读取属性
		    		var op = control.attributes.option;
					if(typeof op != "undefined") {
						op = eval("(" + op.nodeValue + ")");
					}
					if(typeof op != "undefined") {
						for(var key in op) {
							this.option[key] = op[key];
						}
					}
		    	}
				this.name = control.id || control.name;
		    }
		    this.logInfo("window.init");
		    this.render();
		    this.afterRender();
	    },
		/**
	     * 对象创建函数.
	     */
	    create:function() {
		    this.base();
		    this.className = "com.ui.window";
		    this.logInfo("window.create");
		    this.eventList = {};
		    this.keyBoard = {
		        DOWN:40,
		        UP:38,
		        LEFT:37,
		        RIGHT:39,
		        ENTER:13,
				C:10,
				V:86,
				X:88,
				Z:90
		    };
			this.mouseType = {mtLeft : "L",
		                      mtRight: "R"};
		    this.parent;
			//处理宽高，顶点，左边
			this.option.top = this._domValue(this.option.top, 0);
		    this.option.left = this._domValue(this.option.left, 0);
			//绝对顶、左点
			this._atop = null;
		    this._aleft = null;
			//宽高
			this.option.width = this._domValue(this.option.width, 10);
		    this.option.height = this._domValue(this.option.height, 10);
			//内外边距
			this.option.margin = this._domValue(this.option.margin,0);
			this.option.padding = this._domValue(this.option.padding,0);
            this.option.border = this.option.border||"";
		    this.focus = false;
		    //面板选择
		    this.hasSelect = false;
			this._eventList = {};
		    this.body = null;
	    },
		/**
	     * 渲染函数.
	     */
	    render:function() {
	    	this.logInfo("window.render");
	    	if(typeof this.thisWindow == "undefined") {
	    	    this.thisWindow = this.createElement("div");
	    	}
	    	this.setStyle(this.thisWindow, "winStyle");
			//处理大小变量
	    	if(this._hasResize()) {
	    	    this._doResize();
	    	}
	    },
		/**
	     * 渲染后执行.
	     */
	    afterRender:function(){
	    	var _this = this;
	    	this.thisWindow.onmouseup = function() {
	        	_this.hasSelect = true;
	        };
	        //系统事件
	        this._sysEvent();
	    },
		/**
	     * 执行变化调整事件.
	     * @return 返回状态
	     */
	    _doResize:function() {
	    	if(!this._update) return false;
	    	this.logBegin("_doResize");
	    	//边距处理
	    	if(this.thisWindow.style.margin != this.option.margin + "px") {
	    		this.thisWindow.style.margin = this.option.margin + "px";
	    	}
	    	if(this.thisWindow.style.padding != this.option.padding + "px") {
	    		this.thisWindow.style.padding = this.option.padding + "px";
	    	}
			if(this.option.border !== "") {
	    		this.thisWindow.style.border = this.option.border;
	    	}
	    	//计算长宽
	    	var bw = this._getRectWidth();
	    	var bh = this._getRectHeight();
	    	if(bw <= 0) {
	    		bw = 1;
	        }
	    	bw += "px";
	    	if(bh <= 0) {
	    		 bh = 1;
	    	}
	    	bh += "px"
	    	var isResize = false;
	    	var msg = "";
	    	//处理大小
	    	if(this.thisWindow.style.width != bw) {
	    		msg += this.getName() + " width:" + this.thisWindow.style.width + " to " + bw + " ";
	    	    this.thisWindow.style.width = bw;
	    	    isResize = true;
	    	}
	    	if(this.thisWindow.style.height != bh) {
	    		msg += this.getName() + " height:" + this.thisWindow.style.height + " to " + bh + " ";
	    	    this.thisWindow.style.height = bh;
	    	    isResize = true;
	    	}
	    	this.logEnd("_doResize " + msg);
	    	return isResize;
	    },
	    /**
	     * 样式设置.
	     * @param tab 元素
	     * @param className 样式名
	     * @param doCss 设计样式
	     */
	    setStyle:function(tab, className, doCss){
	    	doCss = doCss || true;
	    	if(className instanceof Array) {
	    		//在元素上设置格式数组对象
	    		tab.cssAry = className;
	    		var cn = className.join(" ");
	    		if(tab.className != cn && doCss) {
	    			tab.className = cn;
	    		}
	    	} else {
	    		//直接设置样式
		    	if (tab.className != className) {
		    		if(doCss) {
		                tab.className = className;
		            }
		            tab.cssAry = [className];
		        }
	    	}
	    },
	    /**
	     * 添加样式.
	     * @param tab 元素
	     * @param className 样式名
	     * @param doCss 处理样式
	     */
	    addStyle:function(tab, className, doCss) {
	    	doCss = doCss || true;
	    	if(typeof tab.cssAry != "undefined") {
	    		//检查重复
	    		var i = 0, len = tab.cssAry.length
	    		for(; i < len; i++) {
	    			if(tab.cssAry[i] == className) {
	    				break;
	    			}
	    		}
	    		//添加样式
	    		if(i >= len) {
	    			tab.cssAry.push(className);
	    		}
	    	} else {
	    		tab.cssAry = [className];
	    	}
	    	if(doCss) {
	    		//设计样式到dom
	    		var ncs = tab.cssAry.join(" ");
	    		if(ncs !== tab.className) {
	    	        tab.className = ncs;
	    		}
	    	}
	    },
	    /**
	     * 清除样式.
	     * @param tab 元素
	     * @param doCss 执行样式.
	     */
	    clearStyle:function(tab, doCss) {
	    	if(typeof tab.cssAry != "undefined") {
	    		tab.cssAry = [];
	    	}
	    	doCss = doCss || true;
	    	if(doCss && tab.className !== "") {
	    	    tab.className = "";
	    	}
	    },
	    /**
	     * 删除样式.
	     * @param tab 元素
	     * @param className 样式名
	     * @param doCss 处理样式
	     */
	    delStyle:function(tab, className, doCss) {
	    	if(typeof tab.cssAry != "undefined") {
	    		//查找需要删除的样式名
	    		var i = 0, len = tab.cssAry.length;
	    		for(; i < len; i++) {
	    			if(tab.cssAry[i] == className) {
	    				break;
	    			}
	    		}
	    		if(i < len) {
	    			tab.cssAry.splice(i, 1);
	    		}
	    	}
	    	doCss = doCss || true;
	    	if(doCss) {
	    		var ncs = tab.cssAry.join(" ");
	    		if(ncs !== tab.className) {
	    	        tab.className = ncs;
	    		}
	    	}
	    },
		/**
		 * 解析dom元素的值.
		 * @param value 值
		 */
		_domValue:function(value, defValue) {
		    var vt = typeof value;
			var defValue = defValue || 0;
		    if(vt == "string") {
	    		value = value.replace(/px/, "");
	    		if(this.isNotEmpty(value) && !isNaN(value)) {
	    			value = parseInt(value, 10);
	    		} else {
				    value = defValue;
				}
	    	} else if(vt != "number") {
			    value = defValue;
			}
			return value;
		},
		/**
	     * 大小是否发生变化.
	     */
	    _hasResize:function() {
	    	return !(this.thisWindow.style.top == this.option.top + "px"
	    	         && this.thisWindow.style.left == this.option.left + "px"
	    	             && this.thisWindow.style.width == this._getRectWidth() + "px"
	    	                 && this.thisWindow.style.height == this._getRectHeight() + "px");
	    },
		/**
	     * 获取内宽.
	     * @return 返回宽度
	     */
	    _getRectWidth:function() {
	    	return this.getWidth() - (this._getBorderLeft()
 	       + this._getBorderRight()
	       + this._getMarginLeft()
	       + this._getMarginRight()
	       + this._getPaddingLeft()
	       + this._getPaddingRight());
	    },
	    /**
	     * 获取内高.
	     * @return 返回高度
	     */
	    _getRectHeight:function() {
	    	return this.getHeight() - (this._getBorderTop()
 	       + this._getBorderBottom()
	       + this._getMarginTop()
	       + this._getMarginBottom()
	       + this._getPaddingTop()
	       + this._getPaddingBottom());
	    },
		/**
	     * 获取边左线.
	     * @param el 元素
	     * @return 返回宽度
	     */
	    _getBorderLeft:function(el) {
	    	var el = el || this.thisWindow;
	    	return this._domValue(el.style.borderLeftWidth, 0);;
	    },
	    /**
	     * 获取右边线
	     * @param el 元素
	     * @return 返回宽度
	     */
	    _getBorderRight:function(el) {
	    	var el = el || this.thisWindow;
	    	return this._domValue(el.style.borderRightWidth, 0);
	    },
		/**
		 * 获取上边线
		 * @param el 元素
		 * @return 返回宽度
		 */
	    _getBorderTop:function(el) {
	    	var el = el || this.thisWindow;
	    	return this._domValue(el.style.borderTopWidth, 0);
	    },
	    /**
	     * 获取下边线
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getBorderBottom:function(el) {
	    	var el = el || this.thisWindow;
	    	return this._domValue(el.style.borderBottomWidth, 0);
	    },
	    /**
	     * 获取左外边距
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getMarginLeft:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.marginLeft, 0);
	    },
	    /**
	     * 获取右外边距
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getMarginRight:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.marginRight, 0);
	    },
	    /**
	     * 获取上外边距
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getMarginTop:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.marginTop, 0);
	    },
	    /**
	     * 获取下外边距
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getMarginBottom:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.marginBottom, 0);
	    },
	    /**
	     * 获取左内边距.
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getPaddingLeft:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.paddingLeft, 0);
	    },
	    /**
	     * 获取右内边距.
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getPaddingRight:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.paddingRight, 0);
	    },
	    /**
	     * 获取上内边距.
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getPaddingTop:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.paddingTop, 0);
	    },
	    /**
	     * 获取下内边距.
	     * @param el 元素
		 * @return 返回宽度
	     */
	    _getPaddingBottom:function(el) {
	    	var el = el || this.thisWindow;
            return this._domValue(el.style.paddingBottom, 0);
	    },
		/**
	     * 获取body元素宽度.
	     * @return body宽度
	     */
	    _getBodyWidth:function() {
	    	if(this.browser.safari) {
	    		return document.documentElement.clientWidth;
	    	} else {
	    		return this.body().width();
	    	}
	    },
	    /**
	     * 获取body元素高度.
	     * @return body高度
	     */
	    _getBodyHeight:function() {
	    	if(this.browser.safari) {
	    		return document.documentElement.clientHeight;
	    	} else {
	    		return this.body().height();
	    	}
	    },
		/**
		 * 返回当前窗口.
		 */
	    getRectDom:function() {
	    	return this.thisWindow;
	    },
		/**
		 * 返回窗口body.
		 */
	    body:function(){
	    	if(typeof this.winBody == "undefined") {
	    		this.winBody = document.getElementsByTagName("body")[0];
	    	}
	    	return this.winBody;
	    },
	    /**
	     * 获取高度.
	     * @return 返回高度
	     */
	    getHeight:function() {
	    	return this.option.height;
	    },
	    /**
	     * 设置高度.
	     * @param height 高度
	     * @param doRs 执行变更函数
	     */
	    setHeight:function(height, doRs) {
	    	this.option.height = height;
	    	//this.logInfo("Window.setHeight");
	    	doRs = doRs || true;
	    	if(doRs && this._hasResize()) {
	    	    this._doResize();
	    	}
	    },
	    /**
	     * 获取宽度
	     * @return 返回宽度
	     */
	    getWidth:function() {
	    	return this.option.width;
	    },
	    /**
	     * 设置宽度.
	     * @param width 宽度
	     * @param doRs 执行变更函数
	     */
	    setWidth:function(width, doRs){
	    	this.option.width = width;
	    	//this.logInfo("Window.setWidth");
	    	doRs = doRs || true;
	    	if(doRs && this._hasResize()) {
	    	    this._doResize();
	    	}
	    },
	    /**
	     * 设置顶点.
	     * @param top 顶点
	     * @param doRs 执行变更函数
	     */
	    setTop:function(top, doRs) {
	    	this.option.top = top;
	    	this.logInfo("Window.setTop");
	    	doRs = doRs || true;
	    	if(doRs && this._hasResize()) {
	    	    this._doResize();
	    	}
	    },
	    /**
	     * 获取当前顶点位置
	     * @return 顶点坐标
	     */
	    getTop:function() {
	    	return this.option.top;
	    },
	    /**
	     * 设置左边位置.
	     * @param left 左边位置
	     * @param doRs 执行变更函数
	     */
	    setLeft:function(left, doRs) {
	    	this.option.left = left;
	    	this.logInfo("Window.setLeft");
	    	doRs = doRs || true;
	    	if(doRs && this._hasResize()) {
	    	    this._doResize();
	    	}
	    },
	    /**
	     * 获取左边位置值.
	     * @return 返回
	     */
	    getLeft:function() {
	    	return this.option.left;
	    }
    });
})();
