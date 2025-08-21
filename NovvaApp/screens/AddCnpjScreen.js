import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';

const AddCnpjScreen = ({ navigation, route }) => {
  const userId = route.params?.cpf || null;
  const [cnpj, setCnpj] = useState('');
  const [apelido, setApelido] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const adicionarCnpj = async () => {
    if (!cnpj) {
      Toast.show({ type: 'error', text1: 'CNPJ não pode estar vazio' });
      return;
    }

    setButtonDisabled(true);
    const cnpjRef = firestore().collection('tomador').doc(userId).collection('CNPJ dos tomadores');
    
    // Verifica se o CNPJ já existe
    const snapshot = await cnpjRef.where('cnpj', '==', cnpj).get();
    if (!snapshot.empty) {
      Toast.show({ type: 'error', text1: 'CNPJ já cadastrado' });
      setButtonDisabled(false);
      return;
    }

    // Adiciona o CNPJ
    await cnpjRef.add({
      cnpj: cnpj.trim(),
      apelido: apelido.trim() || 'Sem Apelido',
    });

    Toast.show({ type: 'success', text1: 'CNPJ adicionado com sucesso' });
    setCnpj('');
    setApelido('');

    setTimeout(() => {
      setButtonDisabled(false);
      navigation.navigate('ConfigCnpjScreen', { cpf: userId });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Apelido (opcional)"
        value={apelido}
        onChangeText={setApelido}
      />
      <Button
        title="Adicionar CNPJ"
        onPress={adicionarCnpj}
        disabled={buttonDisabled}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});

export default AddCnpjScreen;