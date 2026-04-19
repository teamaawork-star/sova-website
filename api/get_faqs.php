<?php
header('Content-Type: application/json');
require 'db.php';

$stmt = $pdo->query('SELECT * FROM faqs ORDER BY id DESC');
$faqs = $stmt->fetchAll();

echo json_encode($faqs);
?>