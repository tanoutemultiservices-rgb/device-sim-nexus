<?php
require_once 'config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// GET all sim cards or single sim card
if ($method === 'GET') {
    $sim_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($sim_id) {
        $query = "SELECT * FROM sim_cards WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $sim_id);
        $stmt->execute();
        $sim = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($sim) {
            $result = [
                'id' => (int)$sim['id'],
                'operator' => $sim['operator'],
                'number' => $sim['number'],
                'todayActivations' => (int)$sim['today_activations'],
                'todayTopups' => (int)$sim['today_topups'],
                'connected' => $sim['connected'],
                'balance' => (float)$sim['balance'],
                'activationStatus' => $sim['activation_status'],
                'topupStatus' => $sim['topup_status'],
                'device' => $sim['device'],
                'lastConnect' => (int)$sim['last_connect']
            ];
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "SIM card not found"]);
        }
    } else {
        $query = "SELECT * FROM sim_cards ORDER BY last_connect DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $sims = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = array_map(function($sim) {
            return [
                'id' => (int)$sim['id'],
                'operator' => $sim['operator'],
                'number' => $sim['number'],
                'todayActivations' => (int)$sim['today_activations'],
                'todayTopups' => (int)$sim['today_topups'],
                'connected' => $sim['connected'],
                'balance' => (float)$sim['balance'],
                'activationStatus' => $sim['activation_status'],
                'topupStatus' => $sim['topup_status'],
                'device' => $sim['device'],
                'lastConnect' => (int)$sim['last_connect']
            ];
        }, $sims);
        
        echo json_encode($result);
    }
}

// POST - Create new sim card
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->operator) && !empty($data->number)) {
        $query = "INSERT INTO sim_cards (operator, number, today_activations, today_topups, connected, 
                  balance, activation_status, topup_status, device, last_connect) 
                  VALUES (:operator, :number, :today_activations, :today_topups, :connected, 
                  :balance, :activation_status, :topup_status, :device, :last_connect)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":operator", $data->operator);
        $stmt->bindParam(":number", $data->number);
        $stmt->bindParam(":today_activations", $data->todayActivations);
        $stmt->bindParam(":today_topups", $data->todayTopups);
        $stmt->bindParam(":connected", $data->connected);
        $stmt->bindParam(":balance", $data->balance);
        $stmt->bindParam(":activation_status", $data->activationStatus);
        $stmt->bindParam(":topup_status", $data->topupStatus);
        $stmt->bindParam(":device", $data->device);
        $stmt->bindParam(":last_connect", $data->lastConnect);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "SIM card created successfully", "id" => $db->lastInsertId()]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create SIM card"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create SIM card. Data is incomplete"]);
    }
}

// PUT - Update sim card
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $query = "UPDATE sim_cards 
                  SET operator = :operator, number = :number, today_activations = :today_activations,
                      today_topups = :today_topups, connected = :connected, balance = :balance,
                      activation_status = :activation_status, topup_status = :topup_status,
                      device = :device, last_connect = :last_connect
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id);
        $stmt->bindParam(":operator", $data->operator);
        $stmt->bindParam(":number", $data->number);
        $stmt->bindParam(":today_activations", $data->todayActivations);
        $stmt->bindParam(":today_topups", $data->todayTopups);
        $stmt->bindParam(":connected", $data->connected);
        $stmt->bindParam(":balance", $data->balance);
        $stmt->bindParam(":activation_status", $data->activationStatus);
        $stmt->bindParam(":topup_status", $data->topupStatus);
        $stmt->bindParam(":device", $data->device);
        $stmt->bindParam(":last_connect", $data->lastConnect);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "SIM card updated successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update SIM card"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update SIM card. Data is incomplete"]);
    }
}

// DELETE - Delete sim card
else if ($method === 'DELETE') {
    $sim_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($sim_id) {
        $query = "DELETE FROM sim_cards WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $sim_id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "SIM card deleted successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete SIM card"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to delete SIM card. ID is required"]);
    }
}
?>