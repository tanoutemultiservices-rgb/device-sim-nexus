<?php
require_once 'config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    // Get list of all tables in the database
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode([
        "success" => true,
        "message" => "Database connection successful!",
        "database" => "u841301992_app",
        "tables_found" => $tables,
        "expected_tables" => ["devices", "sim_cards", "users", "activations", "topups"]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to connect to database"
    ]);
}
?>
