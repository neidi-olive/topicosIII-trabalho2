import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const CheckBox = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => setIsChecked(previousState => !previousState);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.title} >{isChecked ? "Receita" : "Despesa"}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isChecked ? "#2ecc71" : "#e74c3c"}
        onValueChange={toggleSwitch}
        value={isChecked}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "300",
    color: "#7c7c8a",
  },
})

export default CheckBox;
