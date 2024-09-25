import React, { useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const Item = React.memo(({ item, onItemClick }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.computedDetails}</Text>
      <Button title="View Details" onPress={() => onItemClick(item.id)} />
    </View>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: "#f9c2ff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Item;
