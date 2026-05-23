import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_ITEMS = [
  { id: "767", name: "Linen Wrap Top", rating: 4.8, category: "Tops" },
  { id: "1080", name: "Floral Midi Dress", rating: 4.6, category: "Dresses" },
  { id: "1077", name: "Tan Blazer", rating: 4.5, category: "Jackets" },
  { id: "872", name: "High Rise Jeans", rating: 4.3, category: "Bottoms" },
];

const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Jackets", "Intimates"];

export default function HomeScreen() {
  const router = useRouter();
  const [age, setAge] = useState(18);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [searchId, setSearchId] = useState("");

  const confirmAge = () => {
    Alert.alert(
      "Are you sure?",
      "This will help StyleMatch match you with the appropriate style in accordance to your age.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, continue", onPress: () => setAgeConfirmed(true) },
      ]
    );
  };

  const handleSearch = () => {
    if (!searchId.trim()) return;
    router.push(`/product/${searchId.trim()}?age=${age}`);
  };

  if (!ageConfirmed) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.ageIntro}>
          <Text style={styles.appName}>StyleMatch</Text>
          <Text style={styles.ageTitle}>How old are you?</Text>
          <Text style={styles.ageValue}>{age}</Text>

          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={age}
            onValueChange={setAge}
            minimumTrackTintColor="#8B5E3C"
            maximumTrackTintColor="#D3CFC9"
            thumbTintColor="#8B5E3C"
          />

          <TouchableOpacity style={styles.checkBtn} onPress={confirmAge}>
            <Text style={styles.checkText}>✓</Text>
          </TouchableOpacity>

          <Text style={styles.ageHelp}>
            Pick your age so StyleMatch can personalize your style feed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoPlaceholder}>SM</Text>
          </View>

          <Text style={styles.headerTitle}>StyleMatch</Text>

          <TouchableOpacity style={styles.bellBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Enter Clothing ID..."
              placeholderTextColor="#888780"
              style={styles.searchInput}
              value={searchId}
              onChangeText={setSearchId}
              keyboardType="numeric"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Go</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat} style={styles.catPill}>
              <Text style={styles.catLabel}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>For you</Text>

        <View style={styles.feed}>
          {MOCK_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/product/${item.id}?age=${age}`)}
            >
              <View style={styles.itemImg} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>★ {item.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanBtn} onPress={() => router.push("/camera")}>
          <Text style={styles.scanIcon}>▦</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F0EB" },
  container: { flex: 1, paddingHorizontal: 16 },

  ageIntro: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#2C2C2A",
    textAlign: "center",
    marginBottom: 36,
  },
  ageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2A",
    textAlign: "center",
  },
  ageValue: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#8B5E3C",
    textAlign: "center",
    marginVertical: 12,
  },
  slider: {
    width: "100%",
    height: 44,
  },
  checkBtn: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8B5E3C",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  checkText: {
    color: "#F5F0EB",
    fontSize: 32,
    fontWeight: "bold",
  },
  ageHelp: {
    color: "#5F5E5A",
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
    lineHeight: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EDE8E2",
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: { fontSize: 12, color: "#8B5E3C", fontWeight: "bold" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#2C2C2A" },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE8E2",
    justifyContent: "center",
    alignItems: "center",
  },
  bellIcon: { fontSize: 16 },

  searchRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE8E2",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, color: "#2C2C2A" },
  searchBtn: {
    backgroundColor: "#8B5E3C",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  searchBtnText: { color: "#F5F0EB", fontWeight: "500", fontSize: 14 },

  catScroll: { marginBottom: 20 },
  catPill: {
    backgroundColor: "#EDE8E2",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  catLabel: { fontSize: 13, color: "#5F5E5A", fontWeight: "500" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C2C2A",
    marginBottom: 12,
  },
  feed: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingBottom: 100 },
  itemCard: {
    width: "47%",
    backgroundColor: "#EDE8E2",
    borderRadius: 16,
    overflow: "hidden",
  },
  itemImg: { height: 160, backgroundColor: "#D3CFC9" },
  itemInfo: { padding: 10 },
  itemName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2C2C2A",
    marginBottom: 6,
  },
  scoreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#8B5E3C",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreText: { fontSize: 11, color: "#F5F0EB", fontWeight: "500" },

  nav: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2C2C2A",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  navIcon: { fontSize: 20 },
  scanBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B5E3C",
    justifyContent: "center",
    alignItems: "center",
  },
  scanIcon: { fontSize: 22, color: "#F5F0EB" },
});