import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';

const ChangePasswordScreen = ({ navigation, route }) => {
  const cpf = route.params?.cpf || null; // CPF passado como parâmetro de navegação
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repNovaSenha, setRepNovaSenha] = useState('');
  const [error, setError] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const redefinirSenha = async () => {
    setError(''); // Limpa mensagens de erro anteriores

    // Validações iniciais
    if (!senhaAtual || !novaSenha || !repNovaSenha) {
      setError('Preencha todos os campos.');
      Toast.show({ type: 'error', text1: 'Preencha todos os campos' });
      return;
    }

    if (novaSenha !== repNovaSenha) {
      setError('As novas senhas não coincidem.');
      Toast.show({ type: 'error', text1: 'As novas senhas não coincidem' });
      return;
    }

    if (!cpf) {
      setError('Erro: CPF não encontrado. Volte e tente novamente.');
      Toast.show({ type: 'error', text1: 'CPF não encontrado' });
      return;
    }

    try {
      setButtonDisabled(true);

      // Busca o usuário no Firestore pelo CPF
      const usuarioRef = firestore()
        .collection('pre_cadastro')
        .where('cpf', '==', cpf)
        .limit(1);
      const snapshot = await usuarioRef.get();

      if (snapshot.empty) {
        setError('Usuário não encontrado.');
        Toast.show({ type: 'error', text1: 'Usuário não encontrado' });
        setButtonDisabled(false);
        return;
      }

      const usuarioData = snapshot.docs[0].data();
      const usuarioId = snapshot.docs[0].id;

      // Verifica se a senha atual está correta
      if (usuarioData.senha !== senhaAtual) {
        setError('Senha atual incorreta.');
        Toast.show({ type: 'error', text1: 'Senha atual incorreta' });
        setButtonDisabled(false);
        return;
      }

      // Atualiza a senha no Firestore
      await firestore()
        .collection('pre_cadastro')
        .doc(usuarioId)
        .update({ senha: novaSenha });

      Toast.show({ type: 'success', text1: 'Senha redefinida com sucesso' });
      console.log('Senha redefinida com sucesso!');

      // Limpa os campos
      setSenhaAtual('');
      setNovaSenha('');
      setRepNovaSenha('');
      setError('');

      // Aguarda 3 segundos antes de reabilitar o botão e navegar
      setTimeout(() => {
        setButtonDisabled(false);
        navigation.navigate('ConfigCnpjScreen', { cpf });
      }, 3000);
    } catch (error) {
      setError('Erro ao redefinir a senha. Tente novamente.');
      Toast.show({ type: 'error', text1: 'Erro ao redefinir a senha' });
      console.error('Erro ao redefinir senha:', error);
      setButtonDisabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha Atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir Nova Senha"
        value={repNovaSenha}
        onChangeText={setRepNovaSenha}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title="Redefinir Senha"
        onPress={redefinirSenha}
        disabled={buttonDisabled}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
});

export default ChangePasswordScreen;