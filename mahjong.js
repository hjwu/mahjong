var MJLength = 16, maxKan = (MJLength-1)/3; 
var mahjong = new Array(34), mjIndex = new Array(34), pickMJIndex = new Array(34); 
var eye = new Array(34), eyeIndex = new Array(34);
var pong = new Array(34), pongIndex = new Array(34);
var chow = new Array(21), chowIndex = new Array(21);
var life = null, maxLife = 3, timeValue = null, maxTime = 180;
var wrong = null, right = null, score = null, combo = null; 
var timer = null, mode = null, currentStorage = null;
var delayTime = 700;

var readyHand = new Array(MJLength);
var winHand = new Array(MJLength+1);
var tmpHand = new Array(MJLength+1);

var haveKan = null;
var waitingMJ = new Array();

function initAllMJ(){
	for (var i=0; i<34; i++) { 
		if (i>=0 && i<9 ) mahjong[i] = i+1; 
		else if (i>=9 && i<18) mahjong[i] = i+2;
		else if (i>=18 && i<27) mahjong[i] = i+83;
		else mahjong[i] = (i-26)*1000;
		
		eye[i] = mahjong[i].toString() + "," + mahjong[i].toString(); 		
		pong[i] = eye[i].toString() + "," + mahjong[i].toString(); 
	}

	for (var i=0; i<21; i++) {
		var j = Math.floor(i/7);
		chow[i] = mahjong[i+2*j].toString() + "," + mahjong[i+2*j+1].toString() + "," + mahjong[i+2*j+2].toString();
	}
	document.getElementById("aHome").style.border = "3px rgba(0,0,0,0) solid";
	document.getElementById("aHome").setAttribute("onmouseover", "mouseOver()");

}

function init(modeIndex){	
	mode = modeIndex;
	document.getElementById("mode").style.display = "none";
	document.getElementById("mahjong").style.display = "block";
	if (typeof window.localStorage["mjTiles"] == "undefined") window.localStorage["mjTiles"] = 16; 	
	MJLength = parseInt(window.localStorage["mjTiles"]);
	maxKan = (MJLength-1)/3; 	
	if (typeof window.localStorage["themeIndex"] == "undefined") window.localStorage["themeIndex"] = 0; 
	currentColor = lifeColor[window.localStorage["themeIndex"]];	
	document.getElementById("mahjong").style.background = "url('icon/bg" + window.localStorage["themeIndex"] + ".jpg')";
	score = 0; 
	combo = -1;
	generateReadyHands(); //產生手牌
	initAns(); //選項重組
	waitingMJ.length = 0;
	getWaiting(); //找出聽的牌
	setInterval(fireCombo, 100); //顯示 combo	
	document.getElementById("score").innerHTML = 0;
	if (mode == 0){		
		if (typeof window.localStorage["lifeMJ"+window.localStorage["mjTiles"]] == "undefined") window.localStorage["lifeMJ"+window.localStorage["mjTiles"]] = "0";
		currentStorage = window.localStorage["lifeMJ"+window.localStorage["mjTiles"]];
		life = maxLife;
		initLife(life, maxLife);
		document.getElementById("answerZone").style.display = "none";
		document.getElementById("aEnter").style.display = "block";
		document.getElementById("aEnter").setAttribute("onmouseover", "mouseOver()");
		document.getElementById("aEnter").style.border = "3px rgba(0,0,0,0) solid";
	}
	else if (mode == 1){
		if (typeof window.localStorage["timeMJ"+window.localStorage["mjTiles"]] == "undefined") window.localStorage["timeMJ"+window.localStorage["mjTiles"]] = "0";	
		currentStorage = window.localStorage["timeMJ"+window.localStorage["mjTiles"]];
		timeValue = maxTime;
		initLife(timeValue, maxTime);
		if (typeof timer == "number") clearInterval(timer);
		timer = setInterval(timeCntDown,1000);
		document.getElementById("answerZone").style.display = "block";		
		document.getElementById("aEnter").style.display = "none";
		document.getElementById("aPass").style.border = "3px rgba(0,0,0,0) solid";
	}
	document.getElementById("best").innerHTML = currentStorage;
}

function generateReadyHands(){
	for (var i=0; i<34; i++) {
		eyeIndex[i] = i; pongIndex[i] = i; mjIndex[i] = 0; 
		if (i<21) chowIndex[i] = i;
	}
	var myChow = 0, myPong = 0, myEye = 0;
	var maxChow = Math.floor(maxKan*(Math.random()));
	var maxPong = maxKan-maxChow;

	var randMJ = null, tmpMJ = null; 
	while (myChow<maxChow) { 	
		randMJ = Math.floor(chowIndex.length*(Math.random()));
		tmpMJ = chow[chowIndex[randMJ]].split(",");
		tmpMJ[0] = parseInt(tmpMJ[0],10); 
		
		for (var i=0; i<34; i++) {
			if (mahjong[i] == tmpMJ[0] && mjIndex[i] < 4 && mjIndex[i+1] < 4 && mjIndex[i+2] < 4){
				for (var j=0; j<3; j++) { mjIndex[i+j]++; readyHand[3*myChow+j] = mahjong[i+j]; }
				myChow++; break; 
			}}
		
		chowIndex.splice(randMJ,1);}
		
	while (myPong<maxPong) { 	
		randMJ = Math.floor(pongIndex.length*(Math.random()));
		tmpMJ = pong[pongIndex[randMJ]].split(",");		
		tmpMJ[0] = parseInt(tmpMJ[0],10);
		
		for (var i=0; i<34; i++) {
			if (mahjong[i] == tmpMJ[0] && mjIndex[i] < 2) { 
				mjIndex[i] = mjIndex[i]+3; 
				for (var j=0; j<3; j++) readyHand[3*(maxChow+myPong)+j] = mahjong[i]; 
				myPong++; break;
			}}
		pongIndex.splice(randMJ,1);}
		
	while (myEye<1) { 
		randMJ = Math.floor(eyeIndex.length*(Math.random()));
		tmpMJ = eye[eyeIndex[randMJ]].split(",");		
		tmpMJ[0] = parseInt(tmpMJ[0],10);
		for (var i=0; i<34; i++) { 
			if (mahjong[i] == tmpMJ[0] && mjIndex[i] < 3) { 
				mjIndex[i] = mjIndex[i]+2; 
				for (var j=0; j<2; j++) readyHand[3*maxKan+j] = mahjong[i];
				myEye++;
				break; 
			}}
		eyeIndex.splice(randMJ,1);}
	
	readyHand.sort(function(a,b){return a-b;});
	var randMJ = Math.floor(readyHand.length*(Math.random()));
	for (var i=0; i<34; i++) if (mahjong[i] == readyHand[randMJ]) {mjIndex[i]--;  break;}	
	readyHand.splice(randMJ,1);
	for (var i=0; i<MJLength; i++){
		document.getElementById("q" + i.toString()).setAttribute("src", "icon/MJ" + readyHand[i].toString() + ".png");
		document.getElementById("q" + i.toString()).setAttribute("class", "mahjong");
	}
}

function initAns(){	
	right = 0; wrong = 0; 
	for (var i=0; i<34; i++) {	
		pickMJIndex[i] = false;
		var tmp = mahjong[i].toString();
		var tmpSlect = document.getElementById("a" + tmp);

		tmpSlect.setAttribute("src", "icon/MJ" + tmp + ".png");
		if (mode == 0) {
			tmpSlect.setAttribute("onclick", "selectAnswer(" + tmp + ")");
			document.getElementById("aEnter").setAttribute("onclick", "selectAnswer(-1)");
		}
		else if (mode == 1) tmpSlect.setAttribute("onclick", "checkAnswer(" + tmp + ")");
		tmpSlect.setAttribute("onmouseover", "mouseOver()");
		tmpSlect.style.border = "3px rgba(0,0,0,0) solid";
	}
}

function rV2I(value){ //reverse value to index
	if (value < 10) return (value-1);
	else if (value > 10 && value < 100) return (value-2);
	else if (value > 100 && value < 1000) return (value-83);
	else return (value/1000 + 26);
}

function selectAnswer(value){ 
	if(value > 0) {
		var index = rV2I(value);
		if (pickMJIndex[index]) document.getElementById("a" + value.toString()).style.border = "3px rgba(0,0,0,0) solid"; 
		else document.getElementById("a" + value.toString()).style.border = "3px red solid"; //未選則選取
		pickMJIndex[index] = !pickMJIndex[index];
	}
	else { //enter 送出	
		document.getElementById("aEnter").removeAttribute("onclick"); //鎖定enter
		for (var i=0; i<waitingMJ.length; i++)
			document.getElementById("a" + waitingMJ[i].toString()).style.border = "3px black solid"; //顯示答案
		
		for (var i=0; i<34; i++) {
			document.getElementById("a" + mahjong[i].toString()).removeAttribute("onclick"); //鎖定答案
			document.getElementById("a" + mahjong[i].toString()).removeAttribute("onmouseover");
			var ans = null, tmp = null;			

			if(pickMJIndex[i]) { 
				ans = false;
				for (var j=0; j<waitingMJ.length; j++) if (waitingMJ[j] == mahjong[i]) { ans = true; break; }
				if (!ans) document.getElementById("a" + mahjong[i].toString()).setAttribute("src", "icon/back.png");}
			else { ans = true; 
				for (var j=0; j<waitingMJ.length; j++) if (waitingMJ[j] == mahjong[i]) { ans = false; break; }}
			if (ans) right++;
		}
		if (right == 34) { score = score + 100; combo++; if (combo >=5 && life < maxLife) life++; initLife(life, maxLife); document.getElementById("score").innerHTML = score;	}
		else { 
			life--; combo = -1; 
			if (life < 0) { 
				window.localStorage["lifeMJ"+window.localStorage["mjTiles"]] = Math.max(currentStorage, score); 			
				document.getElementById("best").innerHTML = currentStorage;	
				var strSS = "Your Score is " + score.toString() + "<br/>Would you play this game again ?"
				$('#confirmBox > h1').html(strSS);
				$.blockUI({ message: $('#confirmBox')}); 
        		$('#yes').click(function() { $.unblockUI(); init(mode); }); 
		        $('#no').click(function() { $.unblockUI(); myHome(0); }); 
			} else initLife(life, maxLife);}			
			
		setTimeout(function(){
			for (var i=0; i<MJLength; i++) document.getElementById("q" + i.toString()).setAttribute("src", "icon/back.png");
			setTimeout(function(){generateReadyHands(); initAns(); waitingMJ.length = 0; getWaiting(); }, delayTime);						
		}, delayTime);
	}
}

function checkAnswer(value){ 
	if (value < 0) right = waitingMJ.length;		
	else {		
		var ans = false; 
		var tmp = document.getElementById("a" + value.toString());
		tmp.removeAttribute("onclick"); 
		tmp.removeAttribute("onmouseover");
		for (var i=0; i<waitingMJ.length; i++) if (value == waitingMJ[i]) { 
			tmp.style.border = "3px black solid"; ans = true; break; }
		if (ans) right++;
		else { wrong++;	score = Math.max(score-50, 0); document.getElementById("score").innerHTML = score;
			timeValue = timeValue-20; combo = -1; tmp.setAttribute("src", "icon/back.png"); 
		}}

	if (right == waitingMJ.length) {		
		if (value < 0) { score = score+100; combo = -1; }
		else {
			if (combo >= 5 && value > 0) score = score+300;
			else score = score+100;			    
			if(wrong == 0) combo++; }	
		document.getElementById("score").innerHTML = score;	
		for (var i=0; i<34; i++) document.getElementById("a" + mahjong[i].toString()).removeAttribute("onclick"); 
		setTimeout(function(){
			for (var i=0; i<MJLength; i++) 
				document.getElementById("q" + i.toString()).setAttribute("src", "icon/back.png");	
				setTimeout(function(){generateReadyHands(); initAns(); waitingMJ.length = 0; getWaiting(); }, delayTime);
		}, delayTime);
	}
}

function getWaiting(){
	for (var i=0; i<34; i++){ 
		if (mjIndex[i]<4){			
			var hu = null;

			for (var j=0; j<MJLength; j++) winHand[j] = readyHand[j]; 
			winHand[MJLength] = mahjong[i]; 
			winHand.sort(function(a,b){ return a - b; });
			for (var j=0; j<=MJLength; j++) tmpHand[j] = winHand[j];
			
			var startJang = 0;
			var jang = -1;
			while (startJang < MJLength && hu != true){
			  for (var j=0; j<=MJLength; j++) if (tmpHand[j] == -1) tmpHand[j] = winHand[j];
			  if (tmpHand[startJang] == tmpHand[startJang+1] && tmpHand[startJang] > jang) {
	  		  	jang = tmpHand[startJang];
	  		  	tmpHand[startJang] = -1;
	  		  	tmpHand[startJang+1] = -1
			  	startJang = startJang+2;
			  	var startKan = 0, kanCnt = 0;
			  	for (var j = startKan; j<=MJLength; j++){
					if (tmpHand[j] > -1) {
						haveKan = false;
						if (tmpHand[j] == tmpHand[j+1] && tmpHand[j] == tmpHand[j+2]) { 
							tmpHand[j] = -1; tmpHand[j+1] = -1; tmpHand[j+2] = -1; startKan = j+3; haveKan = true; kanCnt++; }
						else {
							for (var k = j+1; k<=MJLength; k++){ 
								if (haveKan) break;
								if (tmpHand[k] == -1) continue;
								else {
									for (var l = k+1; l<=MJLength; l++){
										if (tmpHand[l] == -1) continue;
										else if (tmpHand[j] == tmpHand[k]-1 && tmpHand[k] == tmpHand[l]-1) {
											tmpHand[j] = -1; tmpHand[k] = -1; tmpHand[l] = -1; kanCnt++;
											if (k==j+1 && l==j+2) startKan = j+3;
											else if (k==j+1 && l > j+2) startKan = j+2;
											else startKan = j+1
											haveKan = true;
											break;
										}}}}}					
						if (!haveKan) { hu =false; break; }
						if (kanCnt == maxKan) { hu = true; waitingMJ.push(mahjong[i]); } 
					}}}
			  else startJang++;
			}
		}
	}
	if (mode == 1) document.getElementById("answerZone").innerHTML = "ANSWER : " + waitingMJ.length.toString();
}
