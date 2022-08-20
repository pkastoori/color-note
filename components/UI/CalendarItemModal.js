import { StyleSheet, Text, View, Modal } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import IconButton from "./IconButton";
import NoteList from "../Notes/NoteList";

const CalendarItemModal = ({ visible, selectedDate, onPress, notes }) => {
  const navigation = useNavigation();
  return (
    <Modal animationType="slide" visible={visible} transparent={true}>
      <View style={styles.modalView}>
        <Text style={styles.selectedDate}>
          {new Date(selectedDate).toDateString()}
        </Text>
        <IconButton
          icon="remove-circle"
          color="black"
          size={26}
          onPress={onPress}
        />
        <NoteList notes={notes} />
        <IconButton
          icon="create"
          color="black"
          size={26}
          onPress={() =>
            navigation.navigate("AddNote", {
              add: true,
              calendar: true,
              calendarDate: new Date(selectedDate).toString(),
            })
          }
        />
      </View>
    </Modal>
  );
};

export default CalendarItemModal;

const styles = StyleSheet.create({
  modalView: {
    marginTop: 150,
    paddingHorizontal: 5,
    alignItems: "center",
    backgroundColor: "white",
    alignSelf: "center",
    width: 350,
  },
  selectedDate: {
    fontFamily: "bold",
    fontSize: 18,
    margin: 10,
  },
});
