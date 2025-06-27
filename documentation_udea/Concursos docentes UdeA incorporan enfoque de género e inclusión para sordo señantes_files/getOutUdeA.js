var second = 1000; //microsegundos en un segundo
var wOut = null;
var _udeaTriesCheck = 10; //intentos de analisis (5)
var _udeaStepTime = 60; //segundos para cada analisis (60)
var _udeaOutTime = 60; //segundos para salir si no hay respuesta (60)
var _udeaWidthAlert = 300, _udeaHeightAlert = 200; //ancho y alto de la ventana de advertencia
var cookielast = "lastPageUdeA", cookiecnt = "cntPageUdeA", cookieFinal = "controlUdeARetry";
var _udeaWarningUrl = "https://link.udea.edu.co/warningportal";
//var _udeaLogoutUrl = "http://mokana.udea.edu.co/portal/pls/portal/PORTAL.wwsec_app_priv.logout?p_return_url=http://mokana.udea.edu.co/portal/pls/portal/PORTAL.home"
var _udeaLogoutUrl = "https://link.udea.edu.co/getoutportal";
var _udeaDivAlertId = "portalinactivityalert";
var _udeaAlertType = "";

function addCSSclass(className, classRule) {
	var styleTag = document.createElement('style');
	document.getElementsByTagName('head')[0].appendChild(styleTag);
	var sheet = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;
            
	if(sheet.insertRule)sheet.insertRule (className+" {"+classRule+"}", 0);
	else sheet.addRule (className, classRule, 0);
}

function detectPopupEnabled(){
	var myTest = window.open("about:blank", "", "left=0,top=0,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=1,width=1");

	if(myTest){
		_udeaAlertType = "page";
		myTest.close();
		return true;
	}

	return false;
}

function openWarningPopup(){
	var wapp = _udeaWidthAlert, happ = _udeaHeightAlert;
	var ancho = screen.width, alto = screen.height;
	var xPos = (ancho - (wapp+10)) / 2;
	var yPos = (alto - (happ+75)) / 2;

	wOut = window.open(_udeaWarningUrl, 'warnUdeA', "height="+happ+",width="+wapp+",left="+xPos+",top="+yPos+",scrollbars=yes,resizable=0");
	wOut.focus();   
}

function openWarningDiv(){
	_udeaAlertType = "div";

	if(document.getElementById(_udeaDivAlertId) == null){
		var _hw = document.body.clientHeight;
		var _ww = document.body.clientWidth;

		addCSSclass("#portalinactivityalert", "display:block; top:0px; left:0px; width:"+(_ww-20)+"px; height:"+(_hw-10)+"px; position:fixed; border:1px solid #888; padding:10px; text-align:center; font-weight:bold; color:#fff; background-color: rgba(35, 35, 35, 0.3); z-index: 999;");

		var g = document.createElement('div');
		g.setAttribute("id", _udeaDivAlertId);
		document.body.appendChild(g);
		document.getElementById(_udeaDivAlertId).innerHTML = "<br><br><iframe frameBorder='0' width='300' height='200' src='"+_udeaWarningUrl+"'></iframe>";
	}else{
		document.getElementById(_udeaDivAlertId).style.display = '';
	}
}

function warningOutUdeA(){
	if(_udeaAlertType == ""){
		detectPopupEnabled();
	}

	if(_udeaAlertType == "page"){
		openWarningPopup();
	}else{
		openWarningDiv();
	}

	//if(typeof("openTB") == "function")openTB(_udeaWarningUrl, _udeaHeightAlert, _udeaWidthAlert);
	//else alert("Para ver las notificaciones de seguridad debe activar los popups");
}

function doGetOutUdeA(){
	closeAlert();

	if(getCookie("cookieFinal") == ""){
		location.reload();
	}else{
		window.open(_udeaLogoutUrl, "_self");
	}
}

function resetParams(a, b){
	setCookie(cookielast, a , false, "/", ".udea.edu.co");
	setCookie(cookiecnt, b , false, "/", ".udea.edu.co");
}

function continueUdeASession(){
	resetParams("", "0");
	closeAlert();
}

function closeAlert(){
	if(_udeaAlertType == "page"){
		if(wOut != null){
			wOut.close();
		}
	}else{
		document.getElementById(_udeaDivAlertId).style.display = 'none'; 
	}
}

function detectPages(){
	var outTime = _udeaOutTime;

	if(getCookie("user_name") != usr){
		location.reload();
	}else if(getCookie("user_name") == usr && usr == ""){
		window.setTimeout("detectPages();", outTime*second);
		return;
	}else{
		var new_page = "", old_page = "", cnt_page, page_obj;
		var stepTime = _udeaStepTime;
		var tries = (typeof(cookieTime) != 'undefined') ? cookieTime: _udeaTriesCheck;	//maximo de intentos de analisis
		var _udeaTags = new Array("indice", "cont");

		try{
			var cntTags = _udeaTags.length;

			for(var i=0; i<cntTags; i++){
				page_obj = document.getElementById(_udeaTags[i]);

				if(page_obj != null){
					new_page = page_obj.src;
					break;
				}
			}
		}catch(err){ }

		try{ old_page = getCookie(cookielast) }
		catch(err){ old_page = "" }

		if(new_page != old_page){
			resetParams(new_page, "0");
			window.setTimeout("detectPages();", stepTime*second);
		}else{
			cnt_page = parseInt(getCookie(cookiecnt))+1;

			if(cnt_page == tries){
				setCookie(cookiecnt, cnt_page , false, "/", ".udea.edu.co");
				window.setTimeout("detectPages();", outTime*second);
				warningOutUdeA();
			}else if(cnt_page < tries){
				setCookie(cookiecnt, cnt_page , false, "/", ".udea.edu.co");
				window.setTimeout("detectPages();", stepTime*second);
			}else{
				doGetOutUdeA();
			}
		}
	}
}

function startGetOut(out){
	resetParams("", "0");
	detectPages();
}

function openUrlUdeA(url){
    if(!document.getElementById)return;
    var el = document.getElementById("cont");
    if(el && el.src)el.src = url;
}

document.domain = "udea.edu.co";
//startGetOut();