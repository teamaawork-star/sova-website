<?php
header('Content-Type: application/json');
require 'db.php';
require 'admin_auth.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['id']) && !empty($data['status'])) {
    $stmt = $pdo->prepare('UPDATE bookings SET status = ? WHERE id = ?');
    $stmt->execute([$data['status'], $data['id']]);
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error']);
}
?>