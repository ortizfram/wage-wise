import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { CameraView } from "expo-camera";
import { Stack } from "expo-router";

const TestScanner = () => {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="front"
        onBarcodeScanned={({ data }) => {
          console.log("data ", data);
        }}
      />
    </SafeAreaView>
  );
};

export default TestScanner;

const styles = StyleSheet.create({});
