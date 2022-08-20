import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const NoteItem = ({ item }) => {
  const navigation = useNavigation();

  const displayDate = new Date(item.lastUpdated)
    .toDateString()
    .endsWith(new Date().getFullYear())
    ? new Date(item.lastUpdated).toDateString().slice(0, 10)
    : new Date(item.lastUpdated).toDateString();

  function pressHandler() {
    navigation.navigate("AddNote", {
      note: item,
    });
  }

  return (
    <Pressable
      onPress={pressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View
        style={[
          styles.listView,
          {
            backgroundColor: item.border,
            borderLeftColor: item.color,
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.noteDate}>{displayDate}</Text>
      </View>
    </Pressable>
  );
};

export default NoteItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  listView: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderLeftWidth: 10,
    height: 55,
  },
  title: {
    fontSize: 18,
    width: "75%",
    fontFamily: "bold",
  },
  noteDate: {
    fontSize: 14,
    width: "25%",
    fontFamily: "medium",
  },
});
