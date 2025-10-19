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
        $query = "SELECT * FROM TOPUP WHERE ID = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $topup_id);
        $stmt->execute();
        $topup = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($topup) {
            echo json_encode($topup);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Top-up not found"]);
        }
    } else {
        $query = "SELECT * FROM TOPUP ORDER BY DATE_OPERATION DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $topups = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($topups);
    }
}

// POST - Create new topup
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->OPERATOR) && !empty($data->PHONE_NUMBER)) {
        $query = "INSERT INTO TOPUP (DATE_OPERATION, OPERATOR, MONTANT, PHONE_NUMBER, OFFRE, 
                  CODE_USSD, DATE_RESPONSE, MSG_RESPONSE, STATUS, USER, SIM_CARD, MSG_TO_RETURN, NEW_BALANCE) 
                  VALUES (:date_operation, :operator, :montant, :phone_number, :offre, :code_ussd, 
                  :date_response, :msg_response, :status, :user, :sim_card, :msg_to_return, :new_balance)";
        
        $stmt = $db->prepare($query);
        $dateOp = $data->DATE_OPERATION ?? time() * 1000;
        $stmt->bindParam(":date_operation", $dateOp);
        $stmt->bindParam(":operator", $data->OPERATOR);
        $stmt->bindParam(":montant", $data->MONTANT);
        $stmt->bindParam(":phone_number", $data->PHONE_NUMBER);
        $offre = $data->OFFRE ?? "";
        $stmt->bindParam(":offre", $offre);
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
        $newBal = $data->NEW_BALANCE ?? 0;
        $stmt->bindParam(":new_balance", $newBal);
        
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
    
    if (!empty($data->ID)) {
        $query = "UPDATE TOPUP 
                  SET OPERATOR = :operator, MONTANT = :montant, PHONE_NUMBER = :phone_number,
                      OFFRE = :offre, CODE_USSD = :code_ussd, STATUS = :status, 
                      DATE_RESPONSE = :date_response, MSG_RESPONSE = :msg_response,
                      USER = :user, SIM_CARD = :sim_card, MSG_TO_RETURN = :msg_to_return,
                      NEW_BALANCE = :new_balance
                  WHERE ID = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->ID);
        $stmt->bindParam(":operator", $data->OPERATOR);
        $stmt->bindParam(":montant", $data->MONTANT);
        $stmt->bindParam(":phone_number", $data->PHONE_NUMBER);
        $stmt->bindParam(":offre", $data->OFFRE);
        $stmt->bindParam(":code_ussd", $data->CODE_USSD);
        $stmt->bindParam(":status", $data->STATUS);
        $stmt->bindParam(":date_response", $data->DATE_RESPONSE);
        $stmt->bindParam(":msg_response", $data->MSG_RESPONSE);
        $stmt->bindParam(":user", $data->USER);
        $stmt->bindParam(":sim_card", $data->SIM_CARD);
        $stmt->bindParam(":msg_to_return", $data->MSG_TO_RETURN);
        $stmt->bindParam(":new_balance", $data->NEW_BALANCE);
        
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
        $query = "DELETE FROM TOPUP WHERE ID = :id";
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
