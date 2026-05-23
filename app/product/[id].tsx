import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRODUCT_IMAGES: Record<string, any> = {
  "767": require("../../assets/images/clothes/top.jpg"),
  "1080": require("../../assets/images/clothes/Midi Floral dress.jpg"),
  "1077": require("../../assets/images/clothes/Brown Blazer.png"),
  "872": require("../../assets/images/clothes/pants.jpg"),
};
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://127.0.0.1:5000";

export default function ProductScreen() {
  const { id, age } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/scan?age=${age || 25}&clothing_id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not connect to server. Make sure Flask is running.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#8B5E3C" />
        <Text style={styles.loadingText}>Analyzing reviews...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.goBackBtn}
          >
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isBuy = data.verdict === "buy";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Product Details</Text>

          <View style={styles.backBtn} />
        </View>

        {/* Image */}
        {PRODUCT_IMAGES[String(id)] ? (
          <Image source={PRODUCT_IMAGES[String(id)]} style={styles.heroImg} resizeMode="cover" />
        ) : (
          <View style={styles.heroImg} />
        )}

        {/* Verdict */}
        <View
          style={[
            styles.verdict,
            { backgroundColor: isBuy ? "#2C7A4B" : "#A32D2D" },
          ]}
        >
          <Text style={styles.verdictIcon}>{isBuy ? "✓" : "✗"}</Text>

          <View>
            <Text style={styles.verdictText}>
              {isBuy ? "Buy it" : "Don't buy it"}
            </Text>

            <Text style={styles.verdictSub}>
              {isBuy
                ? "Loved by people like you"
                : "Not recommended for your age group"}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Product Info */}
          <Text style={styles.productName}>
            Clothing ID: {data.clothing_id}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>
              {"★".repeat(Math.round(data.predicted_rating))}
            </Text>

            <Text style={styles.ratingNum}>
              {data.predicted_rating} / 5.0
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {data.worthiness_score}
              </Text>
              <Text style={styles.statLabel}>Worthiness Score</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {data.reviews_analyzed}
              </Text>
              <Text style={styles.statLabel}>Reviews Analyzed</Text>
            </View>
          </View>

          {/* Positive Keywords */}
          {data.positive_keywords?.length > 0 && (
            <View style={styles.keywordSection}>
              <Text style={styles.sectionTitle}>Popular mentions</Text>

              <View style={styles.tagContainer}>
                {data.positive_keywords.map((word, index) => (
                  <View key={index} style={styles.positiveTag}>
                    <Text style={styles.tagText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Negative Keywords */}
          {data.negative_keywords?.length > 0 && (
            <View style={styles.keywordSection}>
              <Text style={styles.sectionTitle}>Common complaints</Text>

              <View style={styles.tagContainer}>
                {data.negative_keywords.map((word, index) => (
                  <View key={index} style={styles.negativeTag}>
                    <Text style={styles.tagText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F0EB" },

  loadingText: {
    textAlign: "center",
    marginTop: 12,
    color: "#888780",
  },

  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  errorText: {
    color: "#A32D2D",
    marginBottom: 16,
  },

  goBackBtn: {
    backgroundColor: "#8B5E3C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  goBackText: { color: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE8E2",
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: { fontSize: 18 },

  headerTitle: { fontSize: 15, fontWeight: "500" },

  heroImg: {
    height: 280,
    backgroundColor: "#D3CFC9",
    marginHorizontal: 16,
    borderRadius: 20,
  },

  verdict: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  verdictIcon: { fontSize: 22, color: "#fff" },

  verdictText: { fontSize: 15, fontWeight: "500", color: "#fff" },

  verdictSub: { fontSize: 11, color: "rgba(255,255,255,0.75)" },

  content: { padding: 16 },

  productName: { fontSize: 20, fontWeight: "500" },

  ratingRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  stars: { color: "#8B5E3C" },

  ratingNum: {},

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#EDE8E2",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8B5E3C",
  },

  statLabel: {
    fontSize: 11,
    color: "#888780",
  },

  keywordSection: { marginTop: 24 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  positiveTag: {
    backgroundColor: "#D8F3DC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },

  negativeTag: {
    backgroundColor: "#F8D7DA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },

  tagText: {
    fontWeight: "500",
  },
});