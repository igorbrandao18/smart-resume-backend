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

async function simulateUserRegistration() {
  try {
    console.log('\n🚀 Iniciando simulação do fluxo de cadastro...\n');

    // 1. Cadastro inicial
    console.log('📝 Etapa 1: Cadastro inicial do usuário');
    const createUserResponse = await axios.post(`${API_URL}/users`, {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '11999887766'
    });

    const userId = createUserResponse.data.id;
    const verificationCode = createUserResponse.data.verificationCode;
    console.log('✅ Usuário criado com sucesso!');
    console.log(`📧 Código de verificação enviado para: ${createUserResponse.data.email}\n`);

    await sleep(2000);

    // 2. Verificação de email
    console.log('🔐 Etapa 2: Verificação do email');
    await axios.post(`${API_URL}/users/verify-email/${userId}`, {
      code: verificationCode
    });
    console.log('✅ Email verificado com sucesso!\n');

    await sleep(2000);

    // 3. Atualização dos dados
    console.log('📝 Etapa 3: Atualização dos dados do usuário');
    const updateUserResponse = await axios.put(`${API_URL}/users/${userId}`, {
      secondaryEmail: 'joao.silva.trabalho@example.com',
      cnpj: '12345678000190',
      zipCode: '01001000'
    });

    console.log('✅ Dados atualizados com sucesso!');
    console.log('\nDados do usuário:');
    console.log(JSON.stringify(updateUserResponse.data, null, 2));

    // 4. Busca do usuário
    console.log('\n🔍 Etapa 4: Busca do usuário');
    const getUserResponse = await axios.get(`${API_URL}/users/${userId}`);
    console.log('✅ Usuário encontrado:');
    console.log(JSON.stringify(getUserResponse.data, null, 2));

    console.log('\n✨ Simulação concluída com sucesso! ✨');

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Erro na simulação:', error.response?.data?.message || error.message);
    } else {
      console.error('\n❌ Erro inesperado:', error);
    }
  } finally {
    rl.close();
  }
}

// Executa a simulação
simulateUserRegistration(); 