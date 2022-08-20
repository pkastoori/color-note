import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddNote from "./screen/AddNote";
import AllNotes from "./screen/AllNotes";
import Search from "./screen/Search";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./constants/colors";
import IconButton from "./components/UI/IconButton";
import { useEffect, useState } from "react";
import { init } from "./utils/noteDB";
import NoteCalendar from "./screen/NoteCalendar";
import { calendarInit } from "./utils/calendarNoteDB";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const NoteOverview = () => {
  return (
    <BottomTab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.green,
        tabBarStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.icon,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            color={tintColor}
            size={35}
            onPress={() => navigation.navigate("AddNote", { add: true })}
          />
        ),
      })}
    >
      <BottomTab.Screen
        name="AllNotes"
        component={AllNotes}
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons size={35} color={color} name="document" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={NoteCalendar}
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons size={35} color={color} name="calendar" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={Search}
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons size={35} color={color} name="search-sharp" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default function App() {
  const [dbInit, setDbInit] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    light: require("./assets/fonts/Nunito-Light.ttf"),
    medium: require("./assets/fonts/Nunito-Medium.ttf"),
    bold: require("./assets/fonts/Nunito-Bold.ttf"),
  });

  useEffect(() => {
    async function hideSplashScreen() {
      await AsyncStorage.clear();
      await SplashScreen.hideAsync();
    }

    init()
      .then(() => {
        setDbInit(true);
      })
      .catch((error) => {
        console.log(error);
      });

    calendarInit()
      .then(() => {
        setAppIsReady(true);
        hideSplashScreen();
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fontsLoaded]);

  return (
    <>
      <StatusBar style="dark" />
      {fontsLoaded && (
        <NavigationContainer
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.green,
          }}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="NoteOverview"
              component={NoteOverview}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddNote"
              component={AddNote}
              options={{
                presentation: "modal",
                title: "Add Note",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({});
