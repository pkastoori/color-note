import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("note.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            color TEXT NOT NULL,
            border TEXT NOT NULL,
            lastUpdated TEXT NOT NULL
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function insertNote(note) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO notes (title, description, color, border, lastUpdated) VALUES (?, ?, ?, ?, ?) `,
        [
          note.title,
          note.description,
          note.color,
          note.border,
          note.lastUpdated,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function fetchNotes() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM notes ORDER BY lastUpdated DESC`,
        [],
        (_, result) => {
          let notes = [];
          for (const item of result.rows._array) {
            notes.push(item);
          }
          resolve(notes);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function fetchNote(searchInput) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM notes WHERE title LIKE "%${searchInput}%"`,
        [],
        (_, result) => {
          const notes = result.rows._array;
          resolve(notes);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function updateNote(id, note) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE notes SET title=?, description=?, color=?, border=?, lastUpdated=? WHERE id=?`,
        [
          note.title,
          note.description,
          note.color,
          note.border,
          note.lastUpdated,
          id,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function deleteNote(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM notes WHERE id = ?`,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}
