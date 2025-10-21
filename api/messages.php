<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// GET - Retrieve all messages or a single message
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $db->prepare("SELECT * FROM messages WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $message = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($message) {
            echo json_encode($message);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Message not found"]);
        }
    } else {
        $stmt = $db->query("SELECT * FROM messages ORDER BY id DESC");
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($messages);
    }
}

// POST - Create a new message
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->SERVER_MESSAGE) && !empty($data->CUSTOMER_MESSAGE) && !empty($data->TYPE) && 
        !empty($data->OPERATOR) && !empty($data->OPERATION)) {
        
        $stmt = $db->prepare("INSERT INTO messages (SERVER_MESSAGE, CUSTOMER_MESSAGE, TYPE, OPERATOR, OPERATION) VALUES (?, ?, ?, ?, ?)");
        
        if ($stmt->execute([
            $data->SERVER_MESSAGE,
            $data->CUSTOMER_MESSAGE,
            $data->TYPE,
            $data->OPERATOR,
            $data->OPERATION
        ])) {
            http_response_code(201);
            echo json_encode(["message" => "Message created successfully", "id" => $db->lastInsertId()]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create message"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create message. Data is incomplete"]);
    }
}

// PUT - Update a message
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $fields = [];
        $values = [];
        
        if (isset($data->SERVER_MESSAGE)) { $fields[] = "SERVER_MESSAGE = ?"; $values[] = $data->SERVER_MESSAGE; }
        if (isset($data->CUSTOMER_MESSAGE)) { $fields[] = "CUSTOMER_MESSAGE = ?"; $values[] = $data->CUSTOMER_MESSAGE; }
        if (isset($data->TYPE)) { $fields[] = "TYPE = ?"; $values[] = $data->TYPE; }
        if (isset($data->OPERATOR)) { $fields[] = "OPERATOR = ?"; $values[] = $data->OPERATOR; }
        if (isset($data->OPERATION)) { $fields[] = "OPERATION = ?"; $values[] = $data->OPERATION; }
        
        if (count($fields) > 0) {
            $values[] = $data->id;
            $stmt = $db->prepare("UPDATE messages SET " . implode(", ", $fields) . " WHERE id = ?");
            
            if ($stmt->execute($values)) {
                http_response_code(200);
                echo json_encode(["message" => "Message updated successfully"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update message"]);
            }
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update message. Data is incomplete"]);
    }
}

// DELETE - Delete a message
else if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $stmt = $db->prepare("DELETE FROM messages WHERE id = ?");
        
        if ($stmt->execute([$data->id])) {
            http_response_code(200);
            echo json_encode(["message" => "Message deleted successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete message"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to delete message. ID is required"]);
    }
}
?>