import { FlatList, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import NoteItem from "./NoteItem";

const NoteList = ({ notes }) => {
  function renderItem({ item }) {
    return <NoteItem item={item} />;
  }

  return (
    <FlatList
      style={styles.container}
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

export default NoteList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
});
