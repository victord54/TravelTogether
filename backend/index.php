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

} else if ($_GET["request"] == "friends_group") {
    require_once('controllers/friends_group.php');

} else if ($_GET["request"] == "delete_group") {
    require_once('controllers/delete_group.php');

} else if ($_GET["request"] == "modif_group") {
    require_once('controllers/modif_group.php');

} else if ($_GET["request"] == "addmember_group") {
    require_once('controllers/addmember_group.php');

} else if ($_GET["request"] == "deletemember_group") {
    require_once('controllers/deletemember_group.php');

} else if ($_GET["request"] == "offer") {
    require_once('controllers/offer.php');

} else if ($_GET["request"] == "search_offer") {
    require_once('controllers/search_offer.php');

} else if ($_GET["request"] == "notifications") {
    require_once('controllers/notifications.php');

} else if ($_GET["request"] == "reply") {
    require_once("controllers/reply.php");

} else if ($_GET["request"] == "check_notifications") {
    require_once("controllers/check_notifications.php");

} else if ($_GET["request"] == "modify_offer") {
    require_once("controllers/modify_offer.php");

} else if ($_GET["request"] == "delete_offer") {
    require_once("controllers/delete_offer.php");

} else if ($_GET["request"] == "grade_participants") {
    require_once("controllers/grade_participants.php");
    
} else if ($_GET["request"] == "rate_user") {
    require_once("controllers/rate_user.php");
}
