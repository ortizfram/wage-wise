import { Tabs } from "expo-router";
import React from "react";

export default function OrgDetailLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown:false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown:false,
        }}
      />
    </Tabs>
  );
}
