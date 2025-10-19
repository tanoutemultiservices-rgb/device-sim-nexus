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
        $query = "SELECT * FROM ACTIVATION WHERE ID = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $activation_id);
        $stmt->execute();
        $activation = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($activation) {
            echo json_encode($activation);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Activation not found"]);
        }
    } else {
        $query = "SELECT * FROM ACTIVATION ORDER BY DATE_OPERATION DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $activations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($activations);
    }
}

// POST - Create new activation
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->OPERATOR) && !empty($data->PHONE_NUMBER)) {
        $query = "INSERT INTO ACTIVATION (DATE_OPERATION, OPERATOR, SERIE, PHONE_NUMBER, PUK, 
                  CODE_USSD, DATE_RESPONSE, MSG_RESPONSE, STATUS, USER, SIM_CARD, MSG_TO_RETURN) 
                  VALUES (:date_operation, :operator, :serie, :phone_number, :puk, :code_ussd, 
                  :date_response, :msg_response, :status, :user, :sim_card, :msg_to_return)";
        
        $stmt = $db->prepare($query);
        $dateOp = $data->DATE_OPERATION ?? time() * 1000;
        $stmt->bindParam(":date_operation", $dateOp);
        $stmt->bindParam(":operator", $data->OPERATOR);
        $stmt->bindParam(":serie", $data->SERIE);
        $stmt->bindParam(":phone_number", $data->PHONE_NUMBER);
        $stmt->bindParam(":puk", $data->PUK);
        $stmt->bindParam(":code_ussd", $data->CODE_USSD);
        $dateResp = $data->DATE_RESPONSE ?? 0;
        $stmt->bindParam(":date_response", $dateResp);
        $msgResp = $data->MSG_RESPONSE ?? "";
        $stmt->bindParam(":msg_response", $msgResp);
        $stmt->bindParam(":status", $data->STATUS);
        $stmt->bindParam(":user", $data->USER);
        $simCard = $data->SIM_CARD ?? 0;
        $stmt->bindParam(":sim_card", $simCard);
        $msgToReturn = $data->MSG_TO_RETURN ?? "";
        $stmt->bindParam(":msg_to_return", $msgToReturn);
        
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
    
    if (!empty($data->ID)) {
        $query = "UPDATE ACTIVATION 
                  SET OPERATOR = :operator, SERIE = :serie, PHONE_NUMBER = :phone_number, 
                      PUK = :puk, CODE_USSD = :code_ussd, STATUS = :status, 
                      DATE_RESPONSE = :date_response, MSG_RESPONSE = :msg_response,
                      USER = :user, SIM_CARD = :sim_card, MSG_TO_RETURN = :msg_to_return
                  WHERE ID = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->ID);
        $stmt->bindParam(":operator", $data->OPERATOR);
        $stmt->bindParam(":serie", $data->SERIE);
        $stmt->bindParam(":phone_number", $data->PHONE_NUMBER);
        $stmt->bindParam(":puk", $data->PUK);
        $stmt->bindParam(":code_ussd", $data->CODE_USSD);
        $stmt->bindParam(":status", $data->STATUS);
        $stmt->bindParam(":date_response", $data->DATE_RESPONSE);
        $stmt->bindParam(":msg_response", $data->MSG_RESPONSE);
        $stmt->bindParam(":user", $data->USER);
        $stmt->bindParam(":sim_card", $data->SIM_CARD);
        $stmt->bindParam(":msg_to_return", $data->MSG_TO_RETURN);
        
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
        $query = "DELETE FROM ACTIVATION WHERE ID = :id";
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
