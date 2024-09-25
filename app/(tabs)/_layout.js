// App.js

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { View, FlatList, StyleSheet, Alert, LogBox } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import axios from "axios";
import ChildComponent from "./components/ChildComponent";
import Counter from "./components/Counter";
import Item from "./components/Item";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function _layout() {
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState(0);
  const [page, setPage] = useState(1);
  const [showChild, setShowChild] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  LogBox.ignoreAllLogs();
  useEffect(() => {
    registerForPushNotificationsAsync();

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await scheduleNotification("FETCHING DATA");
      try {
        const response = await axios.get(
          `http://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
        );
        const result = response.data;

        setData((prevData) => [...prevData, ...result]);
        await scheduleNotification("FETCHING DATA COMPLETE");
      } catch (error) {
        console.error("Error in API call:", error);
        Alert.alert(
          "Error",
          "Could not fetch data. Please check your connection and try again."
        );
      }
    };

    fetchData();
  }, [page]);

  const scheduleNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message,
        body: message,
      },
      trigger: null,
    });
  };

  const heavyComputation = (item) => {
    const start = performance.now();
    const computedData = `Computed details for ${item.title}`;
    const end = performance.now();
    console.log(`Computation time: ${end - start}ms`);
    return computedData;
  };

  const memoizedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      computedDetails: heavyComputation(item),
    }));
  }, [data]);

  const handleItemClick = useCallback((itemId) => {
    setShowChild(itemId);
  }, []);

  const closeChildComponent = () => {
    setShowChild(null);
  };

  return (
    <View style={styles.container}>
      {showChild ? (
        <ChildComponent itemId={showChild} onClose={closeChildComponent} />
      ) : (
        <>
          <Counter counter={counter} setCounter={setCounter} />
          <FlatList
            data={memoizedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Item item={item} onItemClick={handleItemClick} />
            )}
            onEndReached={() => setPage((prev) => prev + 1)}
            onEndReachedThreshold={0.5}
          />
        </>
      )}
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
