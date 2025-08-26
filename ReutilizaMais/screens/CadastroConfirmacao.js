import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const ORANGE = '#EA7A1A';
const DOT_ACTIVE = '#333';   // etapa atual
const DOT_DONE = '#2ECC71';  // etapas concluídas

export default function CadastroConfirmacao({ navigation, route }) {
  // dados vindos das telas anteriores
  const dadosCadastro = route?.params?.dadosCadastro || {};
  const endereco      = route?.params?.endereco || {};

  const [aceite, setAceite] = useState(false);
  const podeContinuar = useMemo(() => !!aceite, [aceite]);

  const handleContinuar = () => {
    if (!podeContinuar) return;
    // aqui iria a chamada à API/submit final — por enquanto só volta ao topo
    navigation.popToTop();
  };

  // input somente leitura no mesmo estilo dos formulários
  const ReadonlyInput = ({ placeholder, value }) => (
    <TextInput
      style={[styles.input, styles.readonly]}
      placeholder={placeholder}
      value={value ?? ''}
      editable={false}
      selectTextOnFocus={false}
    />
  );

  // renderiza somente se tiver conteúdo (mostrar inputs usados nas telas anteriores)
  const renderIfHas = (label, value) =>
    value?.toString()?.trim() ? <ReadonlyInput placeholder={label} value={value} /> : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* indicador de progresso: 2 concluídas (verde) + atual (cinza escuro) */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Informações da empresa</Text>
        <View style={styles.progressIndicator}>
          <View style={styles.progressDotDone} />
          <View style={styles.progressDotDone} />
          <View style={styles.progressDotActive} />
        </View>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>Confirme seu Cadastro</Text>

        {/* avatar fake apenas para manter layout */}
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

      {/* Dados da Empresa (só mostra o que foi preenchido) */}
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Dados da Empresa</Text>
        {renderIfHas('Razão Social',      dadosCadastro.razaoSocial)}
        {renderIfHas('Nome Fantasia',     dadosCadastro.nomeFantasia)}
        {renderIfHas('Email',             dadosCadastro.email)}
        {renderIfHas('CNPJ',              dadosCadastro.cnpj)}
        {renderIfHas('Natureza Jurídica', dadosCadastro.naturezaJuridica)}
      </View>

      {/* Dados do Representante */}
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Dados do Representante</Text>
        {renderIfHas('Representante Legal', dadosCadastro.representanteLegal)}
        {renderIfHas('CPF',                  dadosCadastro.cpf)}
        {renderIfHas('Cargo',                dadosCadastro.cargo)}
      </View>

      {/* Endereço */}
      <View style={styles.formSection}>
        <Text style={[styles.formSectionTitle, { textAlign: 'center' }]}>Endereço</Text>
        {renderIfHas('Endereço',     endereco.logradouro)}
        {renderIfHas('Número',       endereco.numero)}
        {renderIfHas('Complemento',  endereco.complemento)}
        {renderIfHas('CEP',          endereco.cep)}
        {renderIfHas('Estado',       endereco.uf)}
        {renderIfHas('Cidade',       endereco.cidade)}
        {renderIfHas('Bairro',       endereco.bairro)}
      </View>

      {/* Aceite de Termos & Condições */}
      <TouchableOpacity style={styles.termosRow} onPress={() => setAceite(v => !v)}>
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
  // base
  container: { flex: 1, backgroundColor: '#EAE5D9', paddingHorizontal: 20 },
  header: { alignItems: 'center', paddingVertical: 20 },
  headerText: { fontSize: 16, color: '#666' },

  // progresso
  progressIndicator: { flexDirection: 'row', marginTop: 5 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  progressDotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: DOT_ACTIVE, marginHorizontal: 4 },
  progressDotDone: { width: 8, height: 8, borderRadius: 4, backgroundColor: DOT_DONE, marginHorizontal: 4 },

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

  // inputs: transparentes e somente leitura
  input: {
    height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 15, marginBottom: 10, backgroundColor: 'transparent',
  },
  readonly: { color: '#333', opacity: 0.95 },

  // termos
  termosRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: ORANGE,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  checkboxChecked: { borderColor: ORANGE, backgroundColor: '#FFEEE4' },
  checkboxInner: { width: 10, height: 10, backgroundColor: ORANGE, borderRadius: 2 },
  termosText: { color: '#333' },
  link: { color: '#0A7AFF', textDecorationLine: 'underline' },

  // botões (mesmo padrão da tela de Endereço)
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, marginTop: 10 },
  backButton: {
    flex: 1, backgroundColor: 'transparent', borderColor: ORANGE, borderWidth: 2,
    borderRadius: 20, paddingVertical: 15, marginRight: 10, alignItems: 'center',
  },
  backButtonText: { color: ORANGE, fontSize: 16, fontWeight: 'bold' },
  continueButton: {
    flex: 1, backgroundColor: ORANGE, borderRadius: 20, paddingVertical: 15,
    marginLeft: 10, alignItems: 'center',
  },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
