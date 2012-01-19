var canvas = null;
var ctx = null;
var lifeColor = ["rgb(102,79,29)", "rgb(19,76,25)", "rgb(103,73,37)"];
var currentColor = lifeColor[0];
var timerCnt = 0;

function myHome(homeIndex){
	switch (homeIndex) {
		case -1:
			document.getElementById("modeAll").style.display = "block";
			document.getElementById("option").style.display = "none";
			document.getElementById("backModeHome").style.display = "none";		
		break;
		case 0:
			document.getElementById("mode").style.display = "block";
			document.getElementById("mahjong").style.display = "none";
			if (mode == 1) clearInterval(timer);
		break;
		case 1:
			document.getElementById("option").style.display = "block";
			document.getElementById("modeTile").style.display = "none";	
			document.getElementById("homeSave").setAttribute("src", "icon/home.png");
			document.getElementById("homeSave").setAttribute("onclick", "myHome(-1)");
		break;
		case 2:
			document.getElementById("option").style.display = "block";
			document.getElementById("modeTheme").style.display = "none";
			document.getElementById("homeSave").setAttribute("src", "icon/home.png");
			document.getElementById("homeSave").setAttribute("onclick", "myHome(-1)");			
		break;	
	}
}

function mouseOver(){ document.body.style.cursor='pointer'; }

function initLife(ang, sec){ 
	canvas = document.getElementById("modeCanvas");
	ctx = canvas.getContext("2d");		
	ctx.fillStyle = currentColor;
	ctx.beginPath();
	ctx.arc(50, 50, 50, 0, 2*Math.PI, true);
	ctx.fill();
	ctx.fillStyle = 'rgba(0,0,0,0.5)';		
	ctx.beginPath();
	if (ang < sec) ctx.arc(50, 50, 50, Math.PI*3/2, Math.PI*(3/2+2*(sec-ang)/sec), true);
	else ctx.arc(50, 50, 50, 0, 2*Math.PI, true);
	ctx.lineTo(50,50);
	ctx.fill();
	ctx.fillStyle = 'white';
	ctx.font = "30px Arial";
	if (sec == maxLife) {		
		for (var i=0; i<sec; i++){
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(50,50);
			ctx.lineTo(50+50*Math.cos(Math.PI*(1/6+2*i/sec)), 50+50*Math.sin(Math.PI*(1/6+2*i/sec)));
			ctx.stroke();
		}
		ctx.fillText("LIFE", 20, 60);
	}
	else if (sec == maxTime) ctx.fillText("TIME", 20, 60);
}

function changeTheme(themeIndex){ 
	window.localStorage["themeIndex"] = themeIndex;
	for (var i=0; i<lifeColor.length; i++) {
		if (i == themeIndex) document.getElementById("theme" + i.toString()).setAttribute("src", "icon/theme" + window.localStorage["themeIndex"] + ".jpg");
		else document.getElementById("theme" + i.toString()).setAttribute("src", "icon/grayface.png");
	}
}

function changeTiles(tileIndex){ 
	window.localStorage["mjTiles"] = tileIndex;
	document.getElementById("tile13").setAttribute("src", "icon/tiles13.png");
	document.getElementById("tile16").setAttribute("src", "icon/tiles16.png");	
	document.getElementById("tile"+window.localStorage["mjTiles"]).setAttribute("src", "icon/tiles" + window.localStorage["mjTiles"] + "Hover.png");
}

function showOption(tempa){	
	document.getElementById("backModeHome").style.display = "block";
	switch (tempa){
		case 0: 
		document.getElementById("modeAll").style.display = "none";
		document.getElementById("option").style.display = "block"; 
		document.getElementById("homeSave").setAttribute("src", "icon/home.png");
		document.getElementById("homeSave").setAttribute("onclick", "myHome(-1)");
		break;
		case 1:
		document.getElementById("option").style.display = "none"; 
		document.getElementById("modeTile").style.display = "block"; 
		if (typeof window.localStorage["mjTiles"] == "undefined") window.localStorage["mjTiles"] = 16; 	
		changeTiles(parseInt(window.localStorage["mjTiles"],10));
		document.getElementById("homeSave").setAttribute("src", "icon/save.png");
		document.getElementById("homeSave").setAttribute("onclick", "myHome(1)");		
		break;
		case 2:
		document.getElementById("option").style.display = "none"; 
		document.getElementById("modeTheme").style.display = "block"; 
		if (typeof window.localStorage["themeIndex"] == "undefined") window.localStorage["themeIndex"] = 0; 	
		changeTheme(parseInt(window.localStorage["themeIndex"],10));
		document.getElementById("homeSave").setAttribute("src", "icon/save.png");
		document.getElementById("homeSave").setAttribute("onclick", "myHome(2)");
		break;
	}	
}


function modeEffect(modeIndex, modehover){
	var tmp = null, tmpSrc = null; 
	switch (modeIndex){
		case 0:
			tmp = "lifemode";
			if (modehover == 0) tmpSrc = "icon/lifemode.png"
			else tmpSrc = "icon/lifemodeHover.png";
		break;
		case 1:
			tmp = "timemode";
			if (modehover == 0) tmpSrc = "icon/timemode.png";
			else tmpSrc = "icon/timemodeHover.png";
		break;
		case -1:
			tmp = "help";
			if (modehover == 0) tmpSrc = "icon/help.png";
			else tmpSrc = "icon/helpHover.png";
		break;
		case -2:
			tmp = "optionmode";
			if (modehover == 0) tmpSrc = "icon/option.png";
			else tmpSrc = "icon/optionHover.png";
		break;		
		case -3:
			tmp = "tiles";
			if (modehover == 0) tmpSrc = "icon/tiles.png";
			else tmpSrc = "icon/tilesHover.png";
		break;
		case -4:
			tmp = "theme";
			if (modehover == 0) tmpSrc = "icon/theme.png";
			else tmpSrc = "icon/themeHover.png";
		break;

	}
	document.getElementById(tmp).setAttribute("src", tmpSrc);
}

function timeCntDown(){
	timeValue = Math.max(--timeValue, 0);
	initLife(timeValue, maxTime);
	if (timeValue == 0) {
		clearInterval(timer);
		window.localStorage["timeMJ"+window.localStorage["mjTiles"]] = Math.max(currentStorage, score); 			
		document.getElementById("score").innerHTML = currentStorage;		
		var strSS = "Your Score is " + score.toString() + "<br/>Would you play this game again ?"
		$('#confirmBox > h1').html(strSS);
		$.blockUI({ message: $('#confirmBox')}); 
        $('#yes').click(function() { $.unblockUI(); init(mode); }); 
        $('#no').click(function() { $.unblockUI(); myHome(0); }); 
	}
}

function fireCombo(){
	if (combo<5){
		document.getElementById("combo").setAttribute("src", "icon/combo" + (Math.max(combo,0)).toString() + ".png");
		if(mode == 1) document.getElementById("aPass").style.display = "none";
	}
	else {
		document.getElementById("combo").setAttribute("src", "icon/combo5" + timerCnt.toString() + ".png"); 
		if(mode == 1) {
			document.getElementById("aPass").style.display = "block";
			document.getElementById("aPass").setAttribute("onclick", "checkAnswer(-1)");
			document.getElementById("aPass").setAttribute("onmouseover", "mouseOver()");
		}
	 	timerCnt = (timerCnt+1)%4;
	}
}
