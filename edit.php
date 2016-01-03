<?php

session_start();
$msg_file = "include/message.txt";

if (isset($_POST["edit_message"]))
{
    if (!empty($_POST["message"]))
    {
        $msg = $_POST["message"];
        file_put_contents($msg_file, $msg);
        $_SESSION["INFO"] = "Le message a bien été modifié";
    }
    else
    {
        $_SESSION["ERROR"] = "Le message est trop court";
    }
}

if (isset($_POST["login"]))
{
    if (!empty($_POST["password"]) && $_POST["password"] === "banane")
    {
        $_SESSION["logged"] = true;
    }
    else
    {
        $_SESSION["ERROR"] = "Mauvais mot de passe";
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
