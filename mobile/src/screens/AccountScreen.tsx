/*
 * Tài khoản mobile (demo): đổi vai trò + Phần mềm của tôi — banner đơn chờ,
 * nhóm theo sản phẩm, hàng bản quyền (trạng thái, hạn, x/y máy).
 */
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";
import {
  demoLicenses,
  demoOrders,
  demoProducts,
  formatDate,
  formatVnd,
  LICENSE_LABEL,
} from "../data";
import { DividerOrn, LacquerPanel, StatusChip } from "../components/ui";

type Role = "guest" | "customer" | "admin";
const ROLES: { value: Role; label: string }[] = [
  { value: "guest", label: "Khách" },
  { value: "customer", label: "Khách hàng" },
  { value: "admin", label: "Quản trị" },
];

function daysLeft(expiryIso: string): number {
  return Math.floor(
    (new Date(expiryIso).getTime() - new Date("2026-10-13T07:05:00.000Z").getTime()) /
      86_400_000,
  );
}

export function AccountScreen() {
  const [role, setRole] = useState<Role>("customer");
  const pending = demoOrders.filter((o) => o.status === "pending_payment");

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pagePad}>
      <Text style={styles.pageTitle}>Phần mềm của tôi</Text>
      <DividerOrn />

      {/* Đổi vai trò demo */}
      <View style={styles.roleRow}>
        {ROLES.map((r) => (
          <Pressable
            key={r.value}
            accessibilityRole="button"
            accessibilityState={{ selected: role === r.value }}
            onPress={() => setRole(r.value)}
            style={[styles.roleBtn, role === r.value && styles.roleBtnOn]}
          >
            <Text style={[styles.roleText, role === r.value && styles.roleTextOn]}>
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.demoNote}>
        Bản demo: vai trò chỉ đổi dữ liệu hiển thị, không có xác thực thật.
      </Text>

      {role === "guest" ? (
        <LacquerPanel style={styles.guestBox}>
          <Text style={styles.guestText}>
            Đăng nhập để xem phần mềm và đơn hàng của bạn.
          </Text>
        </LacquerPanel>
      ) : null}

      {role === "admin" ? (
        <LacquerPanel style={styles.guestBox}>
          <Text style={styles.guestText}>
            Khu quản trị đầy đủ nằm ở bản web (/quan-tri). Bản mobile tập trung
            storefront.
          </Text>
        </LacquerPanel>
      ) : null}

      {role === "customer" ? (
        <>
          {pending.map((o) => (
            <View key={o.code} style={styles.banner}>
              <Text style={styles.bannerText}>
                Đơn {o.code} ({o.productName} — {o.offerLabel}){" "}
                {o.hasPaymentReport
                  ? "đang chờ xác nhận tiền."
                  : "đang chờ thanh toán."}
              </Text>
              <Text style={styles.bannerAmount}>{formatVnd(o.amountVnd)}</Text>
            </View>
          ))}

          {demoProducts
            .filter((p) => demoLicenses.some((l) => l.productSlug === p.slug))
            .map((p) => (
              <View key={p.slug} style={styles.group}>
                <View style={styles.groupHead}>
                  <Text style={styles.groupName}>{p.name}</Text>
                  <Text style={styles.groupMeta}>
                    Phiên bản {p.softwareVersion ?? "Chưa có thông tin"}
                  </Text>
                </View>
                {demoLicenses
                  .filter((l) => l.productSlug === p.slug)
                  .map((l) => {
                    const meta = LICENSE_LABEL[l.status];
                    const soon =
                      l.status === "active" && l.expiresAt && daysLeft(l.expiresAt) <= 3;
                    return (
                      <LacquerPanel key={l.reference} style={styles.license}>
                        <View style={styles.licenseTop}>
                          <Text style={styles.licenseRef}>{l.reference}</Text>
                          <StatusChip label={meta.label} fg={meta.fg} bg={meta.bg} />
                        </View>
                        <Text style={styles.licenseLine}>
                          {l.expiresAt
                            ? `Hết hạn ${formatDate(l.expiresAt)}`
                            : `Chưa kích hoạt — ${l.durationDays} ngày tính từ lần kích hoạt đầu`}
                          {soon && l.expiresAt
                            ? ` (còn ${daysLeft(l.expiresAt)} ngày)`
                            : ""}
                        </Text>
                        <Text style={styles.licenseLine}>
                          {l.devices.length}/{l.deviceCap} máy
                        </Text>
                      </LacquerPanel>
                    );
                  })}
              </View>
            ))}
        </>
      ) : null}
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
  roleRow: { flexDirection: "row", gap: 8, marginTop: spacing.lg },
  roleBtn: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  roleBtnOn: { borderColor: colors.gold, backgroundColor: colors.lacquer },
  roleText: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  roleTextOn: { color: colors.link },
  demoNote: { color: colors.textMuted, fontSize: 12, marginTop: 10 },
  guestBox: { marginTop: spacing.xl },
  guestText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  banner: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.warningBg,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  bannerText: { color: colors.textPrimary, fontSize: 13, flex: 1, lineHeight: 19 },
  bannerAmount: { color: colors.goldHi, fontSize: 15, fontWeight: "700" },
  group: { marginTop: spacing.xl },
  groupHead: { marginBottom: 10 },
  groupName: { color: colors.goldHi, fontSize: 17, fontWeight: "700" },
  groupMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  license: { marginBottom: 10, gap: 6 },
  licenseTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  licenseRef: { color: colors.textPrimary, fontSize: 16, fontWeight: "800" },
  licenseLine: { color: colors.textSecondary, fontSize: 13 },
});
