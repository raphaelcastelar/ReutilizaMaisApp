import React, { useState } from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { verifyCpfAndPassword, getEmailByCpf, updatePasswordByCpf, sendNewPasswordEmail } from '../firebaseconfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PassScreen = ({ route, navigation }) => {
  const { cpf, userName } = route.params;
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento

  const authenticatePassword = async () => {
    setError(''); // Limpar erro anterior
    const cpfLimpo = cpf.replace(/\D/g, '');
    const result = await verifyCpfAndPassword(cpfLimpo, password);

    if (result === false) {
      setError('Senha incorreta');
      Toast.show({ type: 'error', text1: 'Senha incorreta' });
    } else if (result && !Array.isArray(result)) {
      // Salvar userName e cpf no AsyncStorage
      try {
        await AsyncStorage.setItem('userName', userName);
        await AsyncStorage.setItem('cpf', cpf);
      } catch (error) {
        console.error('Erro ao salvar dados no AsyncStorage:', error);
      }
      navigation.navigate('HomePageScreen', { cpf, userName });
    } else {
      setError('Usuário não encontrado');
      Toast.show({ type: 'error', text1: 'Usuário não encontrado' });
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    return Array(10) // Aumentar para 10 caracteres
      .fill()
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('');
  };

  const forgotPassword = async () => {
    setLoading(true); // Iniciar carregamento
    setError(''); // Limpar erro anterior

    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      const email = await getEmailByCpf(cpfLimpo);

      if (!email) {
        Toast.show({ type: 'error', text1: 'E-mail não encontrado' });
        setLoading(false);
        return;
      }

      const newPassword = generatePassword();
      const updated = await updatePasswordByCpf(cpfLimpo, newPassword);

      if (!updated) {
        Toast.show({ type: 'error', text1: 'Erro ao atualizar senha' });
        setLoading(false);
        return;
      }

      // Enviar e-mail com a nova senha
      await sendNewPasswordEmail(email, newPassword);
      Toast.show({ type: 'success', text1: 'Nova senha enviada ao e-mail' });
    } catch (error) {
      console.error('Erro ao recuperar senha:', error.message);
      Toast.show({ type: 'error', text1: 'Erro ao enviar e-mail', text2: error.message });
    } finally {
      setLoading(false); // Finalizar carregamento
    }
  };

  return (
    <ImageBackground source={require('./images/bg.png')} style={styles.background}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require('./images/logo.png')} style={styles.logo} />

        {/* Título "Novva" */}
        <Text style={styles.title}>Novva</Text>

        {/* Label "Informe sua senha:" */}
        <Text style={styles.label}>Informe sua senha:</Text>

        {/* Campo de senha */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={authenticatePassword}
        />

        {/* Botão com ícone */}
        <TouchableOpacity style={styles.iconButton} onPress={authenticatePassword}>
          <Icon name="chevron-right" size={30} color="#000" />
        </TouchableOpacity>

        {/* Mensagem de erro */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Botão "Esqueceu a senha?" com indicador de carregamento */}
        <TouchableOpacity onPress={forgotPassword} disabled={loading}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#000" />
              <Text style={styles.loadingText}>Enviando e-mail...</Text>
            </View>
          ) : (
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          )}
        </TouchableOpacity>

        {/* Botão e texto "Voltar" */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('CpfScreen')}>
          <Icon name="chevron-left" size={35} color="#000" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Toast />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    maxWidth: 400,
    maxHeight: 400,
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
  },
  title: {
    position: 'absolute',
    top: '40%',
    fontSize: 45,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  label: {
    position: 'absolute',
    top: '55%',
    left: '10%',
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    width: '80%',
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    top: '58%',
    right: '11%',
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    top: '59%',
    right: '14%',
  },
  error: {
    position: 'absolute',
    top: '47%',
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPassword: {
    position: 'absolute',
    top: '65%',
    fontSize: 15,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '65%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: '5%',
    left: '10%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    marginLeft: 5,
  },
});

export default PassScreen;