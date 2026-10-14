/*
 * Trang chủ mobile — bám thứ tự §5: hero → 5 game → benefits → 4 bước →
 * cập nhật mới. Copy gốc §1 nguyên văn.
 */
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";
import {
  demoAnnouncements,
  demoProducts,
  formatDate,
  HANZI_BY_SLUG,
} from "../data";
import {
  ArtThumb,
  DividerOrn,
  GoldButton,
  LacquerPanel,
  SealMark,
  StatusChip,
} from "../components/ui";
import { SOFTWARE_LABEL } from "../data";

const BENEFITS = [
  "Giao diện dễ sử dụng",
  "Tùy chỉnh linh hoạt",
  "Cập nhật phiên bản",
  "Hỗ trợ kỹ thuật",
];
const STEPS = [
  "Chọn tựa game",
  "Lựa chọn gói phần mềm",
  "Thanh toán và nhận License",
  "Tải xuống và kích hoạt",
];

export function HomeScreen({ onOpenSoftware }: { onOpenSoftware: (slug: string) => void }) {
  const latest = [...demoAnnouncements]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pagePad}>
      {/* Hero */}
      <LacquerPanel style={styles.hero}>
        <Text style={styles.heroSlogan}>Công Nghệ Khai Mở – Chinh Phục Tam Giới</Text>
        <Text style={styles.heroTitle}>
          THẦN BINH CÔNG NGHỆ{"\n"}CHINH PHỤC NGŨ ĐẠI THẾ GIỚI
        </Text>
        <Text style={styles.heroSub}>
          Hệ sinh thái phần mềm Auto Game dành cho cộng đồng Kiếm Hiệp &amp; MU.
        </Text>
        <View style={styles.heroCtas}>
          <GoldButton title="KHÁM PHÁ PHẦN MỀM" onPress={() => onOpenSoftware(demoProducts[0]!.slug)} />
          <View style={styles.heroCtaRow}>
            <GoldButton title="XEM BẢNG GIÁ" outline small onPress={() => onOpenSoftware("bang-gia")} />
            <SealMark />
          </View>
        </View>
        <Text style={styles.heroVertical} accessibilityElementsHidden>
          {"武\n林\n仙\n俠"}
        </Text>
      </LacquerPanel>

      {/* NGŨ ĐẠI THẾ GIỚI */}
      <Text style={styles.sectionTitle}>NGŨ ĐẠI THẾ GIỚI</Text>
      <DividerOrn />
      <Text style={styles.sectionSub}>
        Khám phá hệ sinh thái phần mềm được phát triển dành riêng cho từng tựa game.
      </Text>
      <View style={styles.cardList}>
        {demoProducts.map((p) => (
          <LacquerPanel key={p.slug} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardArt}>
                <ArtThumb slug={p.slug} height={96} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{p.name}</Text>
                <StatusChip
                  label={SOFTWARE_LABEL[p.softwareStatus].label}
                  fg={SOFTWARE_LABEL[p.softwareStatus].fg}
                  bg={SOFTWARE_LABEL[p.softwareStatus].bg}
                />
                {p.shortDescription ? (
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {p.shortDescription}
                  </Text>
                ) : null}
                <View style={styles.cardActions}>
                  <GoldButton
                    title="Xem chi tiết"
                    outline
                    small
                    onPress={() => onOpenSoftware(p.slug)}
                  />
                  <Text style={styles.cardHanzi} accessibilityElementsHidden>
                    {HANZI_BY_SLUG[p.slug] ?? "武"}
                  </Text>
                </View>
              </View>
            </View>
          </LacquerPanel>
        ))}
      </View>

      {/* Benefits */}
      <View style={styles.benefitBand}>
        <Text style={styles.sectionTitle}>ĐỒNG HÀNH CÙNG HÀNH TRÌNH CHINH PHỤC</Text>
        <DividerOrn />
        <View style={styles.benefitGrid}>
          {BENEFITS.map((b) => (
            <View key={b} style={styles.benefitItem}>
              <Text style={styles.benefitDot}>◆</Text>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 4 bước */}
      <Text style={styles.sectionTitle}>MUA PHẦN MỀM TRONG BỐN BƯỚC</Text>
      <DividerOrn />
      <View style={styles.steps}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <View style={styles.stepBody}>
              <Text style={styles.stepText}>{s}</Text>
              {i === 2 ? (
                <Text style={styles.stepCaption}>
                  Bản quyền được cấp sau khi khoản chuyển được xác nhận.
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.trialNote}>Dùng thử không cần chuyển khoản.</Text>

      {/* Cập nhật mới */}
      <Text style={styles.sectionTitle}>CẬP NHẬT MỚI</Text>
      <DividerOrn />
      <View style={styles.newsList}>
        {latest.map((a) => (
          <View key={a.slug} style={styles.newsRow}>
            <Text style={styles.newsMeta}>
              {formatDate(a.publishedAt)} ·{" "}
              {a.productSlug
                ? demoProducts.find((p) => p.slug === a.productSlug)?.name
                : "Chung"}
            </Text>
            <Text style={styles.newsTitle}>{a.title}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footerBrush} accessibilityElementsHidden>
        劍氣長存
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.page },
  pagePad: { padding: spacing.lg, paddingBottom: spacing.section },
  hero: { padding: 20, marginBottom: spacing.xl },
  heroSlogan: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
    maxWidth: "78%",
  },
  heroTitle: {
    color: colors.goldHi,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1,
    lineHeight: 38,
    marginTop: 10,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSub: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 10 },
  heroCtas: { marginTop: 16, gap: 12 },
  heroCtaRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  heroVertical: {
    position: "absolute",
    right: 14,
    top: 14,
    fontFamily: "BrushHanzi",
    fontSize: 24,
    lineHeight: 30,
    color: colors.gold,
    opacity: 0.35,
    textAlign: "center",
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: spacing.xl,
  },
  sectionSub: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8 },
  cardList: { gap: 12, marginTop: spacing.lg },
  card: { padding: 12 },
  cardRow: { flexDirection: "row", gap: 12 },
  cardArt: { width: 96 },
  cardBody: { flex: 1, gap: 6 },
  cardName: { color: colors.goldHi, fontSize: 16, fontWeight: "700" },
  cardDesc: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  cardHanzi: {
    fontFamily: "BrushHanzi",
    fontSize: 22,
    color: colors.gold,
    opacity: 0.5,
  },
  benefitBand: {
    marginTop: spacing.xl,
    backgroundColor: colors.lacquer,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(212,168,67,0.22)",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginHorizontal: -spacing.lg,
  },
  benefitGrid: { marginTop: spacing.lg, gap: 14 },
  benefitItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  benefitDot: { color: colors.gold, fontSize: 12 },
  benefitText: { color: colors.textPrimary, fontSize: 15, fontWeight: "500" },
  steps: { marginTop: spacing.lg, gap: 16 },
  stepRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.lacquer,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: { color: colors.gold, fontWeight: "800", fontSize: 15 },
  stepBody: { flex: 1 },
  stepText: { color: colors.textPrimary, fontSize: 15, fontWeight: "600", marginTop: 6 },
  stepCaption: { color: colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 },
  trialNote: { color: colors.info, fontSize: 13, marginTop: 14 },
  newsList: { marginTop: spacing.lg, gap: 0 },
  newsRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  newsMeta: { color: colors.textMuted, fontSize: 12 },
  newsTitle: { color: colors.link, fontSize: 15, fontWeight: "600", marginTop: 2 },
  footerBrush: {
    fontFamily: "BrushHanzi",
    fontSize: 26,
    color: colors.gold,
    opacity: 0.4,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
});
