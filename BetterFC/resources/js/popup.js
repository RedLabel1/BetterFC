
var d = new Date();

$(function() {
	$( "#sliderNotif" ).slider({
		range: "min",
		min: 3,
		max: 61,
		value: (readCookie("bfcNotifInterval")!="") ? readCookie("bfcNotifInterval") : 6,
		slide: function( event, ui ) {
			$( "#amount" ).val( ui.value );
			(ui.value==61) ? $(this).find('.ui-slider-handle').text('-') : $(this).find('.ui-slider-handle').text(ui.value);
		},
		create: function(event, ui) {
			var v = $(this).slider('value');
			(v==61) ? $(this).find('.ui-slider-handle').text('-') : $(this).find('.ui-slider-handle').text(v);
		},
		stop: function(event, ui) {
			var v = $(this).slider('value');
			createCookie("bfcNotifInterval", v, d);
			chrome.tabs.query({active:true,currentWindow:true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {thread:$("#sliderThread").slider('value'), notif:v});
			});
		}
	});

	$( "#sliderThread" ).slider({
		range: "min",
		min: 3,
		max: 61,
		value: (readCookie("bfcThreadInterval")!="") ? readCookie("bfcThreadInterval") : 6,
		slide: function( event, ui ) {
			$( "#amount" ).val( ui.value );
			(ui.value==61) ? $(this).find('.ui-slider-handle').text('-') : $(this).find('.ui-slider-handle').text(ui.value);
		},
		create: function(event, ui) {
			var v = $(this).slider('value');
			(v==61) ? $(this).find('.ui-slider-handle').text('-') : $(this).find('.ui-slider-handle').text(v);
		},
		stop: function(event, ui) {
			var v = $(this).slider('value');
			createCookie("bfcThreadInterval", v, d);
			chrome.tabs.query({active:true,currentWindow:true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {thread:v, notif:$("#sliderNotif").slider('value')});
			});
		}
	});
});

function createCookie(n,v,d) {
	d.setTime(d.getTime()+(3600*24*60*60*1000));
	var expires = "; expires="+d.toUTCString();
	document.cookie = n+"="+v+expires+"; path=/";
}

function readCookie(n) {
	var nameEQ = n + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return "";
}