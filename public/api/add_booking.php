<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['name']) && !empty($data['phone'])) {
    $stmt = $pdo->prepare('INSERT INTO bookings (name, phone, service, date, time, endTime, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $data['name'], 
        $data['phone'], 
        $data['service'], 
        $data['date'], 
        $data['time'], 
        $data['endTime'], 
        $data['status'], 
        $data['createdAt']
    ]);
    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Empty fields']);
}
?>