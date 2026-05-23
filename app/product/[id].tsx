import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const MOCK_ITEMS = [
  {
    id: "767",
    name: "Linen Wrap Top",
    rating: 4.8,
    category: "Tops",
    image: require("../../assets/images/clothes/top.jpg"),
  },
  {
    id: "1080",
    name: "Floral Midi Dress",
    rating: 4.6,
    category: "Dresses",
    image: require("../../assets/images/clothes/Midi Floral dress.jpg"),
  },
  {
    id: "1077",
    name: "Tan Blazer",
    rating: 4.5,
    category: "Jackets",
    image: require("../../assets/images/clothes/Brown Blazer.png"),
  },
  {
    id: "872",
    name: "High Rise Jeans",
    rating: 4.3,
    category: "Bottoms",
    image: require("../../assets/images/clothes/pants.jpg"),
  },
];

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id, age } = useLocalSearchParams();

  const item = MOCK_ITEMS.find((product) => product.id === id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {item?.image ? (
  <Image source={item.image} style={styles.imageBox} resizeMode="cover" />
) : (
  <View style={styles.imageBox} />
)}
        <Text style={styles.title}>
          {item ? item.name : "Clothing Item"}
        </Text>

        <Text style={styles.info}>
          Category: {item ? item.category : "Unknown"}
        </Text>

        <Text style={styles.info}>
          Rating: {item ? item.rating : "N/A"} ★
        </Text>

        <Text style={styles.info}>
          StyleMatch Age: {age}
        </Text>

        <Text style={styles.description}>
          This page will later show more details, reviews, outfit suggestions,
          and AI-powered style matching.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F0EB" },
  container: { flex: 1, padding: 20 },
  backText: {
    fontSize: 16,
    color: "#8B5E3C",
    fontWeight: "700",
    marginBottom: 20,
  },
  imageBox: {
  height: 260,
  width: "100%",
  borderRadius: 20,
  marginBottom: 20,
},
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2C2C2A",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: "#5F5E5A",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#2C2C2A",
    lineHeight: 22,
    marginTop: 18,
  },
});