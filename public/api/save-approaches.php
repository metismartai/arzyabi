<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        $jsonFile = '../json/approaches.json';
        $jsonDir = dirname($jsonFile);
        
        // ایجاد فولدر json اگر وجود ندارد
        if (!is_dir($jsonDir)) {
            mkdir($jsonDir, 0755, true);
        }
        
        // ذخیره داده‌ها در فایل JSON
        $result = file_put_contents($jsonFile, json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        if ($result !== false) {
            echo json_encode(['success' => true, 'message' => 'تغییرات با موفقیت ذخیره شد']);
        } else {
            echo json_encode(['success' => false, 'message' => 'خطا در ذخیره‌سازی فایل']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'داده‌های نامعتبر']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'متد نامعتبر']);
}
?>

