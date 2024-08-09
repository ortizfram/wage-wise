import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useContext } from "react";
import "react-native-reanimated";

import { AuthContext, AuthProvider } from "../context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

function Layout() {
  const { userInfo, splashLoading } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo == null) {
      router.push("/auth/login");
    }
  }, [splashLoading, userInfo]);

  return (
    <Stack>
      {splashLoading ? (
        <Stack.Screen name="splashScreen" options={{ headerShown: false }} />
      ) : userInfo?.token ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        </>
      )}

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
