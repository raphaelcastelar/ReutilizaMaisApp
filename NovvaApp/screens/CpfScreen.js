import React, { useState } from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { verifyCpfAndPassword } from '../firebaseconfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CpfScreen = ({ navigation }) => {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  const validarCpf = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11 || !/^\d+$/.test(cpfLimpo) || cpfLimpo === cpfLimpo[0].repeat(11)) {
      return false;
    }
    const calcularDigito = (str, peso) => {
      const soma = str.slice(0, peso - 1).split('').reduce((acc, d, i) => acc + d * (peso - i), 0);
      const resto = soma % 11;
      return resto < 2 ? '0' : String(11 - resto);
    };
    return (
      calcularDigito(cpfLimpo, 10) === cpfLimpo[9] &&
      calcularDigito(cpfLimpo, 11) === cpfLimpo[10]
    );
  };

  const authenticateCpf = async (cpfText) => {
    const cpfLimpo = cpfText.replace(/\D/g, '');
    if (!validarCpf(cpfLimpo)) {
      setError('CPF inválido');
      return;
    }

    const userData = await verifyCpfAndPassword(cpfLimpo);
    if (userData) {
      if (Array.isArray(userData) && userData[0] === 'senha_nao_cadastrada') {
        navigation.navigate('CreatePassScreen', { cpf: cpfLimpo, userId: userData[1] });
      } else {
        navigation.navigate('PassScreen', { cpf: cpfLimpo, userName: userData.nome || 'Usuário' });
      }
    } else {
      setError('CPF não encontrado');
      Toast.show({ type: 'error', text1: 'CPF não encontrado' });
    }
  };

  return (
    <ImageBackground source={require('./images/bg.png')} style={styles.background}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('./images/logo.png')}
          style={styles.logo}
          //resizeMode="contain"
        />

        {/* Título "Novva" */}
        <Text style={styles.title}>Novva</Text>

        {/* Label "Informe seu CPF:" */}
        <Text style={styles.label}>Informe seu CPF:</Text>

        {/* Campo de CPF */}
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={11}
          onSubmitEditing={() => authenticateCpf(cpf)}
        />

        {/* Botão com ícone */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => authenticateCpf(cpf)}
        >
          <Icon name="chevron-right" size={30} color="#000" />
        </TouchableOpacity>

        {/* Mensagem de erro */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

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
    maxWidth: 400, // Logo maior
    maxHeight: 400, // Logo maior
    position: 'absolute',
    top: '10%', // Mais pra cima
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
    top: '55%', // Ajustado para ficar logo acima do input
    left: '10%',
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    width: '80%', // Input maior
    padding: 15, // Mais espaçamento interno
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    top: '58%', // Mais pra cima
    right: '11%',
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    top: '59%', // Alinhado com o input
    right: '14%',
  },
  error: {
    position: 'absolute',
    top: '65%', // Ajustado para não sobrepor o input
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CpfScreen;