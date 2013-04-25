/**
 * Global development and debugging helper
 * Author: Marc Diethelm
 */
 
(function() {

	var  w = window
		,c
		,isElement
		,isjQuery
	;
	
	function concatArgs(args) {
		
		var str = ''
			,i
			,arg
			,delim = '  '
		;
		for (i = 0, str = ''; i<args.length; i++) {
			arg = args[i];
			if (arg !== undefined && arg !== null) {
				
				// if this is an DOM element node, show an appropriate representation. 
				if (isElement(arg))
					str += elementToString(arg);
				// if this is a jQuery object, use the log method plugin defined below
				else if (isjQuery(arg))
					str += jQueryToString(arg);
				// for everything else use native JS toString methods. Or fail miserably! :((
				else
					str += arg.toString();
			 // arg is either undefined or null. Let the JS engine convert it to string.
			} else
				str += arg;
			
			str += delim;
		}
		return str;
	}
	
	function elementToString(elem) {
		
		var htmlId = ''
		    ,htmlClass = ''
		;
		elem.id && (htmlId = '#' + elem.id); 
		elem.className && (htmlClass = '.' + elem.className.replace(/\s/g, '.')); // replace any white space with a '.'
		return elem.tagName + htmlId + htmlClass;
	}
	
	function jQueryToString($obj) {
		var i
			,stringArray = []
		;
		for (i=0; i<$obj.length; i++) {
			stringArray.push( elementToString($obj[i]) );
		}
		
		return '$('+ stringArray.join(', ') +')';
	}
	
	//Resulting function returns true if param is a DOM element
	if (typeof HTMLElement === 'object')
		isElement = function(obj) { return obj instanceof HTMLElement }
	else
		isElement = function(obj) { return typeof obj == 'object' && obj.nodeType === 1 && typeof obj.nodeName==='string' }
	
	// Resulting function returns true if param is a jQuery object
	try {
		$() instanceof jQuery; // abusing try/catch for flow control. Old crappy browsers (I'm lookin at you IE) will throw.
		isjQuery = function(obj) { return obj instanceof jQuery }
	} catch (e) {
		isjQuery = function(obj) { return 'jquery' in obj && typeof obj.jquery == 'string' }
	}
	
	if (w.console) {
		c = console;
		if ('dir' in c && 'apply' in c.dir) { // create global shortcuts
			typeof c.log   === 'function' && ( w.log   = function() { c.log.apply(c, arguments) } );
			typeof c.info  === 'function' && ( w.info  = function() { c.info.apply(c, arguments) } );
			typeof c.debug === 'function' && ( w.debug = function() { c.debug.apply(c, arguments) } );
			typeof c.error === 'function' && ( w.error = function() { c.error.apply(c, arguments) } );
			typeof c.dir   === 'function' && ( w.dir   = function() { c.dir.apply(c, arguments) } );
			typeof c.table === 'function' && ( w.table = function() { c.table.apply(c, arguments) } );
		}
		else { // IE: we have console.log but it just accepts one param. let's fix that! :)
			w.log = function() {
				c.log(concatArgs(arguments));
			}
		}

		clear = c.clear; // supported in IE and Fx
	}
	else {
		w.log = function() { alert(concatArgs(arguments)) };
	}
	
	w._alert = function() { alert(concatArgs(arguments)) };

	/**
	 * A tiny jQuery plugin adding logging to any jQuery object
	 * @param clear Boolean Clear the console before logging?
	 */
	
	w.jQuery && (jQuery.fn.log = function(clear) {
		clear && c.clear.call(c);
		c.log.call(c, this);
		return this;
	});
	
	w.jQuery && (jQuery.fn.alert = function() {
		w._alert(concatArgs(this));
	});
	
})();
