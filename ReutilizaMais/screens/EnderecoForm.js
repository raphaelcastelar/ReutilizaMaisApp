import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function EnderecoForm({ navigation, route }) {
  // --- Estados dos campos ---
  const [logradouro, setLogradouro] = useState('');  // rua/avenida
  const [numero, setNumero] = useState('');          // ex.: 1234A
  const [complemento, setComplemento] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');                  // SP, RJ...
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');

  // controle do dropdown e lista de UFs ***
  const [ufOpen, setUfOpen] = useState(false);
  const UFS = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
    'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
  ];

  // --- formatação/entrada ---

  // Formata CEP em tempo real: mantém só dígitos, limita a 8, e insere traço 12345-678
  const formatCEP = (v) =>
    v.replace(/\D/g, '')            // remove tudo que NÃO é dígito
     .slice(0, 8)                   // limita a 8 dígitos
     .replace(/(\d{5})(\d{0,3})/,   // insere traço após 5 dígitos
      (_, p1, p2) => (p2 ? `${p1}-${p2}` : p1)
     );

  const onChangeCep = (v) => setCep(formatCEP(v));

  // Validação de Número:
  // permite até 4 dígitos SEGUIDOS de 1 letra opcional (ex.: "12A", "1001B").
  // Se o usuário digitar letra minúscula, converte para maiúscula.
  const onChangeNumero = (v) => {
    const regex = /^(\d{0,4})([A-Za-z]{0,1})$/; // <-- regra principal do número
    const match = v.match(regex);
    if (match) setNumero(match[0].toUpperCase());
    // Se não casar com a regra, simplesmente IGNORA a digitação "extra"
  };

  // UF: mantém apenas letras, limita a 2 e joga para maiúsculo (ex.: "sp" -> "SP")
  // (Deixei a função aqui, mas o dropdown abaixo usa setUf diretamente)
  const onChangeUf = (v) =>
    setUf(v.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase());

  // --- Validação geral para habilitar o botão Continuar ---
  const isValid = useMemo(() => {
    // CEP válido = exatamente 8 dígitos (ignorando o traço)
    const cepOk = cep.replace(/\D/g, '').length === 8;

    // UF válida = 2 letras maiúsculas
    const ufOk = /^[A-Z]{2}$/.test(uf);

    // Número válido = até 4 dígitos + 1 letra opcional
    const numeroOk = /^[0-9]{1,4}[A-Za-z]?$/.test(numero);

    // Campos obrigatórios preenchidos
    const obrigatoriosOk = logradouro && cidade && bairro;

    return cepOk && ufOk && numeroOk && obrigatoriosOk;
  }, [cep, uf, numero, logradouro, cidade, bairro]);

  // --- Avançar para a confirmação ---
  const handleContinuar = () => {
    if (!isValid) return;

    // Monta objeto de endereço com os nomes consistentes
    const endereco = { logradouro, numero, complemento, cep, uf, cidade, bairro };

    // Leva também os dados do passo anterior, se existirem
    navigation.navigate('CadastroConfirmacao', {
      endereco,
      dadosCadastro: route?.params?.dadosCadastro ?? null,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Cabeçalho e indicador de progresso */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Endereço</Text>
        <View style={styles.progressIndicator}>
          <View style={styles.progressDot} />
          <View style={styles.progressDotActive} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>Adicione seu Endereço</Text>
      </View>

      {/* Campos */}
      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          placeholder="Endereço*"
          value={logradouro}
          onChangeText={setLogradouro}
        />
        <TextInput
          style={styles.input}
          placeholder="Número*"
          value={numero}
          onChangeText={onChangeNumero}
          // teclado numérico ajuda, mas ainda permite a 1 letra pela nossa regra
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Complemento"
          value={complemento}
          onChangeText={setComplemento}
        />
        <TextInput
          style={styles.input}
          placeholder="CEP*"
          value={cep}
          onChangeText={onChangeCep}
          keyboardType="numeric"
        />

        {/* UF como dropdown */}
        <View style={{ zIndex: 10 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.input, styles.dropdownTrigger]}
            onPress={() => setUfOpen((v) => !v)}
          >
            <Text style={{ color: uf ? '#333' : '#999' }}>
              {uf || 'Estado (UF)*'}
            </Text>
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>

          {ufOpen && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 200 }}>
                {UFS.map((sigla) => (
                  <TouchableOpacity
                    key={sigla}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUf(sigla);
                      setUfOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{sigla}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        

        <TextInput
          style={styles.input}
          placeholder="Cidade*"
          value={cidade}
          onChangeText={setCidade}
        />
        <TextInput
          style={styles.input}
          placeholder="Bairro*"
          value={bairro}
          onChangeText={setBairro}
        />
      </View>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !isValid && { opacity: 0.6 }]}
          onPress={handleContinuar}
          disabled={!isValid}  // botão só habilita quando tudo válido
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
  progressIndicator: { flexDirection: 'row', marginTop: 5 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  progressDotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#777', marginHorizontal: 4 },
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
    backgroundColor: '#fff',
  },

  // *** ESTILOS DO DROPDOWN ***
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  // *** FIM DOS ESTILOS ***

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#FF7F50',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  backButtonText: { color: '#FF7F50', fontSize: 16, fontWeight: 'bold' },
  continueButton: {
    flex: 1,
    backgroundColor: '#FF7F50',
    borderRadius: 30,
    paddingVertical: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
