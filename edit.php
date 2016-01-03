<?php

session_start();
$msg_file = "include/message.txt";

if (isset($_POST["edit_message"]) && !empty($_POST["message"]))
{
    $msg = htmlspecialchars($_POST["message"]);
    file_put_contents($msg_file, $msg);
}

if (isset($_POST["login"]))
{
    if (!empty($_POST["password"]) && $_POST["password"] === "banane")
    {
        $_SESSION["logged"] = true;
    }
}

if (isset($_SESSION["logged"]))
{
    $message = file_get_contents($msg_file);
}

if (isset($_GET["action"]) && $_GET["action"] === "deco")
{
    unset($_SESSION["logged"]);
    session_destroy();
    header("Location: edit.php");
    return true;
}


require_once("views/edit.html");
