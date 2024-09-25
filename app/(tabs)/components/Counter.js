import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const Counter = ({ counter, setCounter }) => (
  <View style={styles.counterContainer}>
    <Button title="+" onPress={() => setCounter(counter + 1)} />
    <Text style={styles.counterText}>{counter}</Text>
    <Button title="-" onPress={() => setCounter(counter - 1)} />
  </View>
);

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  counterText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});

export default Counter;
