<?php

	error_reporting(E_ALL);

	ini_set('display_errors','ON');

	echo phpinfo();
	
	$redis = new Redis();

	$redis->pconnect('222.73.195.214',6379);
	
	$redis->set('first_key_phpredis', 'Hello world');
	$redis->get('first_key_phpredis');

	for ($i = 1; $i <= 100; $i ++) {
		$redis->set('first_key_phpredis' . $i, 'Hello world' . $i);
		var_dump($redis->get("first_key_phpredis" . $i));
	}
	
	
	for ($i = 1; $i <= 10000; $i ++) {
		var_dump($redis->get("first_key_phpredis" . $i));
	}
	
	$redis.close();