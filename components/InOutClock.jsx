import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const InOutClock = () => {
  return (
    <View style={styles.container}>
      <Text>Ingreso and Egreso actions available:</Text>
      <Pressable style={styles.actionBtn}>
        <Text
          style={styles.actionText}
          onPress={() => {
            // Handle Ingreso action
            console.log("Handle Ingreso action");
          }}
        >
          Ingreso
        </Text>
      </Pressable>
      <Pressable style={styles.actionBtn}>
        <Text
          style={styles.actionText}
          onPress={() => {
            // Handle Egreso action
            console.log("Handle Egreso action");
          }}
        >
          Egreso
        </Text>
      </Pressable>
    </View>
  );
};

export default InOutClock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 16,
  },
  actionBtn: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
  },
});
