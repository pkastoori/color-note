import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import CalendarItemModal from "../components/UI/CalendarItemModal";
import { style, theme } from "../constants/calendar";
import { Ionicons } from "@expo/vector-icons";
import { fetchCalendarNotes, fetchMarkings } from "../utils/calendarNoteDB";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NoteCalendar = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [notes, setNotes] = useState([]);

  const [markings, setMarkings] = useState([]);
  const [monthRecords, setMonthRecords] = useState([]);

  let month;

  async function loadMarkings(currentMonth, currentYear) {
    month = currentMonth ? currentMonth : new Date().getMonth() + 1;
    year = currentYear ? currentYear : new Date().getFullYear();
    await AsyncStorage.setItem("month", month.toString());
    await AsyncStorage.setItem("year", year.toString());
    const records = await fetchMarkings(month, year);
    setMonthRecords(records);
    const markedDates = [];
    records.map((record) =>
      markedDates.push({
        day: record.mDay,
        dayColor: record.color,
        month: record.mMonth,
      })
    );
    setMarkings(markedDates);
  }

  useEffect(() => {
    navigation.addListener("blur", () => {
      setVisible(false);
      setNotes([]);
    });

    navigation.addListener("focus", async () => {
      let month = await AsyncStorage.getItem("month");
      let year = await AsyncStorage.getItem("year");
      month !== null && year !== null
        ? loadMarkings(month, year)
        : loadMarkings();
    });
  }, [navigation]);

  function closeModal() {
    setNotes([]);
    setVisible(false);
  }

  function changeMonth(month, year) {
    loadMarkings(month, year);
  }

  function selectDayHandler(state, date) {
    if (state === "disabled") {
      return;
    }
    const dayRecords = monthRecords.filter(
      (record) => record.mDay === date.day
    );
    if (dayRecords && dayRecords.length > 0) {
      dayRecords.map(async (record) => {
        const markingId = record.id;
        const note = await fetchCalendarNotes(markingId);
        setNotes((current) => [...current, note]);
      });
    } else {
      setNotes([]);
    }
    setSelectedDate(date.dateString);
    setVisible(true);
  }

  return (
    <View style={styles.container}>
      <Calendar
        enableSwipeMonths={true}
        hideExtraDays={true}
        dayComponent={({ date, state }) => {
          return (
            <View>
              <Text
                style={[
                  styles.day,
                  { color: state === "disabled" ? "gray" : "black" },
                ]}
                onPress={() => selectDayHandler(state, date)}
              >
                {date.day}
              </Text>
              <View style={styles.star}>
                {markings.map((marking) => {
                  if (
                    marking.day === date.day &&
                    marking.month === date.month
                  ) {
                    const colors = marking.dayColor.split(",");
                    return colors.map((color) => {
                      return (
                        <Ionicons
                          key={color}
                          name="star"
                          color={color}
                          size={10}
                        />
                      );
                    });
                  }
                })}
              </View>
            </View>
          );
        }}
        style={style}
        theme={theme}
        onMonthChange={(date) => changeMonth(date.month, date.year)}
      />
      <CalendarItemModal
        visible={visible}
        selectedDate={selectedDate}
        onPress={closeModal}
        notes={notes}
      />
    </View>
  );
};

export default NoteCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#eee2df",
  },
  day: {
    textAlign: "center",
    fontSize: 16,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  star: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});
