<?php
header('Content-Type: application/json');

// Папка для картинок (поднимется на уровень выше из папки api)
$uploadDir = '../uploads/';

// Если папки нет — скрипт создаст её сам
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    
    // Генерируем уникальное имя файла, чтобы картинки не перезаписывали друг друга
    $fileName = uniqid('img_') . '.' . $ext;
    $destination = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Возвращаем React-приложению правильную ссылку на картинку
        echo json_encode(['status' => 'success', 'url' => '/uploads/' . $fileName]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка при сохранении файла']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Файл не был передан']);
}
?>