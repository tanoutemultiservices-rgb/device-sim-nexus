<?php
require_once 'config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo json_encode([
        "success" => true,
        "message" => "Database connection successful!",
        "database" => "u841301992_app"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to connect to database"
    ]);
}
?>
