// QRScannerPage.jsx

import React from "react";
import QRCodeScanner from "../utils/QRCodeScanner"; // Correct path to the component
import { useLocalSearchParams } from "expo-router";

export default function QRScannerPage() {
  const { userId } = useLocalSearchParams();

  return <QRCodeScanner userId={userId} />;
}
