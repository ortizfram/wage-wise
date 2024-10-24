import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Link } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook, isLoading } =
    useContext(AuthContext) || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Reset error before attempting to login
    try {
      await login(email, password);
    } catch (e) {
      setError(e.message); // Set error message if login fails
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appname}>HORAS PLUS</Text>
      <Text style={styles.header}>Ingreso</Text>
      <Spinner visible={isLoading} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {/* Display error if exists */}

      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.textButton}>Ingresar</Text>
      </Pressable>

      <Pressable
        onPress={loginWithGoogle}
        style={[styles.button, styles.googleButton]}
      >
        <Text style={styles.textButton}>Ingresar con Google</Text>
      </Pressable>

      <Pressable
        onPress={loginWithFacebook}
        style={[styles.button, styles.facebookButton]}
      >
        <Text style={styles.textButton}>Ingresar con Facebook</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Link href="/auth/signup">
          <Text style={{ color: "blue" }}>No tengo una cuenta aun!</Text>
        </Link>
      </Pressable>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  link: {
    marginTop: 20,
  },
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
  googleButton: {
    backgroundColor: "red",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  textButton: {
    color: "#e3e3e3",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});
