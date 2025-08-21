import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Platform, Modal, FlatList, SafeAreaView, ScrollView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { getNfsByCpf, getCnpjsByCpf } from '../firebaseconfig';

const NfsScreen = ({ route, navigation }) => {
  const cpf = route?.params?.cpf;
  const userName = route?.params?.userName;

  const [municipio, setMunicipio] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [data, setData] = useState('');
  const [valor, setValor] = useState('');
  const [valorRaw, setValorRaw] = useState('');
  const [codigoTributacao] = useState('04.01.01 Medicina');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showCnpjModal, setShowCnpjModal] = useState(false);
  const [cnpjList, setCnpjList] = useState([]);

  const formatarValor = (input) => {
    let valorNumerico = input.replace(/\D/g, '');
    if (!valorNumerico) return '';
    valorNumerico = (parseInt(valorNumerico) / 100).toFixed(2);
    const valorFormatado = valorNumerico.replace(/\d(?=(\d{3})+(\.|$))/g, '$&.').replace('.', ',');
    return `R$ ${valorFormatado}`;
  };

  const handleValorChange = (text) => {
    const rawValue = text.replace(/\D/g, '');
    setValorRaw(rawValue);
    setValor(formatarValor(rawValue));
  };

  const fetchCnpjs = async () => {
    if (!cpf) {
      console.log('CPF não fornecido');
      return;
    }
    const cpfLimpo = cpf.replace(/\D/g, '');
    console.log('Buscando CNPJs para CPF:', cpfLimpo);
    const cnpjs = await getCnpjsByCpf(cpfLimpo);
    console.log('CNPJs retornados:', cnpjs);
    setCnpjList(cnpjs);
    setShowCnpjModal(true);
  };

  const showDatePickerModal = () => {
    console.log('Abrindo o DateTimePicker - Plataforma:', Platform.OS);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, date) => {
    console.log('handleDateChange chamado - Evento:', event, 'Data:', date);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate(date);
        const formattedDate = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        setData(formattedDate);
      }
    } else if (Platform.OS === 'ios' && date) {
      setSelectedDate(date);
    }
  };

  const confirmDatePicker = () => {
    const formattedDate = selectedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    console.log('Data confirmada:', formattedDate);
    setData(formattedDate);
    setShowDatePicker(false);
  };

  const closeDatePicker = () => {
    console.log('Fechando o DateTimePicker sem confirmar');
    setShowDatePicker(false);
  };

  const verificarCampos = () => {
    if (!municipio || !cnpj || !data || !valor || !codigoTributacao) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor, preencha todos os campos antes de prosseguir.',
      });
      console.log('Por favor, preencha todos os campos.');
      return;
    }

    navigation.navigate('DescriptionScreen', {
      cpf,
      userName,
      municipio,
      cnpj,
      data,
      valor,
      valorRaw,
      codigoTributacao,
    });
  };

  const selectCnpj = (selectedCnpj) => {
    setCnpj(selectedCnpj);
    setShowCnpjModal(false);
  };

  const renderCnpjItem = ({ item }) => (
    <TouchableOpacity style={styles.cnpjItem} onPress={() => selectCnpj(item.cnpj)}>
      <Text style={styles.cnpjText}>{item.cnpj}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('HomePageScreen', { cpf, userName })}
            >
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Emitir Nota Fiscal</Text>
            <View style={styles.headerRight}>
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

        {/* Conteúdo */}
        <View style={styles.content}>
          {/* Card de Dicas */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Dicas para Emitir sua Nota Fiscal</Text>
            <Text style={styles.tipsText}>• Confirme a descrição que o hospital deseja na nota fiscal.</Text>
            <Text style={styles.tipsText}>• Não achou o CNPJ? Vá em serviços e adicione um novo CNPJ.</Text>
          </View>

          {/* Card de Inputs */}
          <View style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Município</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o município"
                placeholderTextColor="#999"
                value={municipio}
                onChangeText={setMunicipio}
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>CNPJ</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.input, styles.inputWithIconField]}
                  placeholder="Selecione o CNPJ"
                  placeholderTextColor="#999"
                  value={cnpj}
                  onChangeText={setCnpj}
                  maxLength={14}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.inputIcon} onPress={fetchCnpjs}>
                  <Ionicons name="chevron-down" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o valor (R$)"
                placeholderTextColor="#999"
                value={valor}
                onChangeText={handleValorChange}
                maxLength={12}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.input, styles.inputWithIconField]}
                  placeholder="Selecione a data"
                  placeholderTextColor="#999"
                  value={data}
                  onChangeText={setData}
                  editable={false}
                />
                <TouchableOpacity style={styles.inputIcon} onPress={showDatePickerModal}>
                  <Ionicons name="calendar-outline" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Código de Tributação</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Código de Tributação"
                placeholderTextColor="#999"
                value={codigoTributacao}
                editable={false}
              />
            </View>
          </View>

          {/* Botão Próximo */}
          <TouchableOpacity style={styles.nextButton} onPress={verificarCampos}>
            <Text style={styles.nextButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Data */}
      <Modal visible={showDatePicker} transparent={true} animationType="slide" onRequestClose={closeDatePicker}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              locale="pt-BR"
              textColor="#000000"
              style={styles.datePicker}
            />
            {Platform.OS === 'ios' && (
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeDatePicker}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={confirmDatePicker}>
                  <Text style={styles.modalButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de CNPJ */}
      <Modal visible={showCnpjModal} transparent={true} animationType="slide" onRequestClose={() => setShowCnpjModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.cnpjModalContent}>
            <Text style={styles.cnpjModalTitle}>Selecione um CNPJ</Text>
            <FlatList
              data={cnpjList}
              renderItem={renderCnpjItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.cnpjEmptyText}>Nenhum CNPJ encontrado</Text>}
            />
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowCnpjModal(false)}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Barra Inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePageScreen', { cpf, userName })}>
          <Ionicons name="home-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuModal')}>
          <Ionicons name="menu-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <Toast />
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    top: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flexGrow: 1,
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  inputCard: {
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithIconField: {
    flex: 1,
  },
  inputIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  disabledInput: {
    backgroundColor: '#E5E5E5',
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  cnpjModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cnpjModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  cnpjItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  cnpjText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  cnpjEmptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    padding: 20,
  },
});

export default NfsScreen;