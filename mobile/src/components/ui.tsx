/*
 * Primitives mobile: nút kim loại (bevel + viền đồng), chip trạng thái,
 * thumbnail artwork (gradient + watermark thư pháp), ấn triện son, panel
 * sơn mài (viền vàng kép). Tương đương vật liệu web M2/M4/sơn mài.
 */
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius } from "../theme";
import { ART_BY_SLUG, HANZI_BY_SLUG } from "../data";

export function GoldButton({
  title,
  onPress,
  outline = false,
  disabled = false,
  loading = false,
  small = false,
}: {
  title: string;
  onPress?: () => void;
  outline?: boolean;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
}) {
  const content = loading ? (
    <View style={styles.btnRow}>
      <ActivityIndicator color={outline ? colors.goldHi : colors.onGold} />
      <Text style={[styles.btnText, outline && styles.btnTextOutline]}>
        {title}
      </Text>
    </View>
  ) : (
    <Text
      style={[
        styles.btnText,
        small && styles.btnTextSmall,
        outline && styles.btnTextOutline,
        disabled && styles.btnTextDisabled,
      ]}
    >
      {title}
    </Text>
  );

  if (outline || disabled) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        disabled={disabled || loading}
        onPress={onPress}
        style={({ pressed }) => [
          styles.btnBase,
          small && styles.btnSmall,
          styles.btnOutline,
          disabled && styles.btnDisabled,
          pressed && !disabled && { opacity: 0.8 },
        ]}
      >
        {content}
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        small && styles.btnSmallWrap,
        pressed && { transform: [{ translateY: 1 }] },
      ]}
    >
      <LinearGradient
        colors={[colors.goldHi, colors.gold, colors.goldLo, "#8A6420"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.btnBase, small && styles.btnSmall, styles.btnMetal]}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
}

export function StatusChip({
  label,
  fg,
  bg,
}: {
  label: string;
  fg: string;
  bg: string;
}) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <View style={[styles.chipDot, { backgroundColor: fg }]} />
      <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** Thumbnail artwork: gradient theo game + chữ Hán thư pháp watermark */
export function ArtThumb({
  slug,
  height,
}: {
  slug: string;
  height: number;
}) {
  const [c1, c2] = ART_BY_SLUG[slug] ?? ["#123043", "#081420"];
  return (
    <View style={[styles.artFrame, { height }]}>
      <LinearGradient
        colors={[c1, c2]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.artMoon}>●</Text>
      <Text style={styles.artHanzi} accessibilityElementsHidden>
        {HANZI_BY_SLUG[slug] ?? "武"}
      </Text>
    </View>
  );
}

/** Ấn triện son với chữ thư pháp */
export function SealMark({ text = "武林" }: { text?: string }) {
  return (
    <View style={styles.seal}>
      <Text style={styles.sealText}>{text}</Text>
    </View>
  );
}

/** Panel sơn mài: viền đồng + khung vàng kép bên trong */
export function LacquerPanel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View style={[styles.lacquer, style]}>
      <View style={styles.lacquerInner} pointerEvents="none" />
      {children}
    </View>
  );
}

export function DividerOrn() {
  return (
    <View style={styles.dividerRow} accessibilityElementsHidden>
      <View style={styles.dividerLine} />
      <View style={styles.dividerDiamond} />
      <View style={[styles.dividerLine, { transform: [{ scaleX: -1 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  btnRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnBase: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: radius.control,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSmall: { minHeight: 36, paddingHorizontal: 12 },
  btnSmallWrap: { alignSelf: "flex-start" },
  btnMetal: {
    borderWidth: 1,
    borderColor: colors.edge,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: "transparent",
  },
  btnDisabled: {
    borderColor: colors.borderSubtle,
    backgroundColor: "#1A2433",
  },
  btnText: {
    color: colors.onGold,
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  btnTextSmall: { fontSize: 13 },
  btnTextOutline: { color: colors.link },
  btnTextDisabled: { color: "#8E97A5" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 12, fontWeight: "600" },
  artFrame: {
    borderWidth: 1,
    borderColor: colors.edge,
    borderRadius: radius.detail,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  artMoon: {
    position: "absolute",
    top: 14,
    right: 18,
    fontSize: 26,
    color: colors.goldHi,
    opacity: 0.9,
  },
  artHanzi: {
    fontFamily: "BrushHanzi",
    fontSize: 44,
    color: colors.gold,
    opacity: 0.35,
    textAlign: "right",
    paddingRight: 10,
    paddingBottom: 6,
  },
  seal: {
    width: 44,
    height: 44,
    borderRadius: radius.detail,
    backgroundColor: colors.cinnabar,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-4deg" }],
    borderWidth: 2,
    borderColor: "rgba(255,230,200,0.55)",
  },
  sealText: {
    fontFamily: "BrushHanzi",
    color: "#F7E3C9",
    fontSize: 15,
    lineHeight: 17,
    textAlign: "center",
  },
  lacquer: {
    backgroundColor: colors.lacquer,
    borderWidth: 1,
    borderColor: colors.edge,
    borderRadius: radius.panel,
    padding: 16,
  },
  lacquerInner: {
    position: "absolute",
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.26)",
    borderRadius: radius.detail,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dividerLine: { width: 52, height: 1, backgroundColor: colors.edge },
  dividerDiamond: {
    width: 8,
    height: 8,
    marginHorizontal: 10,
    backgroundColor: colors.gold,
    transform: [{ rotate: "45deg" }],
  },
});
