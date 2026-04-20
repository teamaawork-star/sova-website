<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// НАСТРОЙКИ
$secret_password = 'wVxVVS4k'; // Тот пароль, что вы уже придумали
$secret_token = 'Sova_Top_Secret_Token_2026'; // ТОТ ЖЕ ключ, что и в файле выше!

if (isset($data['password']) && $data['password'] === $secret_password) {
    // Пароль верный! Выдаем токен.
    echo json_encode(['status' => 'success', 'token' => $secret_token]);
} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Неверный пароль']);
}
?>