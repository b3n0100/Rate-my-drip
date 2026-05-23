import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://127.0.0.1:5000";

export default function ProductScreen() {
  const { id, age } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
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

  if (loading)
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          size="large"
          color="#8B5E3C"
          style={{ marginTop: 100 }}
        />

        <Text style={styles.loadingText}>Analyzing reviews...</Text>
      </SafeAreaView>
    );

  if (error)
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

  const isBuy = data.verdict === "buy";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Product Details</Text>

          <View style={styles.backBtn} />
        </View>

        {/* Product Image Placeholder */}
        <View style={styles.heroImg} />

        {/* Verdict */}
        <View
          style={[
            styles.verdict,
            {
              backgroundColor: isBuy ? "#2C7A4B" : "#A32D2D",
            },
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

            <Text style={styles.ratingNum}>{data.predicted_rating} / 5.0</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.worthiness_score}</Text>

              <Text style={styles.statLabel}>Worthiness Score</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.reviews_analyzed}</Text>

              <Text style={styles.statLabel}>Reviews Analyzed</Text>
            </View>
          </View>

          {/* Summary */}
          {data.summary ? (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>
                Why people your age like it
              </Text>

              <Text style={styles.summaryText}>{data.summary}</Text>
            </View>
          ) : null}

          {/* Positive Keywords */}
          {data.positive_keywords?.length > 0 && (
            <View style={styles.keywordSection}>
              <Text style={styles.sectionTitle}>Popular mentions</Text>

              <View style={styles.tagContainer}>
                {data.positive_keywords.map((word: string, index: number) => (
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
                {data.negative_keywords.map((word: string, index: number) => (
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
  safe: {
    flex: 1,
    backgroundColor: "#F5F0EB",
  },

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

  errorText: {
    fontSize: 16,
    color: "#A32D2D",
    marginBottom: 16,
    textAlign: "center",
  },

  goBackBtn: {
    backgroundColor: "#8B5E3C",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  goBackText: {
    color: "#F5F0EB",
    fontWeight: "500",
    fontSize: 14,
  },

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

  backIcon: {
    fontSize: 18,
    color: "#2C2C2A",
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2C2C2A",
  },

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

  verdictIcon: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "500",
  },

  verdictText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },

  verdictSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },

  content: {
    padding: 16,
  },

  productName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#2C2C2A",
    marginBottom: 8,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  stars: {
    fontSize: 16,
    color: "#8B5E3C",
  },

  ratingNum: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C2C2A",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#EDE8E2",
    borderRadius: 14,
    padding: 16,
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
    marginTop: 4,
    textAlign: "center",
  },

  summaryBox: {
    backgroundColor: "#EDE8E2",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C2C2A",
    marginBottom: 8,
  },

  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
  },

  keywordSection: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C2C2A",
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
    marginRight: 8,
    marginBottom: 8,
  },

  negativeTag: {
    backgroundColor: "#F8D7DA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 13,
    color: "#2C2C2A",
    fontWeight: "500",
  },
});
