import { Text, View } from "react-native";

export default function CameraScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>Camera Page</Text>
      <Text>Upload or take a fit picture here.</Text>
    </View>
  );
}