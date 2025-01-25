import axios from 'axios';
import * as readline from 'readline';
import { promisify } from 'util';

const API_URL = 'http://localhost:3000';
const sleep = promisify(setTimeout);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string) => new Promise((resolve) => rl.question(query, resolve));

async function displayMenu(): Promise<string> {
  console.log('\n🔹 Sistema de Cadastro de Usuários 🔹');
  console.log('1. Criar novo usuário');
  console.log('2. Verificar email');
  console.log('3. Reenviar código de verificação');
  console.log('4. Atualizar dados do usuário');
  console.log('5. Buscar usuário por ID');
  console.log('6. Sair');
  
  const option = await question('\nEscolha uma opção (1-6): ');
  return option;
}

async function createUser() {
  console.log('\n📝 Cadastro de novo usuário');
  const name = await question('Nome: ');
  const email = await question('Email: ');
  const phone = await question('Telefone: ');

  try {
    const response = await axios.post(`${API_URL}/users`, {
      name,
      email,
      phone
    });

    console.log('\n✅ Usuário criado com sucesso!');
    console.log('ID:', response.data.id);
    console.log('Código de verificação:', response.data.verificationCode);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Erro:', error.response?.data?.message || error.message);
    }
  }
}

async function verifyEmail() {
  console.log('\n🔐 Verificação de email');
  const userId = await question('ID do usuário: ');
  const code = await question('Código de verificação: ');

  try {
    const response = await axios.post(`${API_URL}/users/verify-email/${userId}`, { code });
    console.log('\n✅ Email verificado com sucesso!');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Erro:', error.response?.data?.message || error.message);
    }
  }
}

async function resendVerificationCode() {
  console.log('\n📧 Reenvio de código de verificação');
  const email = await question('Email: ');

  try {
    await axios.post(`${API_URL}/users/resend-verification`, { email });
    console.log('\n✅ Novo código enviado com sucesso!');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Erro:', error.response?.data?.message || error.message);
    }
  }
}

async function updateUser() {
  console.log('\n📝 Atualização de dados');
  const userId = await question('ID do usuário: ');
  const secondaryEmail = await question('Email secundário (opcional): ');
  const cnpj = await question('CNPJ (opcional): ');
  const zipCode = await question('CEP: ');

  const updateData: any = {};
  if (secondaryEmail) updateData.secondaryEmail = secondaryEmail;
  if (cnpj) updateData.cnpj = cnpj;
  if (zipCode) updateData.zipCode = zipCode;

  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, updateData);
    console.log('\n✅ Dados atualizados com sucesso!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Erro:', error.response?.data?.message || error.message);
    }
  }
}

async function findUser() {
  console.log('\n🔍 Busca de usuário');
  const userId = await question('ID do usuário: ');

  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    console.log('\n✅ Usuário encontrado:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Erro:', error.response?.data?.message || error.message);
    }
  }
}

async function main() {
  try {
    while (true) {
      const option = await displayMenu();

      switch (option) {
        case '1':
          await createUser();
          break;
        case '2':
          await verifyEmail();
          break;
        case '3':
          await resendVerificationCode();
          break;
        case '4':
          await updateUser();
          break;
        case '5':
          await findUser();
          break;
        case '6':
          console.log('\n👋 Até logo!');
          rl.close();
          return;
        default:
          console.log('\n❌ Opção inválida!');
      }

      await sleep(1000);
    }
  } catch (error) {
    console.error('\n❌ Erro inesperado:', error);
  } finally {
    rl.close();
  }
}

// Inicia o programa
main(); 