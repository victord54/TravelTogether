<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");

if ($_GET["request"] == "login") {
    require_once('controllers/login.php');
} else if ($_GET["request"] == "signin") {
    require_once('controllers/signin.php');
} else if ($_GET["request"] == "create_group") {
    require_once('controllers/create_group.php');
} else if ($_GET["request"] == "create_offer") {
    require_once('controllers/create_offer.php');
} else if ($_GET["request"] == "save_profile") {
    require_once('controllers/save_profile.php');
}
