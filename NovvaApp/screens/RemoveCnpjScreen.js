import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';

const RemoveCnpjScreen = ({ navigation, route }) => {
  const userId = route.params?.cpf || null;
  const [cnpj, setCnpj] = useState('');
  const [cnpjList, setCnpjList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (userId) loadCnpjs();
  }, [userId]);

  const loadCnpjs = async () => {
    const cnpjRef = firestore().collection('tomador').doc(userId).collection('CNPJ dos tomadores');
    const snapshot = await cnpjRef.get();
    const cnpjs = snapshot.docs.map(doc => ({
      cnpj: doc.data().cnpj,
      apelido: doc.data().apelido || 'Sem Apelido',
    }));
    setCnpjList(cnpjs);
  };

  const selectCnpj = (selectedCnpj) => {
    setCnpj(selectedCnpj);
    setModalVisible(false);
  };

  const removerCnpj = async () => {
    if (!cnpj) {
      Toast.show({ type: 'error', text1: 'CNPJ não pode estar vazio' });
      return;
    }

    setButtonDisabled(true);
    const cnpjRef = firestore().collection('tomador').doc(userId).collection('CNPJ dos tomadores');
    const snapshot = await cnpjRef.where('cnpj', '==', cnpj).get();

    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
      Toast.show({ type: 'success', text1: 'CNPJ removido com sucesso' });
      setCnpj('');
      loadCnpjs();
    } else {
      Toast.show({ type: 'error', text1: 'CNPJ não encontrado' });
    }

    setTimeout(() => {
      setButtonDisabled(false);
      navigation.navigate('ConfigCnpjScreen', { cpf: userId });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite ou selecione o CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
      />
      <Button title="Selecionar CNPJ" onPress={() => setModalVisible(true)} />
      <Button
        title="Remover CNPJ"
        onPress={removerCnpj}
        disabled={buttonDisabled}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {cnpjList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalButton}
                  onPress={() => selectCnpj(item.cnpj)}
                >
                  <Text style={styles.modalButtonText}>{`${item.cnpj} - ${item.apelido}`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' },
  modalButton: { backgroundColor: '#3399ff', padding: 10, marginVertical: 5, borderRadius: 5 },
  modalButtonText: { color: '#fff', textAlign: 'center' },
});

export default RemoveCnpjScreen;