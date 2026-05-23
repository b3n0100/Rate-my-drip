import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const [review, setReview] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.label}>Add a review</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your outfit review..."
          placeholderTextColor="#888780"
          value={review}
          onChangeText={setReview}
          multiline
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Post Review</Text>
        </TouchableOpacity>
      </View>

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
  container: { flex: 1, padding: 20, paddingBottom: 100 },
  title: { fontSize: 32, fontWeight: "bold", color: "#2C2C2A", marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "600", color: "#2C2C2A", marginBottom: 8 },
  input: {
    minHeight: 120,
    backgroundColor: "#EDE8E2",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    color: "#2C2C2A",
    textAlignVertical: "top",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#8B5E3C",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: { color: "#F5F0EB", fontWeight: "700" },
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