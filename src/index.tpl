<!doctype html>
<html>
<head>
	<base href="../../../">
	<meta charset="utf-8">
	<title>webCaetano</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">
	<!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

	<!-- build:css(./) styles/vendor.css -->
	<link rel="stylesheet" type="text/css" href="bower_components/highlight/src/styles/monokai.css">
	<link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="bower_components/font-awesome/css/font-awesome.css">
	<!-- endbuild -->

	<!-- build:css({.tmp/site,site}) styles/styles.css -->
	<!-- inject:styles:css -->
	<!-- css files will be automatically insert here -->
	<!-- endinject -->
	<!-- endbuild -->
</head>
<body>
	<div class="all" align="center">
		<%= header %>
		<%= menu %>
		<div class="mid">
			<div class="posts">
				<%= content %>
			</div>
		</div>
		<%= footer %>
	</div>

	<script>
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-48138722-7', 'auto');
	ga('send', 'pageview');

	</script>

	<!-- build:js(./) scripts/vendor.js -->
	<script src="bower_components/highlight/src/highlight.js"></script>
	<!-- endbuild -->


	<!-- build:js({.tmp/site,site}) scripts/scripts.js -->
	<!-- inject:scripts:js -->
	<!-- js files will be automatically insert here -->
	<!-- endinject -->
	<!-- endbuild -->

	<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script> -->
</body>
</html>
