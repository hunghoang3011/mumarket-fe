/*
 * GALAXY AUTO — bản mobile demo (Expo / React Native).
 * Vertical slice storefront: Trang chủ · Phần mềm · Bảng giá · Tài khoản.
 * Dữ liệu dùng chung với bản web qua ../src/demo/fixtures (metro watchFolders).
 * Không backend: mọi thao tác chỉ minh họa giao diện.
 */
import { useCallback, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { colors } from "./src/theme";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SoftwareScreen } from "./src/screens/SoftwareScreen";
import { PricingScreen } from "./src/screens/PricingScreen";
import { AccountScreen } from "./src/screens/AccountScreen";

type Tab = "home" | "software" | "pricing" | "account";
/* Icon tab = chữ Hán thư pháp (BrushHanzi) — tránh glyph emoji lỗi */
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "home", label: "Trang Chủ", icon: "山" },
  { key: "software", label: "Phần Mềm", icon: "劍" },
  { key: "pricing", label: "Bảng Giá", icon: "金" },
  { key: "account", label: "Tài Khoản", icon: "侠" },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    BrushHanzi: require("./assets/fonts/BrushHanzi.ttf"),
  });
  const [tab, setTab] = useState<Tab>("home");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openSoftware = useCallback((slug: string) => {
    if (slug === "bang-gia") {
      setTab("pricing");
      return;
    }
    setOpenSlug(slug);
    setTab("software");
  }, []);
  const consumedOpen = useCallback(() => setOpenSlug(null), []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.brand}>GALAXY AUTO</Text>
        <Text style={styles.brandSub}>劍域</Text>
      </View>

      <View style={styles.body}>
        {tab === "home" ? <HomeScreen onOpenSoftware={openSoftware} /> : null}
        {tab === "software" ? (
          <SoftwareScreen openSlug={openSlug} onConsumedOpen={consumedOpen} />
        ) : null}
        {tab === "pricing" ? <PricingScreen onOpenSoftware={openSoftware} /> : null}
        {tab === "account" ? <AccountScreen /> : null}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t.label}
              onPress={() => setTab(t.key)}
              style={styles.tabBtn}
            >
              <Text style={[styles.tabIcon, active && styles.tabActive]}>
                {t.icon}
              </Text>
              <Text style={[styles.tabLabel, active && styles.tabActive]}>
                {t.label}
              </Text>
              {active ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.page },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,168,67,0.3)",
    backgroundColor: "rgba(8,11,18,0.92)",
  },
  brand: {
    color: colors.gold,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 2.5,
  },
  brandSub: {
    fontFamily: "BrushHanzi",
    color: colors.gold,
    opacity: 0.55,
    fontSize: 16,
  },
  body: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(212,168,67,0.3)",
    backgroundColor: "rgba(18,10,6,0.96)",
  },
  tabBtn: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabIcon: {
    fontFamily: "BrushHanzi",
    fontSize: 19,
    color: colors.textMuted,
  },
  tabLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2, fontWeight: "600" },
  tabActive: { color: colors.goldHi },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: "55%",
    backgroundColor: colors.gold,
  },
});
