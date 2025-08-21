import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ConfigCnpjScreen = ({ navigation, route }) => {
  const cpf = route.params?.cpf || null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuração de CNPJs</Text>
      <Button
        title="Adicionar CNPJ"
        onPress={() => navigation.navigate('AddCnpjScreen', { cpf })}
      />
      <Button
        title="Remover CNPJ"
        onPress={() => navigation.navigate('RemoveCnpjScreen', { cpf })}
      />
      <Button
        title="Voltar"
        onPress={() => navigation.navigate('HomePageScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});

export default ConfigCnpjScreen;