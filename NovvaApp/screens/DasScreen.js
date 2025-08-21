import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { db } from '../firebaseconfig';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const DasScreen = ({ navigation, route }) => {
  const { cpf, userName } = route.params || {};
  const [recalcularDisabled, setRecalcularDisabled] = useState({});
  const [baixarDisabled, setBaixarDisabled] = useState({});
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});

  const yearsData = [
    {
      year: 2025,
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    },
    {
      year: 2024,
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    },
    {
      year: 2023,
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    },
  ];

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const toggleMonth = (year, month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [`${year}-${month}`]: !prev[`${year}-${month}`],
    }));
  };

  const recalcularDas = async (month, year) => {
    if (!cpf) {
      Toast.show({ type: 'error', text1: 'Usuário não encontrado' });
      return;
    }

    const key = `${year}-${month}`;
    setRecalcularDisabled((prev) => ({ ...prev, [key]: true }));
    const horarioRecalculo = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      const userRef = doc(db, 'das', cpf);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await addDoc(collection(db, 'das', cpf, 'Recalculo'), {
          cpf,
          mes: month,
          ano: year,
          data_hora: horarioRecalculo,
        });
        Toast.show({ type: 'success', text1: `Recálculo registrado para ${month}/${year}` });
      } else {
        Toast.show({ type: 'error', text1: 'Usuário não encontrado' });
      }

      setTimeout(() => {
        setRecalcularDisabled((prev) => ({ ...prev, [key]: false }));
        navigation.navigate('HomePageScreen', { cpf, userName });
      }, 3000);
    } catch (error) {
      console.log('Erro ao recalcular DAS:', error.message);
      Toast.show({ type: 'error', text1: 'Erro ao recalcular DAS', text2: error.message });
      setRecalcularDisabled((prev) => ({ ...prev, [key]: false }));
    }
  };

  const baixarDas = async (month, year) => {
    if (!cpf) {
      Toast.show({ type: 'error', text1: 'Usuário não encontrado' });
      return;
    }

    const key = `${year}-${month}`;
    setBaixarDisabled((prev) => ({ ...prev, [key]: true }));

    try {
      const userRef = doc(db, 'das', cpf);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, { createdAt: new Date().toISOString() });
        console.log(`Documento 'das/${cpf}' criado.`);
      }

      const linkRef = doc(db, 'das', cpf, 'links', `${year}-${month}`);
      const linkDoc = await getDoc(linkRef);

      if (!linkDoc.exists()) {
        await setDoc(linkRef, {
          mes: month,
          ano: year,
          linkdas: '',
        });
        console.log(`Documento 'links/${year}-${month}' criado para o CPF ${cpf}.`);
      }

      const updatedLinkDoc = await getDoc(linkRef);
      let linkdas = updatedLinkDoc.data().linkdas;

      if (linkdas && linkdas !== '') {
        const fileIdMatch = linkdas.match(/\/d\/([a-zA-Z0-9_-]+)/) || linkdas.match(/id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          const fileId = fileIdMatch[1];
          linkdas = `https://drive.google.com/uc?export=download&id=${fileId}`;
          console.log(`Link ajustado para download direto: ${linkdas}`);
        } else {
          console.log(`Link original (não ajustado): ${linkdas}`);
        }

        const fileUri = `${FileSystem.documentDirectory}DAS-${month}-${year}.pdf`;

        const downloadResumable = FileSystem.createDownloadResumable(
          linkdas,
          fileUri,
          {},
          (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            console.log(`Progresso do download: ${(progress * 100).toFixed(2)}%`);
          }
        );
        const downloadResult = await downloadResumable.downloadAsync();

        if (!downloadResult || !downloadResult.uri) {
          throw new Error('Falha ao baixar o arquivo: resultado do download é inválido.');
        }

        const uri = downloadResult.uri;
        console.log(`Arquivo baixado: ${uri}`);

        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log(`Informações do arquivo:`, fileInfo);

        if (!fileInfo.exists || fileInfo.size === 0) {
          throw new Error('O arquivo baixado está vazio ou não existe.');
        }

        Toast.show({ type: 'success', text1: `Download concluído para ${month}/${year}` });

        if (Platform.OS === 'ios') {
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(uri, {
              mimeType: 'application/pdf',
              dialogTitle: `Salvar DAS ${month}/${year}`,
              UTI: 'com.adobe.pdf',
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2: 'Compartilhamento não disponível no dispositivo.',
            });
          }
        } else {
          Toast.show({
            type: 'info',
            text1: 'Download concluído',
            text2: 'O arquivo foi baixado, mas o salvamento automático não é suportado neste dispositivo.',
          });
        }
      } else {
        Toast.show({
          type: 'info',
          text1: `O Simples Nacional de ${month}/${year} não está pronto`,
          text2: 'Entre em contato com o administrador para configurar o link.',
        });
      }
    } catch (error) {
      console.log('Erro ao baixar DAS:', error.message);
      Toast.show({ type: 'error', text1: 'Erro ao baixar o arquivo', text2: error.message });
    }

    setTimeout(() => {
      setBaixarDisabled((prev) => ({ ...prev, [key]: false }));
    }, 3000);
  };

  const renderMonth = (month, year) => {
    const isMonthExpanded = expandedMonths[`${year}-${month}`];
    const key = `${year.toString()}-${month}`;
    return (
      <View style={styles.monthContainer} key={`${year}-${month}`}>
        <TouchableOpacity style={styles.monthRow} onPress={() => toggleMonth(year, month)}>
          <Text style={styles.monthText}>{month.toUpperCase()}</Text>
          <Ionicons
            name={isMonthExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
            style={styles.chevron}
          />
        </TouchableOpacity>
        {isMonthExpanded && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                baixarDisabled[key] && styles.buttonDisabled,
              ]}
              onPress={() => baixarDas(month, year)}
              disabled={baixarDisabled[key]}
            >
              <Text style={styles.buttonText}>Baixar DAS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                recalcularDisabled[key] && styles.buttonDisabled,
              ]}
              onPress={() => recalcularDas(month, year)}
              disabled={recalcularDisabled[key]}
            >
              <Text style={styles.buttonText}>Recalcular DAS</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderYear = (item) => {
    const { year, months } = item;
    const isYearExpanded = expandedYears[year];
    return (
      <View style={styles.yearContainer} key={year.toString()}>
        <TouchableOpacity style={styles.yearRow} onPress={() => toggleYear(year)}>
          <Ionicons
            name={isYearExpanded ? 'folder-open-outline' : 'folder-outline'}
            size={24}
            color="#333"
            style={styles.yearIcon}
          />
          <Text style={styles.yearText}>{year.toString()}</Text>
          <Ionicons
            name={isYearExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
            style={styles.chevron}
          />
        </TouchableOpacity>
        {isYearExpanded && (
          <View style={styles.monthList}>
            {months.map((month) => renderMonth(month, year))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('HomePageScreen', { cpf, userName })}
            >
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Simples Nacional</Text>
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

        {/* Seção de Dicas */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>
            Prazo para entrega do Simples Nacional e para recálculo do mesmo:
          </Text>
          <Text style={styles.tipsText}>
            • O prazo máximo para entrega do Simples Nacional é no dia 12 do mês da apuração.
          </Text>
          <Text style={styles.tipsText}>
            • Não achou o CNPJ que deseja? Vá em serviços e escolha a opção "Adicionar CNPJ".
          </Text>
        </View>

        {/* Lista de Anos */}
        {yearsData.map((item) => renderYear(item))}
      </ScrollView>

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
  yearContainer: {
    marginBottom: 15,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  yearIcon: {
    marginRight: 10,
  },
  yearText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    flex: 1,
  },
  chevron: {
    marginLeft: 10,
  },
  monthList: {
    marginTop: 10,
    marginLeft: 20,
  },
  monthContainer: {
    marginVertical: 5,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  monthText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 10,
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFF',
    textAlign: 'center',
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
});

export default DasScreen;