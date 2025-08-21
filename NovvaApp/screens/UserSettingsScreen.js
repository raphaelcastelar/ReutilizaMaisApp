import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserSettingsScreen = ({ route, navigation }) => {
  const { cpf, userName: initialUserName, email: initialEmail, onSave } = route.params;

  const [userName, setUserName] = useState(initialUserName);
  const [email, setEmail] = useState(initialEmail || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      // Verifica se houve alterações nos campos
      const hasUserNameChanged = userName !== initialUserName;
      const hasEmailChanged = email !== (initialEmail || '');
      const hasChanges = hasUserNameChanged || hasEmailChanged;

      if (!hasChanges) {
        Alert.alert('Informação', 'Nenhuma alteração foi feita.');
        navigation.goBack();
        return;
      }

      // Salva os dados na coleção 'pre_cadastro' apenas se houver alterações
      const userDocRef = doc(db, 'pre_cadastro', cpf);
      await setDoc(
        userDocRef,
        {
          nome: userName, // Corrige o nome do campo para 'name' (consistente com HomePageScreen)
          cpf: cpf,
          email: email,
        },
        { merge: true }
      );

      // Atualiza o AsyncStorage apenas se o userName foi alterado
      if (hasUserNameChanged) {
        await AsyncStorage.setItem('userName', userName);
      }

      Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');

      // Chama o callback para recarregar os dados na HomePageScreen
      if (onSave) {
        await onSave();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar dados no Firestore:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Configurações do Usuário</Text>
        <View style={styles.logoContainer}>
          <Image
            source={require('./images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          {/* Campo Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
            />
          </View>

          {/* Campo CPF (somente leitura) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={cpf}
              editable={false}
              placeholder="CPF"
              placeholderTextColor="#999"
            />
          </View>

          {/* Campo Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  disabledInput: {
    backgroundColor: '#E5E5E5',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
});

export default UserSettingsScreen;