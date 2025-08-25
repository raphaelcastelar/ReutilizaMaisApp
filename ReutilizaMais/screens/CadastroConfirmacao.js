import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function CadastroConfirmacao({ navigation, route }) {
  // --- Recebe dados das telas anteriores ---
  const dadosCadastro = route?.params?.dadosCadastro || {};
  const endereco = route?.params?.endereco || {};

  const [aceite, setAceite] = useState(false);

  // --- Validação mínima para habilitar o botão Continuar ---
  const podeContinuar = useMemo(() => !!aceite, [aceite]);

  // --- Finalização ---
  const handleContinuar = () => {
    if (!podeContinuar) return;


    // Retorna ao início ou navega para a home/login
    navigation.popToTop();
  };

  // Helper para desenhar input somente leitura no mesmo estilo do formulário
  const ReadonlyInput = ({ placeholder, value }) => (
    <TextInput
      style={[styles.input, styles.readonly]}
      placeholder={placeholder}
      value={value ?? ''}
      editable={false}              // <-- impede edição
      selectTextOnFocus={false}     // <-- não seleciona ao tocar
    />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Cabeçalho e indicador de progresso */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Informações da empresa</Text>
        <View style={styles.progressIndicator}>
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDotActive} />
        </View>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>Confirme seu Cadastro</Text>

        {/* Avatar fake (apenas para manter layout) */}
        <View style={styles.profileSection}>
          <View style={styles.profileImagePlaceholder}>
            <View style={styles.profileImage} />
            <View style={styles.addIconContainer}>
              <Text style={styles.addIcon}>+</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Informações pessoais</Text>
      </View>

      {/* --- Dados da Empresa --- */}
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Dados da Empresa</Text>
        <ReadonlyInput placeholder="Razão Social" value={dadosCadastro.razaoSocial} />
        <ReadonlyInput placeholder="Nome Fantasia" value={dadosCadastro.nomeFantasia} />
        <ReadonlyInput placeholder="Email" value={dadosCadastro.email} />
        <ReadonlyInput placeholder="CNPJ" value={dadosCadastro.cnpj} />
        <ReadonlyInput placeholder="Natureza Jurídica" value={dadosCadastro.naturezaJuridica} />
      </View>

      {/* --- Dados do Representante --- */}
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Dados do Representante</Text>
        <ReadonlyInput placeholder="Representante Legal" value={dadosCadastro.representanteLegal} />
        <ReadonlyInput placeholder="CPF" value={dadosCadastro.cpf} />
        <ReadonlyInput placeholder="Cargo" value={dadosCadastro.cargo} />
      </View>

      {/* --- Endereço --- */}
      <View style={styles.formSection}>
        <Text style={[styles.formSectionTitle, { textAlign: 'center' }]}>Endereço</Text>
        <ReadonlyInput placeholder="Endereço" value={endereco.logradouro} />
        <ReadonlyInput placeholder="Número" value={endereco.numero} />
        <ReadonlyInput placeholder="Complemento" value={endereco.complemento} />
        <ReadonlyInput placeholder="CEP" value={endereco.cep} />
        <ReadonlyInput placeholder="Estado" value={endereco.uf} />
        <ReadonlyInput placeholder="Cidade" value={endereco.cidade} />
        <ReadonlyInput placeholder="Bairro" value={endereco.bairro} />
      </View>

      {/* Aceite de Termos & Condições */}
      <TouchableOpacity style={styles.termosRow} onPress={() => setAceite((v) => !v)}>
        {/* "Checkbox" simples desenhado via View */}
        <View style={[styles.checkbox, aceite && styles.checkboxChecked]}>
          {aceite && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.termosText}>
          Li e concordo com os <Text style={styles.link}>Termos & Condições</Text>
        </Text>
      </TouchableOpacity>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !podeContinuar && { opacity: 0.6 }]}
          onPress={handleContinuar}
          disabled={!podeContinuar}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // --- Base visual igual às outras telas ---
  container: { flex: 1, backgroundColor: '#EAE5D9', paddingHorizontal: 20 },
  header: { alignItems: 'center', paddingVertical: 20 },
  headerText: { fontSize: 16, color: '#666' },
  progressIndicator: { flexDirection: 'row', marginTop: 5 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  progressDotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#777', marginHorizontal: 4 },

  mainContent: { alignItems: 'center', marginBottom: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },

  profileSection: { position: 'relative', marginBottom: 10 },
  profileImagePlaceholder: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#C4C4C4',
    justifyContent: 'center', alignItems: 'center',
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D9D9D9' },
  addIconContainer: {
    position: 'absolute', bottom: 5, right: 5, backgroundColor: '#1E90FF',
    width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center',
  },
  addIcon: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },

  formSection: { width: '100%', marginBottom: 16 },
  formSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },

  input: {
    height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 15, marginBottom: 10, backgroundColor: '#fff',
  },
  readonly: {
    color: '#333',
    // leve “desligado visual”: mantém a aparência do input, mas sem edição
    opacity: 0.95,
  },

  termosRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#FF7F50',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  checkboxChecked: { borderColor: '#FF7F50', backgroundColor: '#FFEEE4' },
  checkboxInner: { width: 10, height: 10, backgroundColor: '#FF7F50', borderRadius: 2 },
  termosText: { color: '#333' },
  link: { color: '#0A7AFF', textDecorationLine: 'underline' },

  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, marginTop: 10,
  },
  backButton: {
    flex: 1, backgroundColor: '#fff', borderColor: '#FF7F50', borderWidth: 1, borderRadius: 30,
    paddingVertical: 15, marginRight: 10, alignItems: 'center',
  },
  backButtonText: { color: '#FF7F50', fontSize: 16, fontWeight: 'bold' },
  continueButton: {
    flex: 1, backgroundColor: '#FF7F50', borderRadius: 30, paddingVertical: 15,
    marginLeft: 10, alignItems: 'center',
  },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
