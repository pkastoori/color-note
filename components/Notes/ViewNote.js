import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import { deleteCaledarNote, deleteMarking } from "../../utils/calendarNoteDB";
import { deleteNote } from "../../utils/noteDB";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../UI/IconButton";

const ViewNote = ({ onPress, markingId, editedNoteId, input }) => {
  const navigation = useNavigation();

  async function handleDelete() {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "No",
        },
        {
          text: "Yes",
          onPress: async () => {
            if (markingId) {
              await deleteCaledarNote(markingId);
              await deleteMarking(markingId);
              navigation.navigate("Calendar");
            } else {
              await deleteNote(editedNoteId);
              navigation.navigate("AllNotes");
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  return (
    <>
      <View style={styles.titleContainer}>
        <>
          <Text style={styles.title}>{input.title}</Text>
          <IconButton icon="create" color="black" size={30} onPress={onPress} />
          <IconButton
            icon="trash"
            color="black"
            size={30}
            onPress={() => {
              handleDelete();
            }}
          />
        </>
      </View>

      <Text style={styles.lastUpdateDate}>
        {new Date(input.lastUpdated).toISOString().slice(0, 10)}
      </Text>

      <>
        <ScrollView style={styles.description}>
          <Text style={styles.descriptionText}>{input.description}</Text>
        </ScrollView>
      </>
    </>
  );
};

export default ViewNote;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },
  title: {
    borderColor: "black",
    width: 250,
    padding: 10,
    fontSize: 22,
    color: colors.text,
    fontFamily: "bold",
  },
  description: {
    margin: 20,
  },
  descriptionText: {
    fontSize: 20,
    fontFamily: "medium",
  },
  lastUpdateDate: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "medium",
  },
});
