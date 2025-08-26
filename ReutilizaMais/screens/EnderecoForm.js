import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const ORANGE = '#EA7A1A';     // laranja do Figma (botões/borda)
const DOT_ACTIVE = '#333';    // bolinha da tela atual (cinza forte)
const DOT_DONE = '#2ECC71';   // bolinha de etapa concluída (verde)

export default function EnderecoForm({ navigation, route }) {
  //  Estados dos campos 
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');

  // dropdown UF
  const [ufOpen, setUfOpen] = useState(false);
  const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  // formatação
  const formatCEP = (v) => v.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d{0,3})/,(_,p1,p2)=> (p2?`${p1}-${p2}`:p1));
  const onChangeCep = (v) => setCep(formatCEP(v));
  const onChangeNumero = (v) => {
    const regex = /^(\d{0,4})([A-Za-z]{0,1})$/;
    const match = v.match(regex);
    if (match) setNumero(match[0].toUpperCase());
  };
  const onChangeUf = (v) => setUf(v.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase());

  // validação
  const isValid = useMemo(() => {
    const cepOk = cep.replace(/\D/g,'').length === 8;
    const ufOk  = /^[A-Z]{2}$/.test(uf);
    const numeroOk = /^[0-9]{1,4}[A-Za-z]?$/.test(numero);
    const obrigatoriosOk = logradouro && cidade && bairro;
    return cepOk && ufOk && numeroOk && obrigatoriosOk;
  }, [cep, uf, numero, logradouro, cidade, bairro]);

  const handleContinuar = () => {
    if (!isValid) return;
    const endereco = { logradouro, numero, complemento, cep, uf, cidade, bairro };
    navigation.navigate('CadastroConfirmacao', {
      endereco,
      dadosCadastro: route?.params?.dadosCadastro ?? null,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Cabeçalho e indicador de progresso (Cadastro = concluído / Endereço = atual / Confirmação = próxima) */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Endereço</Text>
        <View style={styles.progressIndicator}>
          <View style={styles.progressDotDone} />     {/* etapa anterior (CadastroForm) — verde */}
          <View style={styles.progressDotActive} />   {/* etapa atual (Endereço) — cinza forte */}
          <View style={styles.progressDot} />         {/* próxima — cinza claro */}
        </View>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>Adicione seu Endereço</Text>
      </View>

      {/* Campos */}
      <View style={styles.formSection}>
        <TextInput style={styles.input} placeholder="Endereço*" value={logradouro} onChangeText={setLogradouro} />
        <TextInput style={styles.input} placeholder="Número*" value={numero} onChangeText={onChangeNumero} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
        <TextInput style={styles.input} placeholder="CEP*" value={cep} onChangeText={onChangeCep} keyboardType="numeric" />

        {/* UF como dropdown */}
        <View style={{ zIndex: 10 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.input, styles.dropdownTrigger]}
            onPress={() => setUfOpen(v => !v)}
          >
            <Text style={{ color: uf ? '#333' : '#999' }}>{uf || 'Estado (UF)*'}</Text>
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>

          {ufOpen && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 200 }}>
                {UFS.map(sigla => (
                  <TouchableOpacity key={sigla} style={styles.dropdownItem} onPress={() => { setUf(sigla); setUfOpen(false); }}>
                    <Text style={styles.dropdownItemText}>{sigla}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <TextInput style={styles.input} placeholder="Cidade*" value={cidade} onChangeText={setCidade} />
        <TextInput style={styles.input} placeholder="Bairro*" value={bairro} onChangeText={setBairro} />
      </View>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !isValid && { opacity: 0.6 }]}
          onPress={handleContinuar}
          disabled={!isValid}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAE5D9', paddingHorizontal: 20 },
  header: { alignItems: 'center', paddingVertical: 20 },
  headerText: { fontSize: 16, color: '#666' },

  /* indicador de progresso */
  progressIndicator: { flexDirection: 'row', marginTop: 5 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  progressDotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: DOT_ACTIVE, marginHorizontal: 4 },
  progressDotDone: { width: 8, height: 8, borderRadius: 4, backgroundColor: DOT_DONE, marginHorizontal: 4 },

  mainContent: { alignItems: 'center', marginBottom: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },

  formSection: { width: '100%', marginBottom: 20 },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: 'transparent', // <- fundo transparente como no Figma
  },

  /* Dropdown UF */
  dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 12 },
  dropdownArrow: { fontSize: 16, color: '#999', marginLeft: 8 },
  dropdownList: {
    position: 'absolute', top: 52, left: 0, right: 0,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemText: { fontSize: 16, color: '#333' },

  /* Botões no padrão do Figma */
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, marginTop: 10 },
  backButton: {
    flex: 1,
    backgroundColor: 'transparent',     // sem fundo
    borderColor: ORANGE,
    borderWidth: 2,                      // borda mais forte
    borderRadius: 20,                    // raio mais próximo do Figma
    paddingVertical: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  backButtonText: { color: ORANGE, fontSize: 16, fontWeight: 'bold' },

  continueButton: {
    flex: 1,
    backgroundColor: ORANGE,             // preenchido
    borderRadius: 20,
    paddingVertical: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
