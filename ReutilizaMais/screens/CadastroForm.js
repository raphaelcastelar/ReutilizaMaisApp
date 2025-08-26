import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';

const CadastroForm = () => {
    // Definindo o estado para cada campo do formulário
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [email, setEmail] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [naturezaJuridica, setNaturezaJuridica] = useState('');
    const [representanteLegal, setRepresentanteLegal] = useState('');
    const [celular, setCelular] = useState('');
    const [cargo, setCargo] = useState('');

    //Validação de e-mail
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    //Validação de CNPJ
    const validateCNPJ = (cnpj) => {
        // Remove caracteres que não são dígitos
        cnpj = cnpj.replace(/[^\d]+/g, '');

        // Verifica se a string tem 14 dígitos
        if (cnpj.length !== 14) return false;

        // Evita CNPJs com todos os dígitos iguais
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        // Algoritmo de validação (primeiro dígito)
        let tamanho = 12;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(0))) return false;

        // Algoritmo de validação (segundo dígito)
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(1))) return false;

        return true;
        };


    // Função de exemplo para lidar com a submissão do formulário
    const handleContinuar = async () => {
        //validação do e-mail
        if (!validateEmail(email)) {
            alert('Por favor, insira um e-mail válido.');
        }

        //validação de CNPJ
        if (!validateCNPJ(cnpj)) {
            setCNPJError('Por favor, insira um CNPJ válido.');
        }
        if (emailError || cnpjError) {
            return;
        }

        setEmailError('');
        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        
        const formData = {
            razaoSocial,
            nomeFantasia,
            email,
            cnpj,
            naturezaJuridica,
            representanteLegal,
            celular,
            cargo,
        };
        
        console.log('Dados do formulário:', formData);
        Alert.alert('Concluído', 'Seu cadastro foi realizado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao submeter os dados cadastrais. Tente novamente.');
    } finally {
        setIsLoading(false);}
    };

    return (
        <ScrollView style={styles.container}>
            {/* Título e indicador de progresso */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Informações da empresa</Text>
                <View style={styles.progressIndicator}>
                    <View style={styles.progressDotActive} />
                    <View style={styles.progressDot} />
                    <View style={styles.progressDot} />
                </View>
            </View>

            {/* Seção principal de cadastro */}
            <View style={styles.mainContent}>
                <Text style={styles.mainTitle}>Faça o seu Cadastro</Text>
                
                {/* Seção da foto de perfil */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImagePlaceholder}>
                        <Image
                            source={{ uri: 'https://placehold.co/100x100/A0A0A0/ffffff?text=User' }}
                            style={styles.profileImage}
                        />
                        <View style={styles.addIconContainer}>
                            <Text style={styles.addIcon}>+</Text>
                        </View>
                    </View>
                </View>

                {/* Título de seção */}
                <Text style={styles.sectionTitle}>Informações pessoais</Text>
            </View>
            
            {/* Campos de Dados da Empresa */}
            <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Dados da Empresa</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Razão Social"
                    value={razaoSocial}
                    onChangeText={setRazaoSocial}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nome Fantasia"
                    value={nomeFantasia}
                    onChangeText={setNomeFantasia}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="CNPJ"
                    value={cnpj}
                    onChangeText={setCnpj}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Natureza Jurídica"
                    value={naturezaJuridica}
                    onChangeText={setNaturezaJuridica}
                />
            </View>

            {/* Campos de Dados do Representante */}
            <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Dados do Representante</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Representante Legal"
                    value={representanteLegal}
                    onChangeText={setRepresentanteLegal}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Celular"
                    value={celular}
                    onChangeText={setCelular}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Cargo"
                    value={cargo}
                    onChangeText={setCargo}
                />
            </View>

            {/* Seção de botões */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={handleContinuar}
                >
                    <Text style={styles.continueButtonText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAE5D9',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerText: {
        fontSize: 16,
        color: '#666',
    },
    progressIndicator: {
        flexDirection: 'row',
        marginTop: 5,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    progressDotActive: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#777',
        marginHorizontal: 4,
    },
    mainContent: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    profileSection: {
        position: 'relative',
        marginBottom: 20,
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#C4C4C4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D9D9D9',
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#1E90FF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    formSection: {
        width: '100%',
        marginBottom: 20,
    },
    formSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        marginTop: 20,
    },
    backButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#FF7F50',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 15,
        marginRight: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FF7F50',
        fontSize: 16,
        fontWeight: 'bold',
    },
    continueButton: {
        flex: 1,
        backgroundColor: '#FF7F50',
        borderRadius: 10,
        paddingVertical: 15,
        marginLeft: 10,
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CadastroForm;
