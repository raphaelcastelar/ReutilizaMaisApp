import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const userCpf = '12831146747'; // Substitua por lógica real para obter o CPF do usuário logado

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('HomePageScreen')}
          >
            <Ionicons name="chevron-back" size={28} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Configurações</Text>
        </View>

        {/* Lista de Opções */}
        <View style={styles.optionsContainer}>
          {/* Opção: Gerenciar CNPJs */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => navigation.navigate('ManageCNPJsScreen', { cpf: userCpf })}
          >
            <Ionicons name="business-outline" size={24} color="#4A90E2" style={styles.optionIcon} />
            <Text style={styles.optionText}>Gerenciar CNPJs</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" style={styles.arrowIcon} />
          </TouchableOpacity>

          {/* Opção: Redefinir Senha */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => navigation.navigate('ResetPasswordScreen')}
          >
            <Ionicons name="lock-closed-outline" size={24} color="#4A90E2" style={styles.optionIcon} />
            <Text style={styles.optionText}>Redefinir Senha</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" style={styles.arrowIcon} />
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
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrowIcon: {
    marginLeft: 10,
  },
});

export default SettingsScreen;