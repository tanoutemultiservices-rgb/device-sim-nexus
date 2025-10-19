<?php
require_once 'config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// GET all devices or single device
if ($method === 'GET') {
    $device_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($device_id) {
        $query = "SELECT * FROM DEVICE WHERE ID = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $device_id);
        $stmt->execute();
        $device = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($device) {
            echo json_encode($device);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Device not found"]);
        }
    } else {
        $query = "SELECT * FROM DEVICE ORDER BY LAST_CONNECT DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($devices);
    }
}

// POST - Create new device
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->ID) && !empty($data->NOM)) {
        $query = "INSERT INTO DEVICE (ID, NOM, SYSTEM, LAST_CONNECT, LOCALIZATION, STATUS, OTP, IP, BRAND, OS, TIME) 
                  VALUES (:id, :nom, :system, :last_connect, :localization, :status, :otp, :ip, :brand, :os, :time)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->ID);
        $stmt->bindParam(":nom", $data->NOM);
        $stmt->bindParam(":system", $data->SYSTEM);
        $stmt->bindParam(":last_connect", $data->LAST_CONNECT);
        $stmt->bindParam(":localization", $data->LOCALIZATION);
        $stmt->bindParam(":status", $data->STATUS);
        $stmt->bindParam(":otp", $data->OTP);
        $stmt->bindParam(":ip", $data->IP);
        $stmt->bindParam(":brand", $data->BRAND);
        $stmt->bindParam(":os", $data->OS);
        $stmt->bindParam(":time", $data->TIME);
        
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
    
    if (!empty($data->ID)) {
        $query = "UPDATE DEVICE 
                  SET NOM = :nom, SYSTEM = :system, LAST_CONNECT = :last_connect, 
                      LOCALIZATION = :localization, STATUS = :status, OTP = :otp,
                      IP = :ip, BRAND = :brand, OS = :os, TIME = :time
                  WHERE ID = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->ID);
        $stmt->bindParam(":nom", $data->NOM);
        $stmt->bindParam(":system", $data->SYSTEM);
        $stmt->bindParam(":last_connect", $data->LAST_CONNECT);
        $stmt->bindParam(":localization", $data->LOCALIZATION);
        $stmt->bindParam(":status", $data->STATUS);
        $stmt->bindParam(":otp", $data->OTP);
        $stmt->bindParam(":ip", $data->IP);
        $stmt->bindParam(":brand", $data->BRAND);
        $stmt->bindParam(":os", $data->OS);
        $stmt->bindParam(":time", $data->TIME);
        
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
        $query = "DELETE FROM DEVICE WHERE ID = :id";
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
