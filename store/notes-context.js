import { colors } from "../constants/colors";

const { createContext, useReducer } = require("react");

export const NOTES = [
  {
    id: 0,
    title: "Travel",
    description:
      "SKYLA Service Apartments, Hi-Tech City, Plot No 3, Street No 1, Patrika Nagar, Madhapur, Hyderabad - 500081, Telangana",
    color: colors.noteColorOneLight,
    border: colors.noteColorOne,
    lastUpdated: new Date("2022-08-01").toString(),
  },
  {
    id: 1,
    title: "XPO Logistics",
    description: "pushkar.kastoori@xpo.com Jul@1708",
    color: colors.noteColorTwoLight,
    border: colors.noteColorTwo,
    lastUpdated: new Date("2022-08-03").toString(),
  },
  {
    id: 3,
    title: "Learn react",
    description: "pushkar.kastoori@xpo.com Jul@1708",
    color: colors.noteColorTwoLight,
    border: colors.noteColorTwo,
    lastUpdated: new Date("2022-08-03").toString(),
  },
  {
    id: 4,
    title: "Learn react native",
    description: "pushkar.kastoori@xpo.com Jul@1708",
    color: colors.noteColorTwoLight,
    border: colors.noteColorTwo,
    lastUpdated: new Date("2022-08-03").toString(),
  },
  {
    id: 5,
    title: "Read a book",
    description: "pushkar.kastoori@xpo.com Jul@1708",
    color: colors.noteColorTwoLight,
    border: colors.noteColorTwo,
    lastUpdated: new Date("2022-08-03").toString(),
  },
];

export const NotesContext = createContext({
  notes: [],
  addNote: ({ title, description, color }) => {},
  updateNote: (id, { title, description, color }) => {},
  deleteNote: (id) => {},
});

function notesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      console.log("adding note");
      const id = state.length + 1;
      return [{ ...action.payload, id: id }, ...state];

    case "DELETE":
      console.log("delete note");
      return state.filter((note) => note.id !== action.payload);

    case "UPDATE":
      console.log("updating note");
      const index = state.findIndex((note) => note.id === action.payload.id);
      const noteToUpdate = state[index];
      const updatedNote = { ...noteToUpdate, ...action.payload.data };
      const updatedNotes = [...state];
      updatedNotes[index] = updatedNote;
      return updatedNotes;

    default:
      return state;
  }
}

function NotesContextProvider({ children }) {
  const [notesState, dispatch] = useReducer(notesReducer, NOTES);

  function addNote(noteData) {
    dispatch({ type: "ADD", payload: noteData });
  }

  function updateNote(id, noteData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: noteData } });
  }

  function deleteNote(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  const value = {
    notes: notesState,
    addNote: addNote,
    updateNote: updateNote,
    deleteNote: deleteNote,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export default NotesContextProvider;
