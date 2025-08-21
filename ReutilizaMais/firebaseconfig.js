import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave de API do SendGrid (insira diretamente aqui para desenvolvimento)
const SENDGRID_API_KEY = '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'; // Substitua por sua chave de API real do SendGrid

const firebaseConfig = {
  apiKey: "AIzaSyBq_XzVudO2TZo8OCJnZUBaE7ARyUa-Vvk",
  authDomain: "novva-d0b7a.firebaseapp.com",
  projectId: "novva-d0b7a",
  storageBucket: "novva-d0b7a.firebasestorage.app",
  messagingSenderId: "170588993350",
  appId: "1:170588993350:ios:ccd2ee9125c80f344d9747",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const verifyCpfAndPassword = async (cpf, password = null) => {
  try {
    const preCadastroRef = collection(db, 'pre_cadastro');
    const q = query(preCadastroRef, where('cpf', '==', cpf));
    const querySnapshot = await getDocs(q);

    console.log('Documentos encontrados:', querySnapshot.size);

    if (querySnapshot.empty) {
      console.log('Nenhum documento encontrado para o CPF:', cpf);
      return null;
    }

    const userDoc = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;

    console.log('Dados do documento:', userDoc);

    if (password) {
      if (userDoc.senha === password) {
        return { ...userDoc, id: userId };
      } else {
        return false;
      }
    }

    if (!userDoc.senha) {
      return ['senha_nao_cadastrada', userId];
    }

    return userDoc;
  } catch (error) {
    console.error('Erro ao verificar CPF:', error.message);
    return null;
  }
};

const getEmailByCpf = async (cpf) => {
  try {
    const preCadastroRef = collection(db, 'pre_cadastro');
    const q = query(preCadastroRef, where('cpf', '==', cpf));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0].data();
    return userDoc.email || null;
  } catch (error) {
    console.error('Erro ao buscar e-mail:', error.message);
    return null;
  }
};

const ensureDasDocument = async (cpf) => {
  try {
    const dasRef = collection(db, 'das');
    const q = query(dasRef, where('cpf', '==', cpf));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await setDoc(doc(dasRef, cpf), { cpf, status: 'pendente' });
    }
  } catch (error) {
    console.error('Erro ao garantir documento DAS:', error.message);
  }
};

const updatePasswordByCpf = async (cpf, newPassword) => {
  try {
    const preCadastroRef = collection(db, 'pre_cadastro');
    const q = query(preCadastroRef, where('cpf', '==', cpf));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = doc(db, 'pre_cadastro', querySnapshot.docs[0].id);
      await updateDoc(userDocRef, { senha: newPassword });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar senha:', error.message);
    return false;
  }
};

const sendNewPasswordEmail = async (email, newPassword) => {
  try {
    console.log('Enviando e-mail com SendGrid para:', email, 'com nova senha:', newPassword);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email }],
            subject: 'Nova Senha - Novva',
          },
        ],
        from: {
          email: 'novvacontabilidade@gmail.com', // Substitua pelo e-mail verificado no SendGrid
          name: 'Equipe Novva',
        },
        content: [
          {
            type: 'text/plain',
            value: `Olá,\n\nSua nova senha para o app Novva é: ${newPassword}\n\nPor favor, altere sua senha após fazer login.\n\nAtenciosamente,\nEquipe Novva`,
          },
        ],
      }),
    });

    if (response.status === 202) {
      console.log('E-mail enviado com sucesso via SendGrid');
      return { success: true, message: 'E-mail enviado com sucesso!' };
    } else {
      const errorText = await response.text();
      console.error('Erro ao enviar e-mail com SendGrid:', response.status, errorText);
      throw new Error(`Erro ao enviar e-mail: ${errorText}`);
    }
  } catch (error) {
    console.error('Erro ao enviar e-mail com SendGrid:', error.message);
    throw error;
  }
};

const registerPassword = async (cpf, password) => {
  try {
    const preCadastroRef = collection(db, 'pre_cadastro');
    const q = query(preCadastroRef, where('cpf', '==', cpf));
    const querySnapshot = await getDocs(q);

    let userName = 'Usuário';
    let oldDocId = null;

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].data();
      oldDocId = querySnapshot.docs[0].id;
      userName = userDoc.nome || 'Usuário';
      await deleteDoc(doc(db, 'pre_cadastro', oldDocId));
    }

    const newDocRef = doc(preCadastroRef, cpf);
    await setDoc(newDocRef, {
      cpf: cpf,
      senha: password,
      nome: userName,
    });

    return userName;
  } catch (error) {
    console.error('Erro ao cadastrar senha:', error.message);
    return null;
  }
};

const getNfsByCpf = async (cpf) => {
  try {
    const nfsRef = collection(db, 'nfs');
    const q = query(nfsRef, where('cpf', '==', cpf));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('Nenhuma NFs-e encontrada para o CPF:', cpf);
      return [];
    }

    const nfsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('NFs-e encontradas:', nfsList);
    return nfsList;
  } catch (error) {
    console.error('Erro ao buscar NFs-e:', error.message);
    return [];
  }
};

const getCnpjsByCpf = async (cpf) => {
  try {
    console.log('Acessando coleção:', `tomador/${cpf}/CNPJ`);
    const cnpjRef = collection(db, `tomador/${cpf}/CNPJ`);
    const querySnapshot = await getDocs(cnpjRef);

    if (querySnapshot.empty) {
      console.log('Nenhum CNPJ encontrado para o CPF:', cpf);
      return [];
    }

    const cnpjList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      cnpj: doc.data().cnpj || doc.id,
      ...doc.data(),
    }));
    return cnpjList;
  } catch (error) {
    console.error('Erro ao buscar CNPJs:', error.message);
    return [];
  }
};

export { verifyCpfAndPassword, getEmailByCpf, updatePasswordByCpf, sendNewPasswordEmail, registerPassword, ensureDasDocument, getNfsByCpf, getCnpjsByCpf, db, auth };