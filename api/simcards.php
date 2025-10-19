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
        $query = "SELECT * FROM SIM_CARD WHERE ID = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $sim_id);
        $stmt->execute();
        $sim = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($sim) {
            echo json_encode($sim);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "SIM card not found"]);
        }
    } else {
        $query = "SELECT * FROM SIM_CARD ORDER BY LAST_CONNECT DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $sims = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($sims);
    }
}

// POST - Create new sim card
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->OPERATOR)) {
        $query = "INSERT INTO SIM_CARD (OPERATOR, TODAY_NB_ACTIVATION, TODAY_NB_TOPUP, CONNECTED, 
                  BALANCE, CHARGED, ACTIVATION_STATUS, TOPUP_STATUS, DEVICE, LAST_CONNECT, TIME, 
                  PIN, NUMBER, PUK, PIN2) 
                  VALUES (:operator, :today_nb_activation, :today_nb_topup, :connected, 
                  :balance, :charged, :activation_status, :topup_status, :device, :last_connect, :time,
                  :pin, :number, :puk, :pin2)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":operator", $data->OPERATOR);
        $stmt->bindParam(":today_nb_activation", $data->TODAY_NB_ACTIVATION);
        $stmt->bindParam(":today_nb_topup", $data->TODAY_NB_TOPUP);
        $stmt->bindParam(":connected", $data->CONNECTED);
        $stmt->bindParam(":balance", $data->BALANCE);
        $stmt->bindParam(":charged", $data->CHARGED);
        $stmt->bindParam(":activation_status", $data->ACTIVATION_STATUS);
        $stmt->bindParam(":topup_status", $data->TOPUP_STATUS);
        $stmt->bindParam(":device", $data->DEVICE);
        $stmt->bindParam(":last_connect", $data->LAST_CONNECT);
        $stmt->bindParam(":time", $data->TIME);
        $stmt->bindParam(":pin", $data->PIN);
        $stmt->bindParam(":number", $data->NUMBER);
        $stmt->bindParam(":puk", $data->PUK);
        $stmt->bindParam(":pin2", $data->PIN2);
        
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
    
    if (!empty($data->ID)) {
        $query = "UPDATE SIM_CARD 
                  SET OPERATOR = :operator, TODAY_NB_ACTIVATION = :today_nb_activation,
                      TODAY_NB_TOPUP = :today_nb_topup, CONNECTED = :connected, BALANCE = :balance,
                      CHARGED = :charged, ACTIVATION_STATUS = :activation_status, 
                      TOPUP_STATUS = :topup_status, DEVICE = :device, LAST_CONNECT = :last_connect,
                      TIME = :time, PIN = :pin, NUMBER = :number, PUK = :puk, PIN2 = :pin2
                  WHERE ID = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->ID);
        $stmt->bindParam(":operator", $data->OPERATOR);
        $stmt->bindParam(":today_nb_activation", $data->TODAY_NB_ACTIVATION);
        $stmt->bindParam(":today_nb_topup", $data->TODAY_NB_TOPUP);
        $stmt->bindParam(":connected", $data->CONNECTED);
        $stmt->bindParam(":balance", $data->BALANCE);
        $stmt->bindParam(":charged", $data->CHARGED);
        $stmt->bindParam(":activation_status", $data->ACTIVATION_STATUS);
        $stmt->bindParam(":topup_status", $data->TOPUP_STATUS);
        $stmt->bindParam(":device", $data->DEVICE);
        $stmt->bindParam(":last_connect", $data->LAST_CONNECT);
        $stmt->bindParam(":time", $data->TIME);
        $stmt->bindParam(":pin", $data->PIN);
        $stmt->bindParam(":number", $data->NUMBER);
        $stmt->bindParam(":puk", $data->PUK);
        $stmt->bindParam(":pin2", $data->PIN2);
        
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
        $query = "DELETE FROM SIM_CARD WHERE ID = :id";
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
