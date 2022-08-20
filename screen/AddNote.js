import { useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import ViewNote from "../components/Notes/ViewNote";
import IconButton from "../components/UI/IconButton";
import ItemModal from "../components/UI/ItemModal";
import { colors } from "../constants/colors";
import {
  insertMarking,
  insertCalendarNote,
  updateCalendarNote,
  updateMarking,
} from "../utils/calendarNoteDB";
import { insertNote, updateNote } from "../utils/noteDB";

const AddNote = ({ route, navigation }) => {
  const note = route.params?.note;
  const editedNoteId = note?.id;
  const isAdding = route.params?.add ? true : false;

  const calendar = route.params.calendar ? true : false;
  const calendarDate = route.params?.calendarDate;
  const markingId = route.params?.note?.markingId;

  let selectedNote;

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!isAdding) {
    selectedNote = note;
  }

  const [input, setInput] = useState({
    title: selectedNote ? selectedNote.title : "",
    description: selectedNote ? selectedNote.description : "",
    color: selectedNote ? selectedNote.color : colors.noteDefaultLight,
    border: selectedNote ? selectedNote.border : colors.noteDefault,
    lastUpdated: selectedNote
      ? selectedNote.lastUpdated
      : calendar
      ? calendarDate
      : new Date(),
  });

  function editNote() {
    setIsEditing(!isEditing);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing && !isAdding ? "Edit Note" : "Note",
    });
  }, [navigation, isEditing, isAdding]);

  function onChangeHandler(inputIdentifier, enteredText) {
    setInput((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: enteredText,
        lastUpdated: calendar ? calendarDate : new Date().toString(),
      };
    });
  }

  function modalHandler(color, colorLight) {
    if (color && colorLight) {
      setInput((currentInputs) => {
        return {
          ...currentInputs,
          color: color,
          border: colorLight,
        };
      });
    }
    setModalVisible(false);
  }

  async function submitNote() {
    if (
      input.title.trim().length === 0 ||
      input.description.trim().length === 0
    ) {
      Alert.alert("Invalid Input", "Please provide correct inputs");
      return;
    }

    if (calendar) {
      const result = await insertMarking({
        mDate: calendarDate,
        mYear: new Date(calendarDate).getFullYear(),
        mMonth: new Date(calendarDate).getMonth() + 1,
        mDay: new Date(calendarDate).getDate(),
        border: input.border,
      });
      const markingId = result.insertId;
      await insertCalendarNote(markingId, input);
      navigation.navigate("Calendar");
      ToastAndroid.show("Note Added", ToastAndroid.LONG);
    } else if (markingId) {
      await updateCalendarNote(editedNoteId, input);
      await updateMarking(markingId, input);
      navigation.navigate("Calendar");
      ToastAndroid.show("Note Updated", ToastAndroid.LONG);
    } else {
      if (isEditing) {
        await updateNote(editedNoteId, input);
        ToastAndroid.show("Note Updated", ToastAndroid.LONG);
      } else {
        await insertNote(input);
        ToastAndroid.show("Note Added", ToastAndroid.LONG);
      }
      navigation.navigate("AllNotes");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: input.color }}>
      {isEditing || isAdding ? (
        <>
          <View style={styles.titleContainer}>
            <IconButton
              icon="checkmark"
              color={colors.black}
              size={30}
              onPress={submitNote}
            />

            <>
              <TextInput
                style={[styles.title, { borderWidth: 1 }]}
                value={input.title}
                onChangeText={onChangeHandler.bind(this, "title")}
                selectionColor="black"
              />
              <IconButton
                icon="square"
                color={input.border}
                size={30}
                onPress={() => setModalVisible(true)}
              />
            </>
          </View>

          <View>
            <ItemModal
              modalVisible={modalVisible}
              modalHandler={modalHandler}
            />
          </View>
          <Text style={styles.lastUpdateDate}>
            {new Date(input.lastUpdated).toISOString().slice(0, 10)}
          </Text>

          <ScrollView>
            <TextInput
              style={[
                styles.note,
                {
                  borderColor: input.border,
                  borderWidth: 1,
                  textAlignVertical: isAdding ? "top" : "bottom",
                },
              ]}
              multiline={true}
              selectionColor="black"
              value={input.description}
              onChangeText={onChangeHandler.bind(this, "description")}
            />
          </ScrollView>
        </>
      ) : (
        <ViewNote
          markingId={markingId}
          editedNoteId={editedNoteId}
          input={input}
          onPress={editNote}
        />
      )}
    </View>
  );
};

export default AddNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  modalView: {
    marginTop: 180,
    alignItems: "center",
    backgroundColor: "white",
    width: 350,
    alignSelf: "center",
  },
  note: {
    margin: 20,
    padding: 20,
    fontSize: 20,
    color: colors.text,
    fontFamily: "medium",
  },
  lastUpdateDate: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "medium",
  },
});
