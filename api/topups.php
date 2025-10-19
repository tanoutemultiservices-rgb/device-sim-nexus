<?php
require_once 'config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// GET all topups or single topup
if ($method === 'GET') {
    $topup_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($topup_id) {
        $query = "SELECT * FROM TOPUP WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $topup_id);
        $stmt->execute();
        $topup = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($topup) {
            $result = [
                'id' => (int)$topup['id'],
                'dateOperation' => (int)$topup['date_operation'],
                'operator' => $topup['operator'],
                'montant' => (float)$topup['montant'],
                'phoneNumber' => $topup['phone_number'],
                'status' => $topup['status'],
                'user' => $topup['user'],
                'newBalance' => (float)$topup['new_balance'],
                'msgResponse' => $topup['msg_response']
            ];
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Top-up not found"]);
        }
    } else {
        $query = "SELECT * FROM TOPUP ORDER BY date_operation DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $topups = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = array_map(function($topup) {
            return [
                'id' => (int)$topup['id'],
                'dateOperation' => (int)$topup['date_operation'],
                'operator' => $topup['operator'],
                'montant' => (float)$topup['montant'],
                'phoneNumber' => $topup['phone_number'],
                'status' => $topup['status'],
                'user' => $topup['user'],
                'newBalance' => (float)$topup['new_balance'],
                'msgResponse' => $topup['msg_response']
            ];
        }, $topups);
        
        echo json_encode($result);
    }
}

// POST - Create new topup
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->operator) && !empty($data->phoneNumber) && !empty($data->user)) {
        $query = "INSERT INTO TOPUP (date_operation, operator, montant, phone_number, status, user, new_balance, msg_response) 
                  VALUES (:date_operation, :operator, :montant, :phone_number, :status, :user, :new_balance, :msg_response)";
        
        $stmt = $db->prepare($query);
        $dateOp = $data->dateOperation ?? time() * 1000;
        $stmt->bindParam(":date_operation", $dateOp);
        $stmt->bindParam(":operator", $data->operator);
        $stmt->bindParam(":montant", $data->montant);
        $stmt->bindParam(":phone_number", $data->phoneNumber);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":user", $data->user);
        $newBal = $data->newBalance ?? 0;
        $stmt->bindParam(":new_balance", $newBal);
        $msgResp = $data->msgResponse ?? "";
        $stmt->bindParam(":msg_response", $msgResp);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Top-up created successfully", "id" => $db->lastInsertId()]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create top-up"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create top-up. Data is incomplete"]);
    }
}

// PUT - Update topup
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $query = "UPDATE TOPUP 
                  SET operator = :operator, montant = :montant, phone_number = :phone_number,
                      status = :status, new_balance = :new_balance, msg_response = :msg_response
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id);
        $stmt->bindParam(":operator", $data->operator);
        $stmt->bindParam(":montant", $data->montant);
        $stmt->bindParam(":phone_number", $data->phoneNumber);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":new_balance", $data->newBalance);
        $stmt->bindParam(":msg_response", $data->msgResponse);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Top-up updated successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update top-up"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update top-up. Data is incomplete"]);
    }
}

// DELETE - Delete topup
else if ($method === 'DELETE') {
    $topup_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($topup_id) {
        $query = "DELETE FROM TOPUP WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $topup_id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Top-up deleted successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete top-up"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to delete top-up. ID is required"]);
    }
}
?>