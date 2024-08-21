import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
const userInfo = useContext(AuthContext);

export default function OrgDetailLayout() {

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={"dashboard"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={"settings"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
