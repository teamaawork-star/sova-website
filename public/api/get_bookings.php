<?php
header('Content-Type: application/json');
require 'db.php';
require 'admin_auth.php';

$stmt = $pdo->query('SELECT * FROM bookings ORDER BY createdAt DESC');
echo json_encode($stmt->fetchAll());
?>