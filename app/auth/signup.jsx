import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";   

const Signup = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);

  const { register, isLoading } = useContext(AuthContext) || {};
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.appname}>HORAS PLUS</Text>
      <Text style={styles.header}>Registro</Text>
      <Spinner visible={isLoading} />
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        inputMode="email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Contraseña"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstname}
        onChangeText={(text) => setFirstname(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastname}
        onChangeText={(text) => setLastname(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          register(email, password, firstname, lastname);
        }}
      >
        <Text style={styles.textButton}>Registro</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text>Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.link}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
  },
  appname: {
    fontSize: 30,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "blue",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 5,
  },
  textButton: {
    color: "#e3e3e3",
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  link: {
    color: "blue",
  },
});

export default Signup;
