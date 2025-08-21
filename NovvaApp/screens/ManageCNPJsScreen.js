import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseconfig';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';

const ManageCNPJsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const cpf = route.params?.cpf; // Usa operador opcional para evitar erro se params for undefined
  const [apelido, setApelido] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cnpjs, setCnpjs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCNPJs, setSelectedCNPJs] = useState([]);

  // Verificar se o CPF está disponível
  useEffect(() => {
    if (!cpf) {
      Alert.alert(
        'Erro',
        'CPF do usuário não encontrado. Por favor, faça login novamente.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CpfScreen'), // Redireciona para a tela de login
          },
        ]
      );
    }
  }, [cpf, navigation]);

  // Função para formatar o CNPJ
  const formatCNPJ = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);
    if (match) {
      return `${match[1]}${match[2] ? '.' : ''}${match[2]}${match[3] ? '.' : ''}${match[3]}${match[4] ? '/' : ''}${match[4]}${match[5] ? '-' : ''}${match[5]}`;
    }
    return value;
  };

  // Função para buscar os CNPJs do Firestore
  const fetchCNPJs = async () => {
    if (!cpf) return; // Não tenta buscar se o CPF não estiver disponível
    setFetching(true);
    try {
      const cnpjCollectionRef = collection(doc(db, 'tomador', cpf), 'CNPJ');
      const cnpjSnapshot = await getDocs(cnpjCollectionRef);
      const cnpjList = cnpjSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCnpjs(cnpjList);
      setSelectedCNPJs([]);
    } catch (error) {
      console.error('Erro ao buscar CNPJs:', error);
      Alert.alert('Erro', 'Não foi possível carregar os CNPJs. Tente novamente.');
    } finally {
      setFetching(false);
    }
  };

  // Buscar os CNPJs quando a tela for montada
  useEffect(() => {
    if (cpf) {
      fetchCNPJs();
    }
  }, [cpf]);

  // Função para adicionar um CNPJ
  const handleAddCNPJ = async () => {
    if (!cpf) {
      Alert.alert('Erro', 'CPF do usuário não encontrado.');
      return;
    }

    if (!apelido.trim() || !cnpj.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const cleanedCNPJ = cnpj.replace(/\D/g, '');
    if (cleanedCNPJ.length !== 14) {
      Alert.alert('Erro', 'O CNPJ deve conter 14 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const tomadorRef = doc(db, 'tomador', cpf);
      const tomadorSnap = await getDoc(tomadorRef);
      if (!tomadorSnap.exists()) {
        await setDoc(tomadorRef, { createdAt: new Date() });
      }

      const cnpjRef = doc(collection(tomadorRef, 'CNPJ'), cleanedCNPJ);
      await setDoc(cnpjRef, {
        apelido: apelido.trim(),
        cnpj: cleanedCNPJ,
        createdAt: new Date(),
      });

      Alert.alert('Sucesso', 'CNPJ adicionado com sucesso!');
      setApelido('');
      setCnpj('');
      fetchCNPJs();
    } catch (error) {
      console.error('Erro ao adicionar CNPJ:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o CNPJ. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para alternar o modo de edição
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedCNPJs([]);
  };

  // Função para selecionar/deselecionar um CNPJ
  const toggleSelectCNPJ = (cnpjId) => {
    if (selectedCNPJs.includes(cnpjId)) {
      setSelectedCNPJs(selectedCNPJs.filter(id => id !== cnpjId));
    } else {
      setSelectedCNPJs([...selectedCNPJs, cnpjId]);
    }
  };

  // Função para remover os CNPJs selecionados
  const handleRemoveSelectedCNPJs = async () => {
    if (!cpf) {
      Alert.alert('Erro', 'CPF do usuário não encontrado.');
      return;
    }

    if (selectedCNPJs.length === 0) {
      Alert.alert('Erro', 'Nenhum CNPJ selecionado para remoção.');
      return;
    }

    Alert.alert(
      'Confirmar Remoção',
      `Tem certeza que deseja remover ${selectedCNPJs.length} CNPJ${selectedCNPJs.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const deletePromises = selectedCNPJs.map(cnpjId =>
                deleteDoc(doc(db, 'tomador', cpf, 'CNPJ', cnpjId))
              );
              await Promise.all(deletePromises);
              Alert.alert('Sucesso', 'CNPJs removidos com sucesso!');
              fetchCNPJs();
              setEditMode(false);
            } catch (error) {
              console.error('Erro ao remover CNPJs:', error);
              Alert.alert('Erro', 'Não foi possível remover os CNPJs. Tente novamente.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Se o CPF não estiver disponível, exibir uma mensagem de erro
  if (!cpf) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>CPF do usuário não encontrado.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('CpfScreen')}
          >
            <Text style={styles.backButtonText}>Voltar ao Login</Text>
          </TouchableOpacity>
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
          <Text style={styles.headerText}>Gerenciar CNPJs</Text>
        </View>

        {/* Seção: Adicionar CNPJ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Adicionar CNPJ</Text>
          <TextInput
            style={styles.input}
            placeholder="Apelido (ex.: Empresa XYZ)"
            value={apelido}
            onChangeText={setApelido}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="CNPJ (ex.: 12.345.678/0001-99)"
            value={cnpj}
            onChangeText={(text) => setCnpj(formatCNPJ(text))}
            keyboardType="numeric"
            maxLength={18}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAddCNPJ}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Adicionando...' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Lista de CNPJs */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CNPJs Cadastrados</Text>
            {cnpjs.length > 0 && (
              <TouchableOpacity onPress={toggleEditMode}>
                <Text style={styles.editButtonText}>
                  {editMode ? 'Cancelar' : 'Editar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {fetching ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : cnpjs.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum CNPJ cadastrado.</Text>
          ) : (
            <>
              {cnpjs.map((item) => (
                <View key={item.id} style={styles.cnpjItem}>
                  {editMode && (
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => toggleSelectCNPJ(item.id)}
                    >
                      <Ionicons
                        name={
                          selectedCNPJs.includes(item.id)
                            ? 'checkbox'
                            : 'square-outline'
                        }
                        size={24}
                        color="#4A90E2"
                      />
                    </TouchableOpacity>
                  )}
                  <View style={styles.cnpjInfo}>
                    <Text style={styles.cnpjApelido}>{item.apelido}</Text>
                    <Text style={styles.cnpjNumber}>
                      {item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                    </Text>
                  </View>
                  {!editMode && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => toggleSelectCNPJ(item.id)}
                    >
                      <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {editMode && selectedCNPJs.length > 0 && (
                <TouchableOpacity
                  style={[styles.deleteButton, loading && styles.buttonDisabled]}
                  onPress={handleRemoveSelectedCNPJs}
                  disabled={loading}
                >
                  <Text style={styles.deleteButtonText}>
                    {loading ? 'Removendo...' : `Excluir Selecionados (${selectedCNPJs.length})`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
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
  cnpjItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  checkbox: {
    marginRight: 15,
  },
  cnpjInfo: {
    flex: 1,
  },
  cnpjApelido: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cnpjNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default ManageCNPJsScreen;