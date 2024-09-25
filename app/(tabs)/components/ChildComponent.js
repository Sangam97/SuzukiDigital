import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";

const ChildComponent = React.memo(({ itemId, onClose }) => {
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `http://jsonplaceholder.typicode.com/posts/${itemId}`
        );
        setItemDetails(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (!itemDetails) return null;

  return (
    <View style={styles.childContainer}>
      <Text style={styles.title}>{itemDetails.title}</Text>
      <Text>{itemDetails.body}</Text>
      <Button title="Close" onPress={onClose} />
    </View>
  );
});

const styles = StyleSheet.create({
  childContainer: {
    padding: 20,
    backgroundColor: "#e0f7fa",
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChildComponent;
