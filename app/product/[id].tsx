import { Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";

const PRODUCT_IMAGES: Record<string, any> = {
  "767": require("../../assets/images/clothes/top.jpg"),
  "1080": require("../../assets/images/clothes/Midi Floral dress.jpg"),
  "1077": require("../../assets/images/clothes/Brown Blazer.png"),
  "872": require("../../assets/images/clothes/pants.jpg"),
};

const API_URL = "http://127.0.0.1:5000";

export default function ProductScreen() {
  const { id, age } = useLocalSearchParams();
  const router = useRouter();

  type ProductData = {
    clothing_id: number;
    predicted_rating: number;
    demographic_rating: number | null;
    worthiness_score: number;
    verdict: string;
    reviews_analyzed: number;
    positive_keywords: string[];
    negative_keywords: string[];
    summary: string;
  };
  const [data, setData] = useState<ProductData | null>(null);
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
        <ActivityIndicator size="large" color="#8B5E3C" style={{ marginTop: 60 }} />
        <Text style={styles.loadingText}>Analyzing reviews...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.goBackBtn}>
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) return null;
  const isBuy = data.verdict === "buy";
  const fullStars = Math.round(data.predicted_rating);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#2C2C2A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Image card */}
        <View style={styles.imageCard}>
          {PRODUCT_IMAGES[String(id)] ? (
            <Image
              source={PRODUCT_IMAGES[String(id)]}
              style={styles.heroImg}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name */}
          <Text style={styles.productName}>Clothing Item #{data.clothing_id}</Text>

          {/* Worthiness + badge */}
          <View style={styles.metaRow}>
            <View style={[styles.badge, isBuy ? styles.badgeBuy : styles.badgeNoBuy]}>
              <Text style={[styles.badgeText, isBuy ? styles.badgeTextBuy : styles.badgeTextNoBuy]}>
                {isBuy ? "Recommended" : "Not Recommended"}
              </Text>
            </View>
            <Text style={styles.worthScore}>{data.worthiness_score}% worthiness</Text>
          </View>

          {/* Stars */}
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>
              {"★".repeat(fullStars)}{"☆".repeat(5 - fullStars)}
            </Text>
            <Text style={styles.ratingNum}>{data.predicted_rating}</Text>
            <Text style={styles.reviewCount}>({data.reviews_analyzed} reviews)</Text>
          </View>

          {/* Demographic rating */}
          {data.demographic_rating != null && (
            <View style={styles.demoRow}>
              <View style={styles.demoBox}>
                <Text style={styles.demoLabel}>Predicted for your age group</Text>
                <View style={styles.demoStarRow}>
                  <Text style={styles.demoStars}>
                    {"★".repeat(data.demographic_rating)}{"☆".repeat(5 - data.demographic_rating)}
                  </Text>
                  <Text style={styles.demoNum}>{data.demographic_rating} / 5</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Summary */}
          {data.summary ? (
            <Text style={styles.summary}>{data.summary}</Text>
          ) : null}

          {/* Positive keywords */}
          {data.positive_keywords?.length > 0 && (
            <View style={styles.keywordSection}>
              <Text style={styles.sectionTitle}>Popular mentions</Text>
              <View style={styles.tagRow}>
                {data.positive_keywords.map((word: string, i: number) => (
                  <View key={i} style={styles.positiveTag}>
                    <Text style={styles.positiveTagText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Negative keywords */}
          {data.negative_keywords?.length > 0 && (
            <View style={styles.keywordSection}>
              <Text style={styles.sectionTitle}>Common complaints</Text>
              <View style={styles.tagRow}>
                {data.negative_keywords.map((word: string, i: number) => (
                  <View key={i} style={styles.negativeTag}>
                    <Text style={styles.negativeTagText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <View
          style={[styles.ctaBtn, isBuy ? styles.ctaBuy : styles.ctaNoBuy]}
        >
          <Text style={styles.ctaText}>{isBuy ? "Buy it" : "Don't buy it"}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  loadingText: {
    textAlign: "center",
    marginTop: 12,
    color: "#888780",
    fontSize: 14,
  },

  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: { color: "#A32D2D", marginBottom: 16, textAlign: "center" },
  goBackBtn: {
    backgroundColor: "#8B5E3C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  goBackText: { color: "#fff", fontWeight: "600" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },

  scroll: { paddingBottom: 120 },

  imageCard: {
    backgroundColor: "#F7F7F7",
    marginHorizontal: 16,
    borderRadius: 24,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heroImg: { width: "100%", height: "100%" },
  heroPlaceholder: { width: "100%", height: "100%", backgroundColor: "#E8E8E8" },

  content: { paddingHorizontal: 20, paddingTop: 20 },

  productName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeBuy: { backgroundColor: "#E6F4ED" },
  badgeNoBuy: { backgroundColor: "#FDECEC" },
  badgeText: { fontSize: 12, fontWeight: "600" },
  badgeTextBuy: { color: "#2C7A4B" },
  badgeTextNoBuy: { color: "#A32D2D" },
  worthScore: { fontSize: 13, color: "#888", fontWeight: "500" },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  stars: { color: "#F5A623", fontSize: 16, letterSpacing: 1 },
  ratingNum: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
  reviewCount: { fontSize: 13, color: "#999" },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },

  summary: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
  },

  demoRow: { marginBottom: 20 },
  demoBox: {
    backgroundColor: "#F7F3EF",
    borderRadius: 14,
    padding: 14,
  },
  demoLabel: { fontSize: 12, color: "#888", marginBottom: 6 },
  demoStarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  demoStars: { color: "#8B5E3C", fontSize: 18, letterSpacing: 1 },
  demoNum: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },

  keywordSection: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  positiveTag: {
    backgroundColor: "#E6F4ED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  positiveTagText: { fontSize: 13, color: "#2C7A4B", fontWeight: "500" },
  negativeTag: {
    backgroundColor: "#FDECEC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  negativeTagText: { fontSize: 13, color: "#A32D2D", fontWeight: "500" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  ctaBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaBuy: { backgroundColor: "#8B5E3C" },
  ctaNoBuy: { backgroundColor: "#A32D2D" },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
