import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cpf: cpfFromParams } = route.params || {}; // Tenta obter o CPF dos parâmetros
  const [cpf, setCpf] = useState(null); // Estado para armazenar o CPF
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storedPassword, setStoredPassword] = useState(null);

  // Buscar o CPF do AsyncStorage se não estiver nos parâmetros
  useEffect(() => {
    const loadCpf = async () => {
      try {
        if (cpfFromParams) {
          setCpf(cpfFromParams);
        } else {
          const storedCpf = await AsyncStorage.getItem('cpf');
          if (storedCpf) {
            setCpf(storedCpf);
          } else {
            Alert.alert('Erro', 'CPF não encontrado. Por favor, faça login novamente.', [
              { text: 'OK', onPress: () => navigation.navigate('CpfScreen') },
            ]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar CPF do AsyncStorage:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário. Tente novamente.');
      }
    };

    loadCpf();
  }, [cpfFromParams, navigation]);

  // Buscar a senha atual no Firestore usando o CPF
  useEffect(() => {
    const fetchCurrentPassword = async () => {
      if (!cpf) return; // Só prosseguir se o CPF estiver disponível

      try {
        const preCadastroRef = doc(db, 'pre_cadastro', cpf);
        const preCadastroSnap = await getDoc(preCadastroRef);
        if (preCadastroSnap.exists()) {
          const data = preCadastroSnap.data();
          setStoredPassword(data.senha);
        } else {
          Alert.alert('Erro', 'Usuário não encontrado na base de dados.', [
            { text: 'OK', onPress: () => navigation.navigate('CpfScreen') },
          ]);
        }
      } catch (error) {
        console.error('Erro ao buscar senha atual:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário. Tente novamente.');
      }
    };

    fetchCurrentPassword();
  }, [cpf, navigation]);

  // Função para validar e redefinir a senha
  const handleResetPassword = async () => {
    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (currentPassword !== storedPassword) {
      Alert.alert('Erro', 'A senha atual está incorreta. Por favor, verifique.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem. Por favor, verifique.');
      return;
    }

    if (!cpf) {
      Alert.alert('Erro', 'CPF não encontrado. Por favor, faça login novamente.', [
        { text: 'OK', onPress: () => navigation.navigate('CpfScreen') },
      ]);
      return;
    }

    setLoading(true);

    try {
      const preCadastroRef = doc(db, 'pre_cadastro', cpf);
      await updateDoc(preCadastroRef, {
        senha: newPassword,
      });
      Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      Alert.alert('Erro', 'Não foi possível redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Exibir mensagem de carregamento enquanto busca o CPF e a senha atual
  if (!cpf || storedPassword === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados do usuário...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Redefinir Senha</Text>
        </View>

        {/* Formulário */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Altere sua senha</Text>
          <Text style={styles.sectionSubtitle}>
            Insira sua senha atual, a nova senha e confirme para redefinir.
          </Text>

          {/* Campo: Senha Atual */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons
                name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* Campo: Nova Senha */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* Campo: Confirmar Senha */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* Botão de Enviar */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A9C7F7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResetPasswordScreen;