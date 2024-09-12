import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

const UploadFile = () => {
  const [doc, setDoc] = useState();
  const [docTitle, setDocTitle] = useState(""); // Estado para el título personalizado

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    }).then((response) => {
      if (response.type === "success") {
        let { name, size, uri } = response;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        console.log(fileToUpload, "...............file");
        setDoc(fileToUpload);
      }
    });
  };

  // Log `doc` after it has been set
  useEffect(() => {
    if (doc) {
      console.log("Doc: " + doc.uri);
    }
  }, [doc]);

  const postDocument = () => {
    if (!doc) {
      alert("Primero seleccione un documento.");
      return;
    }

    const url = "http://localhost:8000/upload";
    const formData = new FormData();

    // Append the document
    formData.append("document", {
      uri: doc.uri,
      name: docTitle || doc.name, // Use custom title if provided
      type: doc.type,
    });

    const options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sube su documento</Text>
        <Text style={styles.subtitle}>
          Por favor seleccione y suba de a un documento o foto y asigne un
          nombre a este
        </Text>

        <View style={styles.gridContainer}>
          <Pressable style={styles.gridItem} onPress={pickDocument}>
            <Text style={styles.gridText}>1. Seleccionar documento</Text>
          </Pressable>

          {/* Input para el título personalizado del documento */}
          <TextInput
            style={[styles.gridItem, styles.input]}
            placeholder="2. Escribe aquí el título del documento"
            value={docTitle}
            onChangeText={setDocTitle}
            placeholderTextColor="#555"
          />

          <Pressable style={styles.gridItem} onPress={postDocument}>
            <Text style={styles.gridText}>3. Aceptar y Subir</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Hace que el contenido sea scrollable
    justifyContent: "center", // Centra verticalmente cuando no hay suficiente contenido
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    opacity: 0.7,
    backgroundColor: "#ddd",
    textAlign: "center",
    textAlignVertical: "center",
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "90%",
    height: 120,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gridText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default UploadFile;
