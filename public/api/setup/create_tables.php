<?php
require_once '../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class DatabaseSetup {
    private $conn;
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function setupDatabase() {
        try {
            // ایجاد دیتابیس
            if (!$this->db->createDatabase()) {
                throw new Exception("خطا در ایجاد دیتابیس");
            }

            // اتصال به دیتابیس
            $this->conn = $this->db->getConnection();
            if (!$this->conn) {
                throw new Exception("خطا در اتصال به دیتابیس");
            }

            // ایجاد جداول
            $this->createTables();
            
            return [
                'success' => true,
                'message' => 'دیتابیس و جداول با موفقیت ایجاد شدند'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'خطا: ' . $e->getMessage()
            ];
        }
    }

    private function createTables() {
        // جدول معیارها
        $criteria_table = "
            CREATE TABLE IF NOT EXISTS criteria (
                id INT AUTO_INCREMENT PRIMARY KEY,
                criteria_code VARCHAR(50) NOT NULL UNIQUE,
                criteria_title VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        // جدول زیرمعیارها
        $sub_criteria_table = "
            CREATE TABLE IF NOT EXISTS sub_criteria (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sub_criteria_code VARCHAR(50) NOT NULL UNIQUE,
                criteria_id INT,
                sub_criteria_title VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (criteria_id) REFERENCES criteria(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        // جدول رویکردها
        $approaches_table = "
            CREATE TABLE IF NOT EXISTS approaches (
                id INT AUTO_INCREMENT PRIMARY KEY,
                approach_code VARCHAR(50) NOT NULL UNIQUE,
                approach_title VARCHAR(1000) NOT NULL,
                approach_description TEXT,
                evaluation TEXT,
                criteria_id INT,
                sub_criteria_id INT,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (criteria_id) REFERENCES criteria(id) ON DELETE CASCADE,
                FOREIGN KEY (sub_criteria_id) REFERENCES sub_criteria(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        // جدول شاخص‌های مرتبط
        $related_indexes_table = "
            CREATE TABLE IF NOT EXISTS related_indexes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                approach_id INT,
                index_code VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (approach_id) REFERENCES approaches(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        // جدول مستندات
        $documents_table = "
            CREATE TABLE IF NOT EXISTS documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                approach_id INT,
                document_name VARCHAR(255) NOT NULL,
                document_path VARCHAR(500) NOT NULL,
                document_type VARCHAR(50),
                file_size INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (approach_id) REFERENCES approaches(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        // اجرای کوئری‌ها
        $tables = [
            $criteria_table,
            $sub_criteria_table,
            $approaches_table,
            $related_indexes_table,
            $documents_table
        ];

        foreach ($tables as $table_sql) {
            $this->conn->exec($table_sql);
        }
    }
}

// اجرای setup
$setup = new DatabaseSetup();
$result = $setup->setupDatabase();
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
