/**
* Author:Carrie Jiang
* This file provides common utilities
*/
var // Find the height of the viewport
	windowHeight = function () {
		// A shortcut, in case we're using Internet Explorer 6 in Strict Mode
		var de = document.documentElement;
		return self.innerHeight || ( de && de.clientHeight ) || document.body.clientHeight;
	},
	// Find the width of the viewport
	windowWidth = function () {
		// A shortcut, in case we're using Internet Explorer 6 in Strict Mode
		var de = document.documentElement;
		return self.innerWidth ||( de && de.clientWidth ) || document.body.clientWidth;
	},
	utils = {
			addListener: null,
			removeListener: null,
			windowHeight : windowHeight,
			windowWidth : windowWidth,
	};

// Normalizing the addListener 
if (typeof window.addEventListener === 'function') {
	utils.addListener = function (el, type, fn) {
		el.addEventListener(type, fn, false);
	};
	utils.removeListener = function (el, type, fn) {
		el.removeEventListener(type, fn, false);
	};
} else if (typeof document.attachEvent === 'function') { // IE
	utils.addListener = function (el, type, fn) {
		el.attachEvent('on' + type, fn);
	};
	utils.removeListener = function (el, type, fn) {
		el.detachEvent('on' + type, fn);
	};
} else { // older browsers
	utils.addListener = function (el, type, fn) {
		el['on' + type] = fn;
	};
	utils.removeListener = function (el, type, fn) {
		el['on' + type] = null;
	};
}

