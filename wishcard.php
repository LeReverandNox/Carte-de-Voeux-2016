<?php
function getMessage()
{

    $message = file_get_contents("include/message.txt");
    $message = str_replace("\n", "<br />", $message);
    return $message;

}

echo getMessage();