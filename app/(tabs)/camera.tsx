import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState("");

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>Camera Access Needed</Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>

        <BottomNav />
      </SafeAreaView>
    );
  }

  function BottomNav() {
    return (
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
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128"],
          }}
          onBarcodeScanned={
            scanned
              ? undefined
              : ({ data }) => {
                  setScanned(true);
                  setBarcodeData(data);
                }
          }
        />

        <View style={styles.resultBox}>
          <Text style={styles.title}>Barcode Scanner</Text>

          <Text style={styles.resultText}>
            {barcodeData ? `Scanned: ${barcodeData}` : "Point camera at a barcode or QR code."}
          </Text>

          {scanned && (
            <TouchableOpacity
              style={styles.permissionBtn}
              onPress={() => {
                setScanned(false);
                setBarcodeData("");
              }}
            >
              <Text style={styles.permissionText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F0EB",
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultBox: {
    backgroundColor: "#F5F0EB",
    padding: 18,
    paddingBottom: 90,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C2C2A",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 15,
    color: "#2C2C2A",
    marginBottom: 12,
  },
  permissionBtn: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  permissionText: {
    color: "#F5F0EB",
    fontWeight: "600",
  },
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
  navIcon: {
    fontSize: 20,
  },
  scanBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B5E3C",
    justifyContent: "center",
    alignItems: "center",
  },
  scanIcon: {
    fontSize: 22,
    color: "#F5F0EB",
  },
});