<?php

return array(
	# Account credentials from developer portal
	'Account' => array(
		'ClientId' => 'AW3UVBWIbny8D-8_u7Fffi7M_l492ccSLtNNvhInDwFr5GffWVVnZgTJaXNULvxkw8YoTyQkPoqwhMDk',
		'ClientSecret' => 'EO_6_oL4Gvvmu7QAgW0mhM4E6EhO3Ih_VH8zx9LoCPLWlCY2ezKINq_H21L6L1lfaeye-LleyM9WW5W8',
	),

	# Connection Information
	'Http' => array(
		'ConnectionTimeOut' => 30,
		'Retry' => 1,
		//'Proxy' => 'http://[username:password]@hostname[:port][/path]',
	),

	# Service Configuration
	'Service' => array(
		# For integrating with the live endpoint,
		# change the URL to https://api.paypal.com!
		'EndPoint' => 'https://api.sandbox.paypal.com',
	),


	# Logging Information
	'Log' => array(
		'LogEnabled' => true,

		# When using a relative path, the log file is created
		# relative to the .php file that is the entry point
		# for this request. You can also provide an absolute
		# path here
		'FileName' => '../PayPal.log',

		# Logging level can be one of FINE, INFO, WARN or ERROR
		# Logging is most verbose in the 'FINE' level and
		# decreases as you proceed towards ERROR
		'LogLevel' => 'FINE',
	),
);
