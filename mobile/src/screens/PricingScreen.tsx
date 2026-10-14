/*
 * Bảng giá mobile (§5): mỗi game một section; dùng thử là hàng riêng đứng
 * đầu; gói = "N ngày · tối đa M máy" + giá. Không quy đổi giá/ngày.
 */
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";
import {
  demoProducts,
  effectivePrice,
  formatVnd,
  offersOf,
  SOFTWARE_LABEL,
  trialOf,
} from "../data";
import { DividerOrn, GoldButton, StatusChip } from "../components/ui";

export function PricingScreen({
  onOpenSoftware,
}: {
  onOpenSoftware: (slug: string) => void;
}) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pagePad}>
      <Text style={styles.pageTitle}>Bảng giá</Text>
      <DividerOrn />
      {demoProducts.map((p) => {
        const trial = trialOf(p.slug);
        const offers = offersOf(p.slug);
        return (
          <View key={p.slug} style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionName}>{p.name}</Text>
              <StatusChip
                label={SOFTWARE_LABEL[p.softwareStatus].label}
                fg={SOFTWARE_LABEL[p.softwareStatus].fg}
                bg={SOFTWARE_LABEL[p.softwareStatus].bg}
              />
            </View>
            {trial ? (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.trialTag}>Dùng thử</Text>
                  <Text style={styles.rowLine}>
                    {trial.durationDays} ngày · tối đa {trial.deviceCap} máy
                  </Text>
                </View>
                <GoldButton
                  title="Dùng thử"
                  outline
                  small
                  onPress={() => onOpenSoftware(p.slug)}
                />
              </View>
            ) : null}
            {offers.length === 0 && !trial ? (
              <Text style={styles.closed}>
                Chưa mở bán. Thông tin gói sẽ hiển thị khi được cấu hình.
              </Text>
            ) : null}
            {offers.map((o) => (
              <View key={o.id} style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowLine}>
                    {o.durationDays} ngày · tối đa {o.deviceCap} máy
                  </Text>
                  <View style={styles.priceRow}>
                    {o.promotion ? (
                      <Text style={styles.original}>{formatVnd(o.priceVnd)}</Text>
                    ) : null}
                    <Text style={styles.price}>{formatVnd(effectivePrice(o))}</Text>
                  </View>
                </View>
                <GoldButton
                  title="Mua gói"
                  small
                  onPress={() => onOpenSoftware(p.slug)}
                />
              </View>
            ))}
            <Text
              style={styles.detailLink}
              accessibilityRole="link"
              onPress={() => onOpenSoftware(p.slug)}
            >
              Xem chi tiết
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.page },
  pagePad: { padding: spacing.lg, paddingBottom: spacing.section },
  pageTitle: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  section: {
    marginTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.lg,
  },
  sectionHead: { gap: 8, marginBottom: 10 },
  sectionName: { color: colors.textPrimary, fontSize: 18, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  rowLeft: { flex: 1, gap: 4 },
  trialTag: { color: colors.info, fontSize: 13, fontWeight: "700" },
  rowLine: { color: colors.textSecondary, fontSize: 14 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  original: {
    color: colors.textMuted,
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  price: { color: colors.textPrimary, fontSize: 17, fontWeight: "700" },
  closed: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  detailLink: {
    color: colors.link,
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 10,
    paddingVertical: 6,
  },
});
