// src/components/profile/MenuItem.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  AuthThemeType,
  Colors,
  FontSizes,
} from "../../../src/constants/colors";

export default function MenuItem({
  icon,
  label,
  onPress,
  T,
  isDark,
  isLast = false,
  rightContent,
  destructive = false,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
  T: AuthThemeType;
  isDark: boolean;
  isLast?: boolean;
  rightContent?: React.ReactNode;
  destructive?: boolean;
}) {
  const dividerColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: dividerColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: destructive
              ? `${Colors.error}18`
              : isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={18}
          color={destructive ? Colors.error : T.inputIcon}
        />
      </View>
      <Text
        style={[
          styles.menuLabel,
          { color: destructive ? Colors.error : T.inputText },
        ]}
      >
        {label}
      </Text>
      {rightContent ?? (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={destructive ? Colors.error : T.inputPlaceholder}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: "500",
  },
});
