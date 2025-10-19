<?php
require_once 'config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);
$uri_parts = explode('/', trim($request_uri[0], '/'));

// GET all devices or single device
if ($method === 'GET') {
    $device_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($device_id) {
        $query = "SELECT * FROM devices WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $device_id);
        $stmt->execute();
        $device = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($device) {
            $device['lastConnect'] = (int)$device['last_connect'];
            $device['simCards'] = (int)$device['sim_cards'];
            unset($device['last_connect'], $device['sim_cards'], $device['created_at'], $device['updated_at']);
            echo json_encode($device);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Device not found"]);
        }
    } else {
        $query = "SELECT * FROM devices ORDER BY last_connect DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = array_map(function($device) {
            return [
                'id' => $device['id'],
                'name' => $device['name'],
                'brand' => $device['brand'],
                'os' => $device['os'],
                'status' => $device['status'],
                'lastConnect' => (int)$device['last_connect'],
                'ip' => $device['ip'],
                'simCards' => (int)$device['sim_cards']
            ];
        }, $devices);
        
        echo json_encode($result);
    }
}

// POST - Create new device
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id) && !empty($data->name) && !empty($data->brand)) {
        $query = "INSERT INTO devices (id, name, brand, os, status, last_connect, ip, sim_cards) 
                  VALUES (:id, :name, :brand, :os, :status, :last_connect, :ip, :sim_cards)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id);
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":brand", $data->brand);
        $stmt->bindParam(":os", $data->os);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":last_connect", $data->lastConnect);
        $stmt->bindParam(":ip", $data->ip);
        $stmt->bindParam(":sim_cards", $data->simCards);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Device created successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create device"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create device. Data is incomplete"]);
    }
}

// PUT - Update device
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $query = "UPDATE devices 
                  SET name = :name, brand = :brand, os = :os, status = :status, 
                      last_connect = :last_connect, ip = :ip, sim_cards = :sim_cards
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id);
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":brand", $data->brand);
        $stmt->bindParam(":os", $data->os);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":last_connect", $data->lastConnect);
        $stmt->bindParam(":ip", $data->ip);
        $stmt->bindParam(":sim_cards", $data->simCards);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Device updated successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update device"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update device. Data is incomplete"]);
    }
}

// DELETE - Delete device
else if ($method === 'DELETE') {
    $device_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($device_id) {
        $query = "DELETE FROM devices WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $device_id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Device deleted successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete device"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to delete device. ID is required"]);
    }
}
?>