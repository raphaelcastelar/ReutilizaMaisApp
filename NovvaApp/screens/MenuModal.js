import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuModal = ({ navigation }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true} // Sempre visível quando a tela é acessada
      onRequestClose={() => navigation.goBack()} // Fecha o modal ao pressionar o botão de voltar
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho do Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Menu</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          {/* Opções do Menu */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('HomePageScreen');
              navigation.goBack(); // Fecha o modal após navegar
            }}
          >
            <Ionicons name="home-outline" size={24} color="#4A90E2" style={styles.menuIcon} />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('SettingsScreen');
              navigation.goBack(); // Fecha o modal após navegar
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#4A90E2" style={styles.menuIcon} />
            <Text style={styles.menuText}>Configurações</Text>
          </TouchableOpacity>

          {/* Opção de Logout (Opcional) */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // Aqui você pode adicionar lógica para logout (ex.: limpar AsyncStorage)
              navigation.navigate('CpfScreen');
              navigation.goBack(); // Fecha o modal após navegar
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#4A90E2" style={styles.menuIcon} />
            <Text style={styles.menuText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MenuModal;