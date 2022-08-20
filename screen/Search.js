import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import NoteList from "../components/Notes/NoteList";
import { colors } from "../constants/colors";
import { fetchNote } from "../utils/noteDB";

const Search = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function searchHandler() {
      const notes = await fetchNote(searchInput);
      setNotes(notes);
    }

    searchInput.length > 0 ? searchHandler(searchInput) : setNotes([]);

    navigation.addListener("blur", () => {
      setNotes([]);
      setSearchInput("");
    });
  }, [searchInput, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          onChangeText={(text) => setSearchInput(text)}
          value={searchInput}
          selectionColor="black"
        />
      </View>
      {notes && <NoteList notes={notes} />}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee2df",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    width: 300,
    margin: 8,
    padding: 10,
    fontSize: 20,
    fontFamily: "medium",
    color: colors.text,
    borderColor: "black",
    borderWidth: 1,
  },
});
