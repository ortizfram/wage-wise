import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";

const splashScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default splashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#06bcee",
  },
});
