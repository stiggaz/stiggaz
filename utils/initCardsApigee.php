<?

$list = array();
$i= 0;

for ($n= 0; $n < 640; $n++) {	
	$list[$n] = array('name' => ($n + 1));
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,"https://api.usergrid.com/crisk/sandbox/cards/");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($list));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$server_output = curl_exec ($ch);
curl_close ($ch);

echo $server_output;

exit;

