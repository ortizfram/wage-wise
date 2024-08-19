import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { Link } from "expo-router";

const Login = () => {
  const { login, isLoading } = useContext(AuthContext);
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
      <Text style={styles.appname}>WAGE WISE</Text>
      <Text style={styles.header}>Login</Text>
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null} {/* Display error if exists */}

      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.textButton}>Login</Text>
      </Pressable>
      <Pressable style={styles.link}>
        <Link href="/auth/signup">
          <Text style={{ color: "blue" }}>I don't have an account yet</Text>
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
    padding: 20,
    backgroundColor: "blue",
  },
  textButton: {
    color: "#e3e3e3",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});
