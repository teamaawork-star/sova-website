<?php
// Придумайте любой набор символов (это ваш секретный пропуск)
$secret_token = 'Sova_Top_Secret_Token_2026'; 

// Ищем пропуск в заголовках запроса
$token = isset($_SERVER['HTTP_X_AUTH_TOKEN']) ? $_SERVER['HTTP_X_AUTH_TOKEN'] : '';

// Если пропуска нет или он неверный — выгоняем
if ($token !== $secret_token) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Доступ закрыт!']);
    exit; // Важно: полностью останавливаем выполнение скрипта
}
?>