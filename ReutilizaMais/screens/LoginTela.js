import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';

const LoginTela = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/image2.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <Image
            source={require('../assets/seta.png')}
            style={styles.arrowImage}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Acesse sua conta</Text>
          <Text style={styles.subText}>
            Insira os dados a seguir para
            {"\n"}
            acessar sua conta
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaHome')}>
            <Text style={styles.buttonText}>Entrar</Text>
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
    marginBottom: 0,
    marginTop:0,
  },
  arrowImage: {
    width: 137,
    height: 142,
    marginBottom: 0,
    marginTop: 30,
  },
  welcomeText: {
    fontSize: 29,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: -10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop:-15,
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius:15,
    paddingHorizontal: 15,
    marginBottom: 8,
    backgroundColor: 'transparent',
    color: '#333',
    marginBottom:10,
  },
  button: {
    backgroundColor: '#FF6200',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginBottom: 30,
    height: 63,
    width: 372,
    justifyContent: 'center',
    alignItems: 'center',
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

export default LoginTela;