import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { RESP_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();

  const updateUserInfo = (updatedUser) => {
    setUserInfo((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user, // Preserve other fields in userInfo.user
        ...updatedUser,    // Merge updated fields from the response
      },
    }));
  };
  

  const register = async (email, password) => {
    console.log("Handling signup");
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${RESP_URL}/api/users/register`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 201) {
        let userInfo = res.data;
        console.log(userInfo);
        setUserInfo(userInfo);
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        router.push("/");
      } else {
        console.log("Unexpected status code:", res.status);
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Response error:", error.response.data);
          if (error.response.status === 409) {
            alert("User already exists");
          } else if (error.response.status === 400) {
            alert("All fields are required");
          } else {
            alert("Error signing up");
          }
        } else {
          alert("Error signing up");
        }
      } else {
        alert("Error signing up");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      console.log("Sending login request");
      const res = await axios.post(
        `${RESP_URL}/api/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        console.log("Response received, setting token");
        let userInfo = res.data;
        console.log(userInfo);
        setUserInfo(userInfo);
        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        setIsLoading(false);
        router.push("/");
      }
    } catch (error) {
      setIsLoading(false);
      let errorMessage = "An unexpected error occurred";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage =
              "Invalid credentials. Please check your email and password.";
          } else {
            errorMessage = error.response.data.message || errorMessage;
          }
        } else if (error.request) {
          errorMessage = "No response from the server. Please try again later.";
        }
      }

      alert(errorMessage); // Display the error message as an alert
      console.log(`login error: ${error}`);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Sending logout request");
      await axios
        .post(`${RESP_URL}/api/users/logout`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            AsyncStorage.removeItem("userInfo");
            setUserInfo({});
            setIsLoading(false);
            alert("Logged out");
            router.push("/auth/login");
          }
        })
        .catch((e) => {
          console.log(`logout error: ${e}`);
          setIsLoading(false);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Error loggin out: ${error.response.data.message}`);
          console.log("Error response data:", error.response.data.message);
        }
      }
    }
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        register,
        updateUserInfo,
        login,
        logout,
        isLoading,
        userInfo,
        splashLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
