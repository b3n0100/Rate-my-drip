import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Rate My Drip</Text>
      <Text style={{ marginTop: 10 }}>Upload your fit. Get rated.</Text>
    </View>
  );
}