<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['question']) && !empty($data['answer'])) {
    $stmt = $pdo->prepare('INSERT INTO faqs (question, answer) VALUES (?, ?)');
    $stmt->execute([$data['question'], $data['answer']]);
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Empty fields']);
}
?>