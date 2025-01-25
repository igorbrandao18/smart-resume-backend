import * as nodemailer from 'nodemailer';

async function testMailConnection() {
  console.log('🔄 Testando conexão com servidor de email...\n');

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'keyon.nienow@ethereal.email',
      pass: 'Gn2u4TSUuwssreUveK'
    }
  });

  try {
    // Verifica a conexão
    await transporter.verify();
    console.log('✅ Conexão SMTP estabelecida com sucesso!\n');

    // Tenta enviar um email de teste
    const info = await transporter.sendMail({
      from: 'keyon.nienow@ethereal.email',
      to: 'igorbrandao18@gmail.com',
      subject: 'Teste de Conexão SMTP',
      html: `
        <h1>Teste de Email</h1>
        <p>Este é um email de teste para verificar a conexão SMTP.</p>
        <p>Hora do envio: ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Email de teste enviado com sucesso!');
    console.log('📧 ID da mensagem:', info.messageId);
    console.log('🔗 URL para visualizar o email:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error);
  }
}

testMailConnection(); 