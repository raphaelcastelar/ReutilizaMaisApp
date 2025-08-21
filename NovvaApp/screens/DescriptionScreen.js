import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { db } from '../firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

const DescriptionScreen = ({ navigation, route }) => {
  const { municipio, cnpj, data, valor, codigoTributacao, cpf, userName } = route.params;
  const [descricaoServico, setDescricaoServico] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const maxLength = 200;

  const validarTamanhoTexto = (text) => {
    if (text.length > maxLength) {
      setDescricaoServico(text.slice(0, maxLength));
      Toast.show({ type: 'error', text1: 'Limite de caracteres atingido' });
    } else {
      setDescricaoServico(text);
    }
  };

  const solicitarEmissao = async () => {
    if (!municipio || !cnpj || !data || !valor || !codigoTributacao || !descricaoServico) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos obrigatórios' });
      return;
    }

    setButtonDisabled(true);

    const horarioEmissao = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      const docRef = await addDoc(collection(db, 'servicos', cpf, 'notas'), {
        municipio,
        cnpj,
        data,
        valor,
        codigo_tributacao: codigoTributacao,
        descricao_servico: descricaoServico,
        horario_emissao: horarioEmissao,
      });

      Toast.show({ type: 'success', text1: 'Nota fiscal emitida com sucesso' });

      setDescricaoServico('');

      setTimeout(() => {
        setButtonDisabled(false);
        navigation.navigate('HomePageScreen', { cpf, userName });

        // Limpar a NfsScreen sem afetar o userName
        const nfsScreen = navigation.getParent()?.getState()?.routes.find(r => r.name === 'NfsScreen');
        if (nfsScreen?.state?.index !== undefined) {
          navigation.navigate('NfsScreen', {
            municipio: '',
            cnpj: '',
            data: '',
            valor: '',
            codigoTributacao: '04.01.01 Medicina',
            cpf,
            userName,
          });
        }
      }, 3000);
    } catch (error) {
      console.log('Erro ao enviar dados:', error.message);
      Toast.show({ type: 'error', text1: 'Erro ao emitir nota fiscal', text2: error.message });
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
              onPress={() => navigation.navigate('NfsScreen', { cpf, userName })}
            >
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Emitir Nota Fiscal</Text>
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
          <Text style={styles.tipsTitle}>Dicas para Emitir Nota Fiscal</Text>
          <Text style={styles.tipsText}>
            • Confirme a descrição que o hospital deseja na nota fiscal.
          </Text>
          <Text style={styles.tipsText}>
            • Não achou o CNPJ desejado? Vá em serviços e escolha "Adicionar CNPJ".
          </Text>
        </View>

        {/* Card de Input */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Ionicons name="pencil-outline" size={24} color="#333" style={styles.inputIcon} />
            <Text style={styles.inputTitle}>Descrição do Serviço</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Descrição do Serviço"
            placeholderTextColor="#999"
            value={descricaoServico}
            onChangeText={validarTamanhoTexto}
            multiline
            maxLength={maxLength}
            textAlignVertical="top"
          />
          <Text
            style={[
              styles.charCounter,
              descricaoServico.length > maxLength * 0.9 && styles.charCounterWarning,
            ]}
          >
            {descricaoServico.length}/{maxLength}
          </Text>
          <TouchableOpacity
            style={[styles.submitButton, buttonDisabled && styles.submitButtonDisabled]}
            onPress={solicitarEmissao}
            disabled={buttonDisabled}
          >
            <Text style={styles.submitButtonText}>Solicitar Emissão da NFs-e</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  inputCard: {
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
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#EEE',
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  charCounter: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
  },
  charCounterWarning: {
    color: '#FF4444',
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

export default DescriptionScreen;