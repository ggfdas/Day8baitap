import { useEffect } from "react";
import { saveJSON } from "../storage/storage";

// HOOK CHUNG: mỗi khi `value` đổi (và đã nạp xong dữ liệu cũ) → tự ghi vào AsyncStorage.
// Dùng cho cart, wishlist… — không phải viết lại effect ở từng nơi.
export function useAutoPersist<T>(key: string, value: T, ready: boolean) {
  // Chỉ ghi sau khi đã nạp dữ liệu cũ (ready), tránh ghi đè giỏ rỗng ở lần render đầu.
  useEffect(() => {
    if (ready) saveJSON(key, value);
  }, [key, value, ready]);
}
