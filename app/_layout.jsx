import { useEffect, useContext, useState } from "react";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {
  const { userInfo, splashLoading } = useContext(AuthContext) || {};
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set mounted to true when the component mounts
  }, []);

  useEffect(() => {
    if (isMounted && !userInfo?.user?._id) {
      // Only attempt to navigate after mounting
      router.push("/auth/login");
    }
  }, [userInfo, isMounted]);

  return (
    <Stack>
      {/* Protected routes */}
      {userInfo?.token ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="organization" options={{ headerShown: false }} />
        </Stack>
      ) : (
        // Authentication routes
        <Stack>
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        </Stack>
      )}

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
