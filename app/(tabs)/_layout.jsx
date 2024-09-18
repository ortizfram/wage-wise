import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import OrganizationList from ".";
import Settings from "./settings";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="OrganizationList"
        component={OrganizationList}
        options={{
          title: "Organizaciones",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={"home"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          title: "Configuracion",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={"settings"} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
