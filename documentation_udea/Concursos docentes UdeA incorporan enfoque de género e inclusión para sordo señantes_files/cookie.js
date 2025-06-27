/*
Libreria para el manejo de cookies y de url de retorno para las aplicaciones web de la udea

Funciones:
- function clearCookie(cookieName)
- function setCookie(cookieName, cookieValue, expires, path, domain, secure)
- function getCookie(cookieName)
- function setReturnCookie(urlReturn)
- function getReturnCookie()
- function clearReturnCookie()
- function goReturnCookie(target)
*/

// [Cookie] Clears a cookie
function clearCookie(cookieName){
	var now = new Date();
	var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
	setCookie(cookieName, '', yesterday);
}

// [Cookie] Sets value in a cookie
function setCookie(cookieName, cookieValue, expires, path, domain, secure){
	var samesite = "None";
	secure = typeof(secure) != 'undefined' ? secure: false;

	if(cookieName == 'user_name'){
		domain = ".udea.edu.co";
		samesite = "Lax";
	}

	if(cookieName == 'udea_app_time'){
		domain = ".udea.edu.co";
		samesite = "Lax";
	}

	if(expires == true){
		expires = new Date();
		expires.setTime(expires.getTime() + (15*60*1000));
	}

	if(samesite != "Lax" && samesite != "Strict" && samesite != "None"){
		samesite = "None";
	}

	document.cookie =
		escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '')
		+ (domain ? '; domain=' + domain : '')
		+ (samesite ? '; samesite=' + samesite : '')
		+ (secure ? '; secure' : secure);
}

// [Cookie] Gets a value from a cookie
function getCookie(cookieName){
	var cookieValue = false;
	var posName = document.cookie.indexOf(escape(cookieName) + '=');

	if (posName != -1){
		var posValue = posName + (escape(cookieName) + '=').length;
		var endPos = document.cookie.indexOf(';', posValue);
		cookieValue = "";

		if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
		else cookieValue = unescape(document.cookie.substring(posValue));
	}

	return (cookieValue);
}

var udeaReturnCookieName = "udeaUrlReturn";
var udeaDefaultReturn = "http://www2.udea.edu.co/mua/paginas/usuariosexternos/datosUsuario.iface";

//Setea la cookie con la url de retorno despues de un proceso
function setReturnCookie(urlReturn){
	setCookie(udeaReturnCookieName, urlReturn , false, "/", ".udea.edu.co");
}

//Retorna la cookie con la url de retorno despues de un proceso
function getReturnCookie(){
	return getCookie(udeaReturnCookieName);
}

//Setea la cookie con la url de retorno por defecto
function setDefaultReturnCookie(){
	setReturnCookie(udeaDefaultReturn);
}

//Borra la cookie con la url de retorno despues de un proceso
function clearReturnCookie(){
	setReturnCookie("");
}

//Abre la direccion en la cookie
function goReturnCookie(target){
	target = typeof(target) != 'undefined' ? target: "_self";
	target = (target == "") ? "_self" : target;

	var url = getReturnCookie();

	if(url == "")return;
	if(url.toLowerCase().indexOf("http") < 0)url = "http://"+url;

	clearReturnCookie();
	window.open(url, target, "");
}