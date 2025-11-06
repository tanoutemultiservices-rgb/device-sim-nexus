<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            $query = "SELECT * FROM CONFIG ORDER BY SERVICE";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $configs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($configs);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($data['ID']) || !isset($data['STATUS'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID and STATUS are required"]);
                exit();
            }
            
            $query = "UPDATE CONFIG SET STATUS = :status WHERE ID = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':status', $data['STATUS']);
            $stmt->bindParam(':id', $data['ID']);
            
            if($stmt->execute()) {
                echo json_encode(["message" => "Config updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update config"]);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database error",
        "message" => $e->getMessage()
    ]);
}
?>
