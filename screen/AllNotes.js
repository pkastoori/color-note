import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import NoteList from "../components/Notes/NoteList";
import { fetchNotes } from "../utils/noteDB";

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadNotes() {
      const notes = await fetchNotes();
      setNotes(notes);
    }
    if (isFocused) {
      loadNotes();
    }
  }, [isFocused]);

  return <NoteList notes={notes} />;
};

export default AllNotes;
