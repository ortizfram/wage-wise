import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const bePartSent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emojiText}>📫 Solicitud enviada! 📫</Text>
      <Text style={styles.messageText}>
        Espera a recibir el correo de aceptación del dueño para acceder a la plataforma y poder marcar.
      </Text>
      <Text style={styles.noteText}>(Ir a marcar mi ingreso)</Text>
    </View>
  );
};

export default bePartSent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  emojiText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  noteText: {
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
