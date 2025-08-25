import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const BoasVindasTela = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/image2.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <Image
          source={require('../assets/reutiliza.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <Image
            source={require('../assets/chair.png')}
            style={styles.chairImage}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Bem-vindo!</Text>
          <Text style={styles.subText}>
            Acesse o banco social de materiais
            {"\n"}
             de construção do Reutiliza+
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginTela')}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CadastroForm')}>
            <Text style={styles.signupText}>
              <Text style={styles.signupBaseText}>Não possui uma conta? </Text>
              <Text style={styles.signupLinkText}>Faça o seu Cadastro</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00AEEF',
  },
  header: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  logoImage: {
    width: 282.18,
    height: 158.25,
    zIndex: 1, // Garante que a logo fique acima da imagem de fundo
  },
  content: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  innerContent: {
    flex: 1,
    backgroundColor: '#F8F4E6',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  chairImage: {
    width: 120,
    height: 123,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#FF6200',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
    height: 63,
    width: 372,
    justifyContent: 'center', // Centraliza o texto dentro do botão
    alignItems: 'center', // Centraliza o texto dentro do botão
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: 14,
  },
  signupBaseText: {
    color: '#000',
  },
  signupLinkText: {
    color: '#00AEEF',
  },
});

export default BoasVindasTela;