import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";
import { RESP_URL } from "../config";

export default function QRCodeScanner({ userId }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request camera permission when the component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    console.log("hasPermission ", hasPermission);
  }, [hasPermission]);

  // This function handles the QR code scan
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    const oid = data; // Assuming the QR code contains just the `oid`

    try {
      // Send request to backend to associate user with organization
      await axios.post(`${RESP_URL}/api/organization/${oid}/bePart`, {
        uid: userId,
      });

      alert("You have successfully joined the organization");
    } catch (error) {
      console.error("Error joining organization:", error);
      alert("Failed to join organization");
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ flex: 1 }}
          barCodeScannerSettings={{
            barCodeTypes: [Camera.Constants.BarCodeType.qr], // To limit to QR codes
          }}
        />
      )}
      {scanned && <Text>Scan again to join another organization</Text>}
    </View>
  );
}
