import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginTela = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Tela de Login</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 20,
  },
});

export default LoginTela;