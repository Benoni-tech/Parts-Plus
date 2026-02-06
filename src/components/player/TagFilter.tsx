// src/components/hymns/TagFilter.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FontSizes, Spacing } from "../../constants/colors";

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagFilter({
  availableTags,
  selectedTags,
  onTagsChange,
}: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onTagsChange([]);
  };

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter by Tags</Text>
        {selectedTags.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsList}
      >
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, isSelected && styles.tagSelected]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[styles.tagText, isSelected && styles.tagTextSelected]}
              >
                {tag}
              </Text>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#FFF"
                  style={styles.checkmark}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedTags.length > 0 && (
        <Text style={styles.resultText}>
          Showing {selectedTags.length} filter
          {selectedTags.length > 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: 12,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: "#333",
  },
  clearText: {
    fontSize: FontSizes.sm,
    color: "#9B59B6",
    fontWeight: "600",
  },
  tagsList: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 6,
  },
  tagSelected: {
    backgroundColor: "#9B59B6",
    borderColor: "#9B59B6",
  },
  tagText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: "#666",
  },
  tagTextSelected: {
    color: "#FFF",
  },
  checkmark: {
    marginLeft: -2,
  },
  resultText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
