var d = new Date();
var _original_time = d.getTime();

usr = (typeof usr == 'undefined') ? "" : usr;
usr = (usr == "null") ? "" : usr;
usr = (usr == null) ? "" : usr;

function _udeaCheckTime(){
	let _udea_app_time = getCookie("udea_app_time");

	if(_udea_app_time == _original_time){
		let x = new Date();
		_original_time = x.getTime();
		console.log("renovando "+x.getTime());
		setCookie("udea_app_time", _original_time, true, "/");
		window.setTimeout(function(){ _udeaCheckTime() }, 5*60*1000);
	}else{
		console.log("carga por _udeaCheckTime en "+d.getTime(), _udea_app_time, _original_time);
		//location.reload();
	}
}

function _udeaCheckUser(){
	let _usrext = getCookie("user_name");

	if(usr == "" || usr == null){
		if(_usrext != false){
			if(_usrext.indexOf(".") < 0 && _usrext != ""){
				usr = _usrext;
			}
		}
	}

	setCookie("user_name", usr, true, "/");
	setCookie("udea_app_time", _original_time, true, "/");
	localStorage.setItem("user_name", usr);
	window.setTimeout(function(){ _udeaCheckTime(); }, 5*60*1000);
}

function _udeaAddAlertEvent(){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://ayudame2.udea.edu.co/javascript/getOutUdeA.js?time='+d.getTime();
	document.body.appendChild(script);
	//document.querySelector('body').appendChild(script);
}

function _udeaAddCookieJs(){
	if(typeof getCookie === 'undefined'){
		var script = document.createElement('script');

		script.type = 'text/javascript';
		script.src = 'https://ayudame2.udea.edu.co/javascript/comunes/cookie.js?time='+d.getTime();
		script.onload = function(){ _udeaCheckUser(); };
		//document.head.appendChild(script);
		document.body.appendChild(script);
	}else{
		_udeaCheckUser();
	}
}

window.addEventListener("storage", (event) => {
    if (event.key === "user_name") {
        let newValue = event.newValue;

        if(usr !== newValue) {
			console.log("carga por addEventListener", newValue, usr);
            //location.reload();
        }
    }
});

_udeaAddCookieJs();
_udeaAddAlertEvent();
