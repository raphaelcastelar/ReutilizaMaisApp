import React, { useState } from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { registerPassword } from '../firebaseconfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CreatePassScreen = ({ route, navigation }) => {
  const { cpf } = route.params;
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const cadastrarSenha = async () => {
    if (password1 !== password2) {
      setError('As senhas não coincidem');
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    const userName = await registerPassword(cpfLimpo, password1);

    if (userName) {
      Toast.show({ type: 'success', text1: 'Senha cadastrada com sucesso' });
      navigation.navigate('HomePageScreen', { cpf, userName });
    } else {
      setError('Erro ao cadastrar senha');
      Toast.show({ type: 'error', text1: 'Erro ao cadastrar senha' });
    }
  };

  return (
    <ImageBackground source={require('./images/bg.png')} style={styles.background}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('./images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Título "Novva" */}
        <Text style={styles.title}>Novva</Text>

        {/* Label "Crie sua senha:" */}
        <Text style={styles.label}>Crie sua senha:</Text>

        {/* Campo de senha 1 */}
        <TextInput
          style={styles.input}
          placeholder="Digite a nova senha"
          value={password1}
          onChangeText={setPassword1}
          secureTextEntry
          onSubmitEditing={cadastrarSenha}
        />

        {/* Campo de senha 2 */}
        <TextInput
          style={[styles.input, { top: '66%' }]} // Aumentado de 63% para 66% para mais espaço
          placeholder="Confirme a senha"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
          onSubmitEditing={cadastrarSenha}
        />

        {/* Botão "Cadastrar" */}
        <TouchableOpacity
          style={styles.cadastrarButton}
          onPress={cadastrarSenha}
        >
          <Text style={styles.cadastrarText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* Mensagem de erro */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Botão "Voltar" */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('CpfScreen')}
        >
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
  cadastrarButton: {
    position: 'absolute',
    top: '73%', // Posicionado abaixo do segundo input
    backgroundColor: '#fff', // Fundo branco para consistência
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Igual aos inputs
    alignSelf: 'center',
  },
  cadastrarText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  error: {
    position: 'absolute',
    top: '47%',
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
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

export default CreatePassScreen;