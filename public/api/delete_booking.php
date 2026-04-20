<?php
header('Content-Type: application/json');
require 'db.php';
require 'admin_auth.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['id'])) {
    $stmt = $pdo->prepare('DELETE FROM bookings WHERE id = ?');
    $stmt->execute([$data['id']]);
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error']);
}
?>