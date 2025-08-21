import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ensureDasDocument, db } from '../firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePageScreen = ({ route, navigation }) => {
  const [userName, setUserName] = useState('Usuário');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Função para carregar os dados do usuário
  const loadUserData = useCallback(async () => {
    try {
      let paramsUserName = route?.params?.userName || null;
      let paramsCpf = route?.params?.cpf || null;
      let storedUserName = null;
      let storedCpf = null;

      if (!paramsUserName || !paramsCpf) {
        storedUserName = await AsyncStorage.getItem('userName');
        storedCpf = await AsyncStorage.getItem('cpf');
      }

      if (paramsUserName && paramsCpf) {
        setUserName(paramsUserName);
        setCpf(paramsCpf);
        await AsyncStorage.setItem('userName', paramsUserName);
        await AsyncStorage.setItem('cpf', paramsCpf);
      } else if (storedUserName && storedCpf) {
        setUserName(storedUserName);
        setCpf(storedCpf);
      } else {
        navigation.replace('CpfScreen');
        return;
      }

      if (cpf) {
        const userDocRef = doc(db, 'pre_cadastro', cpf);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || paramsUserName || storedUserName || 'Usuário');
          setEmail(userData.email || '');
        } else {
          console.log('Documento não encontrado na coleção pre_cadastro para o CPF:', cpf);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      navigation.replace('CpfScreen');
    } finally {
      setLoading(false);
    }
  }, [route?.params, navigation, cpf]);

  // Carrega os dados inicialmente e quando a tela é focada
  useEffect(() => {
    loadUserData();

    // Adiciona um listener para recarregar os dados quando a tela for focada
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true); // Força o estado de carregamento para recarregar os dados
      loadUserData();
    });

    // Limpa o listener quando o componente for desmontado
    return unsubscribe;
  }, [navigation, loadUserData]);

  useEffect(() => {
    if (cpf) {
      ensureDasDocument(cpf);
    }
  }, [cpf]);

  const cardsData = [
    { id: '1', icon: require('./images/nf.png'), text: 'Emitir NFs-e', screen: 'NfsScreen', isSingle: false },
    { id: '2', icon: require('./images/das.png'), text: 'Simples Nacional', screen: 'DasScreen', isSingle: false },
    { id: '3', icon: require('./images/cnpj.png'), text: 'Documentos Constitutivos', screen: 'DocumentScreen', isSingle: true },
  ];

  // Dados fictícios para as novidades (pode ser substituído por dados dinâmicos do Firestore ou API)
  const newsData = [
    {
      id: '1',
      title: 'Nova Funcionalidade!',
      description: 'Agora você pode emitir NFs-e diretamente pelo app. Experimente já!',
      action: () => navigation.navigate('NfsScreen', { cpf, userName }),
    },
    {
      id: '2',
      title: 'Atualização de Segurança',
      description: 'Implementamos novas medidas para proteger seus dados. Saiba mais!',
      action: () => console.log('Abrir detalhes sobre atualização de segurança'),
    },
    {
      id: '3',
      title: 'Dica do Dia',
      description: 'Lembre-se de verificar seus documentos no Simples Nacional.',
      action: () => navigation.navigate('DasScreen', { cpf, userName }),
    },
  ];

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={item.isSingle ? styles.singleCard : styles.card}
      onPress={() => navigation.navigate(item.screen, { cpf, userName })}
    >
      <Image source={item.icon} style={item.isSingle ? styles.singleCardIcon : styles.cardIcon} />
      <Text style={item.isSingle ? styles.singleCardText : styles.cardText}>{item.text}</Text>
    </TouchableOpacity>
  );

  const renderNewsItem = ({ item }) => (
    <View style={styles.newsCard}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.newsButton} onPress={item.action}>
        <Text style={styles.newsButtonText}>Saiba Mais</Text>
      </TouchableOpacity>
    </View>
  );

  const handleUserButtonPress = () => {
    console.log('Botão de usuário clicado!');
    console.log('Navegando para UserSettingsScreen com:', { cpf, userName, email });
    navigation.navigate('UserSettingsScreen', {
      cpf,
      userName,
      email,
    });
  };

  // Função para extrair o primeiro nome
  const getFirstName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return 'Usuário';
    return fullName.split(' ')[0];
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>Olá, {getFirstName(userName)} ✋</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.userButton}
                onPress={handleUserButtonPress}
              >
                <Ionicons name="person-circle-outline" size={32} color="#4A90E2" />
              </TouchableOpacity>
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

        {/* Seção de Cards */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Bem-vindo à Novva</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha uma das opções abaixo para continuar:
          </Text>

          <FlatList
            data={cardsData}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.cardGrid}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Seção de Novidades */}
        <View style={styles.newsContainer}>
          <Text style={styles.newsSectionTitle}>Novidades</Text>
          <FlatList
            data={newsData}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newsList}
          />
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
    fontFamily: 'Poppins-Medium',
  },
  header: {
    marginBottom: 30,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: -27,
    right: 2,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  userButton: {
    padding: 10,
    zIndex: 2,
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
    fontFamily: 'Poppins-Bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  cardGrid: {
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 15,
    width: '47%',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  singleCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 15,
    height: 80,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  singleCardIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  singleCardText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Medium',
    flexShrink: 1,
  },
  // Estilos para a seção de novidades
  newsContainer: {
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
  newsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Poppins-Bold',
  },
  newsList: {
    paddingHorizontal: 5,
  },
  newsCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginRight: 15,
    width: 250,
    height: 150,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    flex: 1,
  },
  newsButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  newsButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
  },
});

export default HomePageScreen;