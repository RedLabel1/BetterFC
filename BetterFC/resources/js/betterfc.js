
var sv, fv = {};
var d = new Date();

if(setVerSubVars() && !sessionStorage.getItem("isCookieSet")) {
	u = $("a").filter(function() {return this.href.match(/member.php/)})[0].text;
	resetCookies(u);
}

if((window.location.href.indexOf("https://www.forocoches.com/foro/")!=-1 || window.location.href.indexOf("http://www.forocoches.com/foro/")!=-1)
	&& (window.location.href.indexOf("https://www.forocoches.com/foro/subscription.php")==-1 && window.location.href.indexOf("http://www.forocoches.com/foro/subscription.php")==-1)) {
	
	if(setVerSubVars()) {
		$($("table[class='tborder']").find($("td[class='alt2'][width='60px']"))[1]).after(fv.verSubTd[0]);
	}
}

if(window.location.href.indexOf("https://www.forocoches.com/foro/subscription.php?do=addsubscription&t=")!=-1
	|| window.location.href.indexOf("http://www.forocoches.com/foro/subscription.php?do=addsubscription&t=")!=-1) {
	
	// *** u=username, t=threadid, solo lectura ***
	u = $("a").filter(function() {return this.href.match(/member.php/)})[0].text;
	t = $("input[type='hidden'][name='threadid']")[0].value;
	$("input").filter(function() {return this.value.match(/Agregar/)}).click(function() {
		createCookie("bfcSub"+u, readCookie("bfcSub"+u)+","+t, d);
	});
} else if(window.location.href.indexOf("https://www.forocoches.com/foro/subscription.php?do=addsubscription&f=")!=-1
	|| window.location.href.indexOf("http://www.forocoches.com/foro/subscription.php?do=addsubscription&f=")!=-1) {

} else if(window.location.href.indexOf("https://www.forocoches.com/foro/showthread.php?p=")!=-1
	|| window.location.href.indexOf("http://www.forocoches.com/foro/showthread.php?p=")!=-1
	|| window.location.href.indexOf("https://www.forocoches.com/foro/showthread.php?t=")!=-1
	|| window.location.href.indexOf("http://www.forocoches.com/foro/showthread.php?t=")!=-1) {
	
	if(setShowthreadVars()) {
		if(readCookie("bfcSub"+sv.u)!="" && readCookie("bfcSub"+sv.u).indexOf(sv.t)!=-1) {
			$("#verSubTd").after(sv.doSubTd_[0]);
		} else {
			$("#verSubTd").after(sv.doSubTd[0]);
		}
		// *** handler sub ***
		$($("#doSubSpan")[0]).click(function() {
			subscribe(sv);
		});
		// *** handler unsub ***
		$($("#doSubSpan2_")[0]).click(function() {
			unsubscribe(sv);
		});
	}
	highlightOp();
} else if(window.location.href.indexOf("https://www.forocoches.com/foro/subscription.php")!=-1
	|| window.location.href.indexOf("http://www.forocoches.com/foro/subscription.php")!=-1) {

	var $fSub = $("form").filter(function() {return this.action.match(/dostuff/)});
	var pc = {};
	u = $("a").filter(function() {return this.href.match(/member.php/)})[0].text;
	resetCookies(u);
	// *** trash bin ***
	$("form").filter(function() {return this.action.match(/viewsubscription/)}).remove();
	$fSub.next().next().find("tr").empty();
	$fSub.next().next().attr({id: "tbTrash", class: "tborder", cellpadding: "5", cellspacing: "1"});
	$fSub.next().next().find("tr").append($("<td id='tdTrash' class='alt1' align='center'></td>"));
	$fSub.append($("select[name='what']"));
	$("#tdTrash").append("<label id='lblTrash'></label>");
	$("#tdTrash").append("<br>");
	$("#lblTrash")[0].textContent = "ARRASTRA UN HILO AQUI PARA ELIMINARLO DE TUS SUSCRIPCIONES";
	// *** tabla subs ***
	$("select[name='what']").val("delete");
	$fSub.find("td[class='tfoot']").attr({id: "tdSubsFooter", class: "tcat"});
	$("#tdSubsFooter").empty();
	$fSub.find("tbody").children().each(function(i){
		if(i==1) {
			$($fSub.find("tbody").children()[i].children[4]).remove();
			$($fSub.find("tbody").children()[i].children[3]).remove();
			$fSub.find("tbody").children()[i].children[0].colSpan = 3;
		} else if(i>1 && i<$fSub.find("tbody").children().length-1) {
			$($(this).children()[5]).css({	"visibility": "hidden", "position": "fixed" });
			$($(this).children()[4]).remove();
			pc = setTdSubPostCount();
			$(this).prepend(pc.tdSubPostCount);
			// *** drag sub ***
			$(this).draggable({ 
				revert : function(event) { return !event; },
				appendTo : 'body',
				helper : 'clone'
			});
		}
	});
	// *** drop sub ***
	$("#tdTrash").droppable({
		drop: function(event, ui) {
			$(ui.draggable).children()[5].children[0].checked = true;
			$.ajax({
				type: 'POST',
				url: 'https://www.forocoches.com/foro/subscription.php?do=dostuff&folderid=0',
				data: $("form[action='subscription.php?do=dostuff&folderid=0']").serialize(),
				success: function(response) {
					createCookie("bfcSub"+u, readCookie("bfcSub"+u).split(","+$(ui.draggable)[0].children[1].id.substring($(ui.draggable)[0].children[1].id.lastIndexOf('_')+1)).join(""), d);
					$(ui.draggable).remove();
				}
			});
		}
	});
} else if(window.location.href.indexOf("https://www.forocoches.com/foro/forumdisplay.php?f=")!=-1
	|| window.location.href.indexOf("http://www.forocoches.com/foro/forumdisplay.php?f=")!=-1) {
	
	$("tbody").filter(function() {return this.id.match(/threadbits_forum_/)}).children().each(function(i) {
		if(this.children[4].children[0].children[0].text.split(".").join("")==0) {
			$(this.children[2]).css("background-color", "#FFE9D4");
		}
	});
	(function() {
		if((window.location.href.indexOf("https://www.forocoches.com/foro/forumdisplay.php?f=")!=-1
			|| window.location.href.indexOf("http://www.forocoches.com/foro/forumdisplay.php?f=")!=-1)
			&& readCookie("bfcThreadInterval")!=61) {
			$.ajax({
				url: window.location.href,
				datatype : "json",
				contentType: "application/json; charset=utf-8",
				success: function(response) {
					$("tbody").filter(function() {return this.id.match(/threadbits_forum_/)}).remove();
					$("#threadslist").append($(response).find("tbody").filter(function() {return this.id.match(/threadbits_forum_/)}));
					$("tbody").filter(function() {return this.id.match(/threadbits_forum_/)}).children().each(function(i) {
						if(this.children[4].children[0].children[0].text.split(".").join("")==0) {
							$(this.children[2]).css("background-color", "#FFE9D4");
						}
					});
				}
			});
			setTimeout(arguments.callee, ((readCookie("bfcThreadInterval")!="") ? readCookie("bfcThreadInterval") : 6)*1000);
		} else {
			setTimeout(arguments.callee, 3*1000);
		}
	})()
}

$(function(){
	(function() {
		if(readCookie("bfcNotifInterval")!=61) {
			$.ajax({
				url: window.location.href,
				datatype : "json",
				contentType: "application/json; charset=utf-8",
				success: function(response) {
					var $subcountDivs = $(response).find("td[class='alt1'][width='100%']").siblings();
					$("table[class='tborder']").find($("td[class='alt1'][width='100%']")).next().remove();
					$("table[class='tborder']").find($("td[class='alt1'][width='100%']")).next().remove();
					$("table[class='tborder']").find($("td[class='alt1'][width='100%']")).next().remove();
					$($("table[class='tborder']").find($("td[class='alt1'][width='100%']"))[0]).after(($subcountDivs.length>3) ? $subcountDivs.not(":last") : $subcountDivs);
				}
			});
			setTimeout(arguments.callee, ((readCookie("bfcNotifInterval")!="") ? readCookie("bfcNotifInterval") : 6)*1000);
		} else {
			setTimeout(arguments.callee, 3*1000);
		}
	})()
	$("body").css("visibility", "visible");
	chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
		createCookie("bfcThreadInterval", message.thread, d);
		createCookie("bfcNotifInterval", message.notif, d);
	});
});

function highlightOp() {
	var op = "";
	$.ajax({
		url: window.location.href,
		datatype : "json",
		contentType: "application/json; charset=utf-8",
		success: function(response){
			op = $(response).find("a[class='bigusername']")[0].text;
			$("a[class='bigusername']").each(function(i) {
				if(this.text == op) {
					$(this).parent().parent().next().css("background-color", "#FFE9D4");
					$(this).parent().parent().parent().next().children().first().css("background-color", "#FFE9D4");
					$(this).parent().parent().parent().next().next().children().first().next().css("background-color", "#FFE9D4");
				}
			});
		}
	});
}

function resetCookies(u) {
	$.ajax({
		url: "https://www.forocoches.com/foro/subscription.php",
		datatype : "json",
		contentType: "application/json; charset=utf-8",
		success: function(response){
			var $fSub = $(response).find("form").filter(function() {return this.action.match(/dostuff/)});
			var listaT = "";
			$fSub.find("tbody").children().each(function(i){
				if(i>1 && i<$fSub.find("tbody").children().length-1) {
					listaT += ","+this.children[0].id.substring(this.children[0].id.lastIndexOf("_")+1);
				}
			});
			createCookie("bfcSub"+u, listaT, d);
			sessionStorage.setItem("isCookieSet", "y");
		}
	});
}

function setVerSubVars() {
	try {
		fv = {"verSubTd":{}, "verSubA":{}, "verSubDiv":{}, "verSubSpan":{}};
		fv.verSubTd = $("<td id='verSubTd'></td>");
		fv.verSubA = $("<a id='verSubA' href='subscription.php'></a>");
		fv.verSubDiv = $("<div id='verSubDiv'></div>");
		fv.verSubSpan = $("<span id='verSubSpan'>MIS&nbsp;SUBS</span>");
		fv.verSubTd[0].appendChild(fv.verSubA[0]);
		fv.verSubA[0].appendChild(fv.verSubDiv[0]);
		fv.verSubDiv[0].appendChild(fv.verSubSpan[0]);
		return true;
	} catch(e) {
		return false;
	}
}

function setShowthreadVars() {
	try {
		sv = {"u":"", "t":"", "doSubTd":{}, "doSubA":{}, "doSubDiv":{}, "doSubSpan":{}, "doSubTd_":{}, "doSubA_":{}, "doSubDiv_":{}, "doSubSpan_":{}, "doSubSpan2_":{}};
		sv.u = $("a").filter(function() {return this.href.match(/member.php/)})[0].text;
		sv.t = $("input[type='hidden'][name='t']")[0].value;
		sv.doSubTd_ = $("<td id='doSubTd_'></td>");
		sv.doSubDiv_ = $("<div id='doSubDiv_' align='center'></div>");
		sv.doSubA_ = $("<a id='doSubA_'></a>");
		sv.doSubSpan_ = $("<span id='doSubSpan_'>Ya&nbsp;suscrito</span>");
		sv.doSubSpan2_ = $("<span id='doSubSpan2_'>cancelar</span>");
		sv.doSubTd = $("<td id='doSubTd'></td>");
		sv.doSubDiv = $("<div id='doSubDiv'></div>");
		sv.doSubA = $("<a id='doSubA'></a>");
		sv.doSubSpan = $("<span id='doSubSpan'>SUSCRIBIRSE</span>");
		sv.doSubTd_[0].appendChild(sv.doSubA_[0]);
		sv.doSubA_[0].appendChild(sv.doSubDiv_[0]);
		sv.doSubDiv_[0].appendChild(sv.doSubSpan_[0]);
		sv.doSubDiv_[0].appendChild($("<br>")[0]);
		sv.doSubDiv_[0].appendChild(sv.doSubSpan2_[0]);
		sv.doSubTd[0].appendChild(sv.doSubA[0]);
		sv.doSubA[0].appendChild(sv.doSubDiv[0]);
		sv.doSubDiv[0].appendChild(sv.doSubSpan[0]);
		return true;
	} catch(e) {
		return false;
	}
}

function subscribe(sv) {
	var g = {"data":""};
	var isSuccess = function(response) {
		g.data = $($(response).find("form"))[4];
		$("body").append(g.data);
		$(g.data).css({	"visibility": "hidden", "position": "fixed" });
		// *** crea sub, evita reflujo al hilo ***
		$.ajax({
			type: "POST",
			url: "https://www.forocoches.com/foro/subscription.php?do=doaddsubscription&threadid=" + sv.t,
			data: $("form[action='subscription.php?do=doaddsubscription&threadid="+sv.t+"']").serialize(),
			success: function(response) {
				d = new Date();
				createCookie("bfcSub"+sv.u, readCookie("bfcSub"+sv.u)+","+sv.t, d);
				$(sv.doSubTd[0]).remove();
				$("#verSubTd").after(sv.doSubTd_[0]);
				$(g.data).remove();
				$($("#doSubSpan2_")[0]).click(function() {
					unsubscribe(sv);
				});
			}
		});
	}
	// *** evita navegacion a confirm ***
	$.ajax({
		url: "https://www.forocoches.com/foro/subscription.php?do=addsubscription&t=" + sv.t,
		datatype : "json",
		contentType: "application/json; charset=utf-8",
		success: isSuccess
	});
}

function unsubscribe(sv) {
	var g = {"data":""};
	var isSuccess = function(response) {
		g.data = $(response).find("form").filter(function() {return this.action.match(/dostuff/)});
		$(g.data).find("#td_threadstatusicon_"+sv.t).siblings(":last").children()[0].checked = true;
		$(g.data).find("select[name='what']").val("delete");
		$(g.data).find("script").remove();
		$("body").append(g.data);
		$(g.data).css({	"visibility": "hidden", "position": "fixed" });
		// *** llamada ajax para unsub ***
		$.ajax({
			type: 'POST',
			url: 'https://www.forocoches.com/foro/subscription.php?do=dostuff&folderid=0',
			data: $("form[action='subscription.php?do=dostuff&folderid=0']").serialize(),
			success: function(response) {
				createCookie("bfcSub"+sv.u, readCookie("bfcSub"+sv.u).split(","+sv.t).join(""), d);
				$(sv.doSubTd_[0]).remove();
				$("#verSubTd").after(sv.doSubTd[0]);
				$(g.data).remove();
				$($("#doSubSpan")[0]).click(function() {
					subscribe(sv);
				});
			}
		});
	}
	// *** llamada ajax para recoger form unsub ***
	$.ajax({
		url: "https://www.forocoches.com/foro/subscription.php",
		datatype : "json",
		contentType: "application/json; charset=utf-8",
		success: isSuccess
	});
}

function setTdSubPostCount() {
	var pc = {"tdSubPostCount":{}, "spanPostCount":{}, "spanPostCount_":{}};
	pc.tdSubPostCount = $("<td id='tdSubPostCount'></td>");
	pc.spanPostCount = $("<span id='tdSubPostCount'></span>");
	pc.spanPostCount_ = $("<span id='spanPostCount_'></span>");
	pc.tdSubPostCount[0].appendChild(pc.spanPostCount[0]);
	pc.tdSubPostCount[0].appendChild($("<br>")[0]);
	pc.tdSubPostCount[0].appendChild(pc.spanPostCount_[0]);
	return pc;
}

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