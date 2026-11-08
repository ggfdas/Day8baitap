import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CartItem } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { colors, formatPrice, radius } from "../theme";

interface Props {
  item: CartItem;
  onChangeQty: (bookId: number, quantity: number) => void;
  onRemove: (bookId: number) => void;
}

// Nút −/+ giữ số ở state cục bộ cho phản hồi ngay, rồi debounce 300ms mới đẩy lên store.
export function CartItemRow({ item, onChangeQty, onRemove }: Props) {
  const [qty, setQty] = useState(item.quantity);
  const debouncedQty = useDebounce(qty, 300);

  // Chỉ ghi store khi giá trị đã lắng khác số hiện tại (bấm liên tục → ghi một lần).
  useEffect(() => {
    if (debouncedQty !== item.quantity) onChangeQty(item.bookId, debouncedQty);
  }, [debouncedQty]);

  // Store đổi từ nơi khác (vd: thêm ở màn Chi tiết) → đồng bộ lại số cục bộ.
  useEffect(() => {
    setQty(item.quantity);
  }, [item.quantity]);

  const canDec = qty > 1;
  const canInc = qty < item.stock;

  return (
    <View style={styles.row}>
      <View style={[styles.cover, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <Text style={styles.stock}>Còn {item.stock}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable
          disabled={!canDec}
          onPress={() => setQty((q) => q - 1)}
          accessibilityLabel="Giảm"
          style={({ pressed }) => [styles.stepBtn, !canDec && styles.stepBtnDisabled, pressed && canDec && styles.stepBtnPressed]}
        >
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.qty}>{qty}</Text>
        <Pressable
          disabled={!canInc}
          onPress={() => setQty((q) => q + 1)}
          accessibilityLabel="Tăng"
          style={({ pressed }) => [styles.stepBtn, !canInc && styles.stepBtnDisabled, pressed && canInc && styles.stepBtnPressed]}
        >
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => onRemove(item.bookId)} hitSlop={8} accessibilityLabel="Xóa khỏi giỏ">
        <Text style={styles.trash}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, padding: 10, marginHorizontal: 12, marginVertical: 5, gap: 10 },
  cover: { width: 54, height: 72, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 26 },
  info: { flex: 1, gap: 2 },
  title: { fontWeight: "700", color: colors.text },
  price: { color: colors.indigo, fontWeight: "800" },
  stock: { color: colors.muted, fontSize: 12 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 4 },
  stepBtn: { width: 30, height: 30, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  stepBtnDisabled: { opacity: 0.35 },
  stepBtnPressed: { backgroundColor: colors.bg, borderColor: colors.indigo },
  stepText: { fontSize: 18, fontWeight: "800", color: colors.indigo, lineHeight: 20, textAlign: "center" },
  qty: { minWidth: 24, textAlign: "center", fontWeight: "800", color: colors.navy, fontSize: 16 },
  trash: { fontSize: 22 },
});