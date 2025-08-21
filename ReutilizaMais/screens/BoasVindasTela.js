import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const BoasVindasTela = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem vindo</Text>
      <Button title="Ir para Login" onPress={() => navigation.navigate('LoginTela')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default BoasVindasTela;