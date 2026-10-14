/*
 * Phần mềm mobile: danh sách 5 game → chạm vào mở chi tiết (radio gói +
 * dùng thử + tóm tắt). Không backend — "Mua gói"/"Dùng thử" chỉ hiện
 * thông báo demo. Giá không tính gói dùng thử (D03).
 */
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, spacing } from "../theme";
import {
  demoProducts,
  effectivePrice,
  formatDate,
  formatVnd,
  offersOf,
  SOFTWARE_LABEL,
  startingOffer,
  trialOf,
} from "../data";
import type { Offer, Product } from "../../../src/demo/types";
import {
  ArtThumb,
  DividerOrn,
  GoldButton,
  LacquerPanel,
  StatusChip,
} from "../components/ui";

export function SoftwareScreen({
  openSlug,
  onConsumedOpen,
}: {
  openSlug: string | null;
  onConsumedOpen: () => void;
}) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Mở chi tiết khi tab khác điều hướng tới (ví dụ từ Trang chủ)
  React.useEffect(() => {
    if (openSlug && openSlug !== "bang-gia") {
      const p = demoProducts.find((x) => x.slug === openSlug);
      if (p) {
        setSelected(p);
        setOfferId(null);
      }
    }
    onConsumedOpen();
  }, [openSlug, onConsumedOpen]);

  const detail = selected;
  const offers = useMemo(
    () => (detail ? offersOf(detail.slug) : []),
    [detail],
  );
  const trial = detail ? trialOf(detail.slug) : null;
  const chosen = offers.find((o) => o.id === offerId) ?? null;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pagePad}>
      <Text style={styles.pageTitle}>Phần mềm</Text>
      <DividerOrn />
      <View style={styles.list}>
        {demoProducts.map((p) => {
          const start = startingOffer(p.slug);
          return (
            <Pressable
              key={p.slug}
              accessibilityRole="button"
              onPress={() => {
                setSelected(p);
                setOfferId(null);
              }}
            >
              <LacquerPanel style={styles.card}>
                <ArtThumb slug={p.slug} height={120} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{p.name}</Text>
                  <StatusChip
                    label={SOFTWARE_LABEL[p.softwareStatus].label}
                    fg={SOFTWARE_LABEL[p.softwareStatus].fg}
                    bg={SOFTWARE_LABEL[p.softwareStatus].bg}
                  />
                  {start ? (
                    <>
                      <Text style={styles.price}>
                        Từ {formatVnd(effectivePrice(start))}
                      </Text>
                      <Text style={styles.priceSub}>
                        {start.durationDays} ngày · tối đa {start.deviceCap} máy
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.closed}>Chưa mở bán</Text>
                  )}
                </View>
              </LacquerPanel>
            </Pressable>
          );
        })}
      </View>

      {/* Chi tiết sản phẩm dạng sheet */}
      <Modal
        visible={detail !== null}
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.sheetPad}>
            {detail ? (
              <>
                <ArtThumb slug={detail.slug} height={150} />
                <Text style={styles.sheetTitle}>{detail.name}</Text>
                <StatusChip
                  label={SOFTWARE_LABEL[detail.softwareStatus].label}
                  fg={SOFTWARE_LABEL[detail.softwareStatus].fg}
                  bg={SOFTWARE_LABEL[detail.softwareStatus].bg}
                />
                <Text style={styles.meta}>
                  Phiên bản phần mềm: {detail.softwareVersion ?? "Chưa có thông tin"}
                </Text>
                <Text style={styles.meta}>
                  Phiên bản game hỗ trợ:{" "}
                  {detail.supportedGameVersion ?? "Chưa có thông tin"}
                </Text>
                {detail.statusUpdatedAt ? (
                  <Text style={styles.meta}>
                    Cập nhật lúc: {formatDate(detail.statusUpdatedAt)}
                  </Text>
                ) : null}

                <Text style={styles.goiTitle}>Chọn gói</Text>
                {trial ? (
                  <View style={styles.trialBlock}>
                    <Text style={styles.trialText}>
                      Dùng thử {trial.durationDays} ngày · tối đa{" "}
                      {trial.deviceCap} máy · không cần chuyển khoản
                    </Text>
                    <GoldButton
                      title="Dùng thử"
                      outline
                      small
                      onPress={() =>
                        setNotice("Bản demo: dùng thử chỉ giả lập giao diện.")
                      }
                    />
                  </View>
                ) : null}
                {offers.length === 0 ? (
                  <Text style={styles.meta}>
                    Chưa mở bán. Thông tin gói sẽ hiển thị khi được cấu hình.
                  </Text>
                ) : (
                  offers.map((o: Offer) => {
                    const active = offerId === o.id;
                    return (
                      <Pressable
                        key={o.id}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active }}
                        onPress={() => setOfferId(o.id)}
                        style={[styles.offerRow, active && styles.offerRowOn]}
                      >
                        <View style={[styles.radio, active && styles.radioOn]} />
                        <View style={styles.offerBody}>
                          <Text style={styles.offerLine}>
                            {o.durationDays} ngày · tối đa {o.deviceCap} máy
                          </Text>
                          <Text style={styles.offerRule}>
                            Tính hạn từ lần kích hoạt đầu
                          </Text>
                        </View>
                        <View style={styles.offerPriceBox}>
                          {o.promotion ? (
                            <Text style={styles.offerOriginal}>
                              {formatVnd(o.priceVnd)}
                            </Text>
                          ) : null}
                          <Text style={styles.offerPrice}>
                            {formatVnd(effectivePrice(o))}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })
                )}

                {chosen ? (
                  <LacquerPanel style={styles.summary}>
                    <Text style={styles.summaryLine}>
                      {detail.name} — {chosen.durationDays} ngày · tối đa{" "}
                      {chosen.deviceCap} máy
                    </Text>
                    <Text style={styles.summaryPrice}>
                      {formatVnd(effectivePrice(chosen))}
                    </Text>
                    <Text style={styles.summaryRule}>
                      Tính hạn từ lần kích hoạt đầu
                    </Text>
                  </LacquerPanel>
                ) : null}

                <View style={styles.sheetActions}>
                  <GoldButton
                    title="Mua gói"
                    disabled={!chosen}
                    onPress={() =>
                      setNotice(
                        "Bản demo: quy trình thanh toán chạy trên bản web (VietQR).",
                      )
                    }
                  />
                  <GoldButton
                    title="Đóng"
                    outline
                    onPress={() => setSelected(null)}
                  />
                </View>
                {!chosen && offers.length > 0 ? (
                  <Text style={styles.hint}>Chọn một gói</Text>
                ) : null}
                {notice ? (
                  <View style={styles.notice}>
                    <Text style={styles.noticeText}>{notice}</Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setNotice(null)}
                    >
                      <Text style={styles.noticeClose}>Đóng</Text>
                    </Pressable>
                  </View>
                ) : null}
              </>
            ) : null}
          </ScrollView>
        </View>
      </Modal>
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
  list: { gap: 14, marginTop: spacing.lg },
  card: { padding: 12 },
  cardBody: { marginTop: 10, gap: 6 },
  cardName: { color: colors.goldHi, fontSize: 17, fontWeight: "700" },
  price: { color: colors.textPrimary, fontSize: 18, fontWeight: "700" },
  priceSub: { color: colors.textMuted, fontSize: 13 },
  closed: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
  sheet: { flex: 1, backgroundColor: colors.page },
  sheetPad: { padding: spacing.lg, paddingBottom: spacing.section },
  sheetTitle: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 14,
  },
  meta: { color: colors.textSecondary, fontSize: 13, marginTop: 6 },
  goiTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  trialBlock: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    padding: 12,
    gap: 10,
    marginBottom: 12,
    backgroundColor: colors.panel,
  },
  trialText: { color: colors.info, fontSize: 13, lineHeight: 19 },
  offerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: colors.panel,
  },
  offerRowOn: { borderColor: colors.gold, backgroundColor: colors.lacquer },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
  },
  radioOn: { borderColor: colors.gold, backgroundColor: colors.gold },
  offerBody: { flex: 1 },
  offerLine: { color: colors.textPrimary, fontSize: 15, fontWeight: "600" },
  offerRule: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  offerPriceBox: { alignItems: "flex-end" },
  offerOriginal: {
    color: colors.textMuted,
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  offerPrice: { color: colors.textPrimary, fontSize: 17, fontWeight: "700" },
  summary: { marginTop: 8, gap: 4 },
  summaryLine: { color: colors.textSecondary, fontSize: 13 },
  summaryPrice: { color: colors.goldHi, fontSize: 24, fontWeight: "800" },
  summaryRule: { color: colors.textMuted, fontSize: 12 },
  sheetActions: { gap: 10, marginTop: 18 },
  hint: { color: colors.textMuted, fontSize: 13, marginTop: 8, textAlign: "center" },
  notice: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.info,
    backgroundColor: colors.infoBg,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  noticeText: { color: colors.info, fontSize: 13, flex: 1 },
  noticeClose: { color: colors.link, fontSize: 13, fontWeight: "600" },
});
