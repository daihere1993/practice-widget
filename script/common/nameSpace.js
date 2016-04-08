function nameSpace () {
	var arg = arguments, obj = null, arr, ns;
	//保存当前的nameSpace
	for ( var i = 0, len = arg.length; i < len; i++ ) {
		//以"."分割字符串
		arr = arg[i].split(".");
		//取出第一节的点对象
		ns = arr[0];
		//判断是否存在ns字符串对应的对象, 若不存在则初始化成原型对象
		if ( window[ns] === undefined ) {
			window[ns] = {};
		}
		obj = window[ns];
		//循环判断对象已存在, 如果未存在, 则初始化成原始对象
		for ( var j = 1; j < len; j++ ) {
			if ( obj[arr[j]] === undefined ) {
				obj[arr[j]] = {};
			}
			obj = obj[arr[j]];
		}
	}
	return obj;
}
