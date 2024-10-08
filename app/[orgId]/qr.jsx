import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';

const Qr = () => {
  const { orgId } = useLocalSearchParams(); // Get the orgId from params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code for Organization</Text>
      {orgId && (
        <QRCode
          value={orgId} // Generate QR code based on orgId
          size={200}
        />
      )}
      <Text>{orgId}</Text>
    </View>
  );
};

export default Qr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
