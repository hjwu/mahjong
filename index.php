<?php
require 'openid.php';
try {
    $openid = new LightOpenID;
    
    if(!$openid->mode) {
        $openid->identity = 'https://www.google.com/accounts/o8/id';
        header('Location: ' . $openid->authUrl());
    }elseif($openid->mode == 'cancel') {
        echo 'User has canceled authentication!';
        header('Location: ' . $openid->authUrl());
    } else {
        //echo 'User ' . ($openid->validate() ? $openid->identity . ' has ' : 'has not ') . 'logged in.';
	if($openid->validate()){
	    //echo 'Realm:'.$openid->realm.'Rurl'.$openid->returnUrl;
	    if(preg_match('/Chrome/i',$_SERVER['HTTP_USER_AGENT'])) { 
		//echo "chrome";
		include('index.inc');
	    }else{
		//echo "not chrome";
		$CWS="https://chrome.google.com/extensions/detail/caamblncpdokmacccgkbgngcgfahkjhe";
		header('Location: ' . $CWS);
	    }
	}
    }
} catch(ErrorException $e) {
    echo $e->getMessage();
}
?>
