var helpers = {
	// I would add this to CanvasRenderingContext2D, but a wise man once said to never extend native objects
	fillRoundedRect: function(context, x, y, w, h, r){
		context.beginPath();
		context.moveTo(x+r, y);
		context.lineTo(x+w-r, y);
		context.quadraticCurveTo(x+w, y, x+w, y+r);
		context.lineTo(x+w, y+h-r);
		context.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
		context.lineTo(x+r, y+h);
		context.quadraticCurveTo(x, y+h, x, y+h-r);
		context.lineTo(x, y+r);
		context.quadraticCurveTo(x, y, x+r, y);
		context.fill();
	},

	randomIntBetween: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	getAllUrlParams: function(url) {
	  // get query string from url (optional) or window
	  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	  // we'll store the parameters here
	  var obj = {};
	  // if query string exists
	  if (queryString) {
	    // stuff after # is not part of query string, so get rid of it
	    queryString = queryString.split('#')[0];
	    // split our query string into its component parts
	    var arr = queryString.split('&');
	    for (var i=0; i<arr.length; i++) {
	      // separate the keys and the values
	      var a = arr[i].split('=');
	      // in case params look like: list[]=thing1&list[]=thing2
	      var paramNum = undefined;
	      var paramName = a[0].replace(/\[\d*\]/, function(v) {
	        paramNum = v.slice(1,-1);
	        return '';
	      });
	      // set parameter value (use 'true' if empty)
	      var paramValue = typeof(a[1])==='undefined' ? true : a[1];
	      // (optional) keep case consistent
	      paramName = paramName.toLowerCase();
	      paramValue = paramValue.toLowerCase();
	      // if parameter name already exists
	      if (obj[paramName]) {
	        // convert value to array (if still string)
	        if (typeof obj[paramName] === 'string') {
	          obj[paramName] = [obj[paramName]];
	        }
	        // if no array index number specified...
	        if (typeof paramNum === 'undefined') {
	          // put the value on the end of the array
	          obj[paramName].push(paramValue);
	        }
	        // if array index number specified...
	        else {
	          // put the value at that index number
	          obj[paramName][paramNum] = paramValue;
	        }
	      }
	      // if param name doesn't exist yet, set it
	      else {
	        obj[paramName] = paramValue;
	      }
	    }
	  }
	  return obj;
	}
}