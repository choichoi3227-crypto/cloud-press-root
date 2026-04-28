<?php
class D1_DB extends wpdb {
    public function query($query) {
        // MySQL 문법을 SQLite로 치환
        $sql = str_replace('`', '"', $query);
        $sql = str_ireplace('AUTO_INCREMENT', 'AUTOINCREMENT', $sql);
        // JS 호스트 함수를 통해 D1 실행
        return d1_execute_query($sql);
    }
}
$wpdb = new D1_DB();
