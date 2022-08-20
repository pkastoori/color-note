import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("calendar.db");

const createMarking = `CREATE TABLE IF NOT EXISTS marking (
  id INTEGER PRIMARY KEY NOT NULL,
  mDate TEXT NOT NULL,
  mYear INTEGER NOT NULL,
  mMonth INTEGER NOT NULL,
  mDay INTEGER NOT NULL,
  color TEXT NOT NULL)
`;
const dropMarking = `DROP TABLE marking`;

const createNotes = ` CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY NOT NULL,
  markingId INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  border TEXT NOT NULL,
  lastUpdated TEXT NOT NULL
)`;

const dropNotes = `DROP TABLE notes`;

export function calendarInit() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        createMarking,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
      tx.executeSql(
        createNotes,
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

export function insertMarking(marking) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO marking (mDate, mYear, mMonth, mDay, color) VALUES (?, ?, ?, ?, ?)`,
        [
          marking.mDate,
          marking.mYear,
          marking.mMonth,
          marking.mDay,
          marking.border,
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

export function updateMarking(id, marking) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE marking SET color=? WHERE id=?`,
        [marking.color, id],
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

export function deleteMarking(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM marking WHERE id = ?`,
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

export function fetchMarkings(month, year) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM marking WHERE mMonth = ? AND mYear = ?`,
        [month, year],
        (_, result) => {
          let markings = [];
          for (const item of result.rows._array) {
            markings.push(item);
          }
          resolve(markings);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function insertCalendarNote(markingId, note) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO notes (markingId, title, description, color, border, lastUpdated) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          markingId,
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

export function fetchCalendarNotes(markingId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM notes WHERE markingId = ?`,
        [markingId],
        (_, result) => {
          let notes = result.rows._array[0];
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

export function updateCalendarNote(id, note) {
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

export function deleteCaledarNote(markingId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM notes WHERE markingId = ?`,
        [markingId],
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
