<?php
class SupabaseStreamWrapper {
    public function stream_write($data) {
        $chunk_idx = floor($this->position / 5242880); // 5MB 단위 조각화
        return cp_write_to_supabase($chunk_idx, $data);
    }
}
stream_wrapper_register("cp-storage", "SupabaseStreamWrapper");
