import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { db } from '../firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

const DocumentScreen = ({ navigation, route }) => {
  const { cpf, userName } = route.params || {};
  const [documentoNome, setDocumentoNome] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const documentos = [
    "Cópia do CNPJ", "Certidão de Regularidade", "Contrato Social", "Alteração Contratual",
    "Declaração de Imposto de Renda", "Comprovante de Endereço", "Registro na Junta Comercial",
    "Licença de Funcionamento", "Alvará de Funcionamento", "Certificado de Microempreendedor Individual (MEI)"
  ];

  const solicitarDocumento = async () => {
    if (!documentoNome) {
      Toast.show({ type: 'error', text1: 'Selecione um documento para solicitar' });
      return;
    }

    setButtonDisabled(true);
    const dataAtual = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      await addDoc(collection(db, 'servicos', cpf, 'documentos'), {
        nome_documento: documentoNome,
        data: dataAtual,
      });

      Toast.show({ type: 'success', text1: 'Documento solicitado com sucesso' });
      setDocumentoNome('');
      setTimeout(() => {
        setButtonDisabled(false);
        navigation.navigate('HomePageScreen', { cpf, userName });
      }, 3000);
    } catch (error) {
      console.log('Erro ao solicitar documento:', error.message);
      Toast.show({ type: 'error', text1: 'Erro ao solicitar documento', text2: error.message });
      setButtonDisabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('HomePageScreen', { cpf, userName })}
            >
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Documentos Constitutivos</Text>
            <View style={styles.headerRight}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('./images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Seção de Dicas */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Dicas para Solicitar Documentos</Text>
          <Text style={styles.tipsText}>• Selecione o documento desejado no menu abaixo.</Text>
          <Text style={styles.tipsText}>• Não encontrou o documento que deseja? Entre em contato com o suporte.</Text>
        </View>

        {/* Card de Formulário */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="document-outline" size={24} color="#333" style={styles.formIcon} />
            <Text style={styles.formTitle}>Solicitar Documento</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Selecione o documento"
              placeholderTextColor="#999"
              value={documentoNome}
              onChangeText={setDocumentoNome}
              editable={false}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputIcon}>
              <Ionicons name="chevron-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, buttonDisabled && styles.submitButtonDisabled]}
            onPress={solicitarDocumento}
            disabled={buttonDisabled}
          >
            <Text style={styles.submitButtonText}>Solicitar Documento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para Seleção de Documentos */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Documento</Text>
            <View style={styles.divider} />
            <ScrollView style={styles.scrollView}>
              {documentos.map((doc, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalButton}
                  onPress={() => {
                    setDocumentoNome(doc);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>{doc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Barra Inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePageScreen', { cpf, userName })}>
          <Ionicons name="home-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuModal')}>
          <Ionicons name="menu-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    top: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  formIcon: {
    marginRight: 10,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inputIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 15,
  },
  scrollView: {
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default DocumentScreen;