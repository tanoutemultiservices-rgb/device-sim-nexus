<?php
require_once 'config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// GET all activations or single activation
if ($method === 'GET') {
    $activation_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($activation_id) {
        $query = "SELECT * FROM ACTIVATION WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $activation_id);
        $stmt->execute();
        $activation = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($activation) {
            $result = [
                'id' => (int)$activation['id'],
                'dateOperation' => (int)$activation['date_operation'],
                'operator' => $activation['operator'],
                'phoneNumber' => $activation['phone_number'],
                'ussdCode' => $activation['ussd_code'],
                'status' => $activation['status'],
                'user' => $activation['user'],
                'dateResponse' => (int)$activation['date_response'],
                'msgResponse' => $activation['msg_response']
            ];
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Activation not found"]);
        }
    } else {
        $query = "SELECT * FROM ACTIVATION ORDER BY date_operation DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $activations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = array_map(function($activation) {
            return [
                'id' => (int)$activation['id'],
                'dateOperation' => (int)$activation['date_operation'],
                'operator' => $activation['operator'],
                'phoneNumber' => $activation['phone_number'],
                'ussdCode' => $activation['ussd_code'],
                'status' => $activation['status'],
                'user' => $activation['user'],
                'dateResponse' => (int)$activation['date_response'],
                'msgResponse' => $activation['msg_response']
            ];
        }, $activations);
        
        echo json_encode($result);
    }
}

// POST - Create new activation
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->operator) && !empty($data->phoneNumber) && !empty($data->user)) {
        $query = "INSERT INTO ACTIVATION (date_operation, operator, phone_number, ussd_code, status, user, date_response, msg_response) 
                  VALUES (:date_operation, :operator, :phone_number, :ussd_code, :status, :user, :date_response, :msg_response)";
        
        $stmt = $db->prepare($query);
        $dateOp = $data->dateOperation ?? time() * 1000;
        $stmt->bindParam(":date_operation", $dateOp);
        $stmt->bindParam(":operator", $data->operator);
        $stmt->bindParam(":phone_number", $data->phoneNumber);
        $stmt->bindParam(":ussd_code", $data->ussdCode);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":user", $data->user);
        $dateResp = $data->dateResponse ?? 0;
        $stmt->bindParam(":date_response", $dateResp);
        $msgResp = $data->msgResponse ?? "";
        $stmt->bindParam(":msg_response", $msgResp);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Activation created successfully", "id" => $db->lastInsertId()]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create activation"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create activation. Data is incomplete"]);
    }
}

// PUT - Update activation
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $query = "UPDATE ACTIVATION 
                  SET operator = :operator, phone_number = :phone_number, ussd_code = :ussd_code,
                      status = :status, date_response = :date_response, msg_response = :msg_response
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id);
        $stmt->bindParam(":operator", $data->operator);
        $stmt->bindParam(":phone_number", $data->phoneNumber);
        $stmt->bindParam(":ussd_code", $data->ussdCode);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":date_response", $data->dateResponse);
        $stmt->bindParam(":msg_response", $data->msgResponse);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Activation updated successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update activation"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update activation. Data is incomplete"]);
    }
}

// DELETE - Delete activation
else if ($method === 'DELETE') {
    $activation_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($activation_id) {
        $query = "DELETE FROM ACTIVATION WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $activation_id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Activation deleted successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete activation"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to delete activation. ID is required"]);
    }
}
?>