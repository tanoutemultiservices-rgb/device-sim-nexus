<?php
require_once 'config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// GET all users or single user
if ($method === 'GET') {
    $user_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($user_id) {
        $query = "SELECT * FROM USER WHERE ID = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $user_id);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "User not found"]);
        }
    } else {
        $query = "SELECT * FROM USER ORDER BY USERNAME";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    }
}

// POST - Create new user
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->ID) && !empty($data->USERNAME)) {
        $query = "INSERT INTO USER (ID, USERNAME, NOM, PRENOM, TEL, VILLE, ADRESSE, STATUS, 
                  BALANCE, FIDILIO, DEVICE, EMAIL, PASSWORD) 
                  VALUES (:id, :username, :nom, :prenom, :tel, :ville, :adresse, :status, 
                  :balance, :fidilio, :device, :email, :password)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->ID);
        $stmt->bindParam(":username", $data->USERNAME);
        $stmt->bindParam(":nom", $data->NOM);
        $stmt->bindParam(":prenom", $data->PRENOM);
        $stmt->bindParam(":tel", $data->TEL);
        $stmt->bindParam(":ville", $data->VILLE);
        $stmt->bindParam(":adresse", $data->ADRESSE);
        $stmt->bindParam(":status", $data->STATUS);
        $stmt->bindParam(":balance", $data->BALANCE);
        $stmt->bindParam(":fidilio", $data->FIDILIO);
        $stmt->bindParam(":device", $data->DEVICE);
        $stmt->bindParam(":email", $data->EMAIL);
        $stmt->bindParam(":password", $data->PASSWORD);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "User created successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create user"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create user. Data is incomplete"]);
    }
}

// PUT - Update user
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->ID)) {
        $query = "UPDATE USER 
                  SET USERNAME = :username, NOM = :nom, PRENOM = :prenom, TEL = :tel,
                      VILLE = :ville, ADRESSE = :adresse, STATUS = :status, BALANCE = :balance,
                      FIDILIO = :fidilio, DEVICE = :device, EMAIL = :email, PASSWORD = :password
                  WHERE ID = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->ID);
        $stmt->bindParam(":username", $data->USERNAME);
        $stmt->bindParam(":nom", $data->NOM);
        $stmt->bindParam(":prenom", $data->PRENOM);
        $stmt->bindParam(":tel", $data->TEL);
        $stmt->bindParam(":ville", $data->VILLE);
        $stmt->bindParam(":adresse", $data->ADRESSE);
        $stmt->bindParam(":status", $data->STATUS);
        $stmt->bindParam(":balance", $data->BALANCE);
        $stmt->bindParam(":fidilio", $data->FIDILIO);
        $stmt->bindParam(":device", $data->DEVICE);
        $stmt->bindParam(":email", $data->EMAIL);
        $stmt->bindParam(":password", $data->PASSWORD);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update user"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update user. Data is incomplete"]);
    }
}

// DELETE - Delete user
else if ($method === 'DELETE') {
    $user_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($user_id) {
        $query = "DELETE FROM USER WHERE ID = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $user_id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "User deleted successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete user"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to delete user. ID is required"]);
    }
}
?>
