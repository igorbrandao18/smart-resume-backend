# Teste Técnico para Contratação de Desenvolvedor

## Objetivo
O objetivo deste teste técnico é avaliar as habilidades na criação de uma aplicação web utilizando **Node.js**, **NestJS** e **Vue.js (Composition API)**, além de solucionar novos desafios com boas práticas de desenvolvimento.

## Entregáveis
- Criar um repositório no GitHub em até **5 dias** com o código-fonte completo.
- Enviar o link do repositório para **fabiano@notoriun.com.br**.

---

## 🔹 Fluxo do Usuário e Telas do Sistema

### **1. Tela Inicial – Cadastro de Usuário**
- O usuário acessa a aplicação e visualiza um formulário de cadastro.
- Campos obrigatórios: **Nome, Celular e E-mail**.
- Aplicação de **máscara no campo celular**.
- Validação de **campos obrigatórios e formato do e-mail**.
- Após preencher os dados, o usuário clica em **Cadastrar**.

### **2. Tela de Validação de E-mail**
- O sistema exibe um campo para inserção do **código de validação** enviado por e-mail.
- O usuário insere o código de 6 dígitos e confirma.
- Se o código for incorreto, exibir **mensagem de erro**.
- Se não recebeu o código, pode clicar em **“Não recebi o código”** para solicitar um novo envio.
- Após validação bem-sucedida, o usuário é redirecionado para a próxima etapa.

### **3. Tela de Informações Complementares**
- O usuário precisa preencher os seguintes campos adicionais:
  - **CNPJ** (se aplicável).
  - **E-mail secundário** (opcional).
  - **Endereço completo** (Rua, Número, Bairro, Cidade, Estado, CEP).
- O sistema utiliza a **API ViaCEP** para preencher automaticamente os dados baseados no CEP inserido.
- Validação de **campos obrigatórios e formato de CNPJ**.
- Após preencher os dados, o usuário clica em **Continuar**.

### **4. Tela de Localização Geográfica**
- O sistema exibe um mapa interativo utilizando **SDK da ESRI**.
- O endereço fornecido na etapa anterior é usado para definir a localização inicial do usuário.
- O usuário pode **ajustar manualmente a localização** no mapa caso necessário.
- Ao confirmar a localização, os dados são salvos e o cadastro é concluído.
- O usuário recebe uma **mensagem de sucesso** e é redirecionado para a tela de login ou dashboard (caso aplicável).

---

## 🔹 Requisitos do Projeto

### **Backend**
O backend deverá ser desenvolvido com **Node.js** e **NestJS** e deve incluir:
- **Endpoints RESTful** para CRUD de usuários.
- Banco de dados **PostgreSQL** com **TypeORM**.
- **Validação de dados de entrada** usando **DTOs e Pipes**.
- Envio de e-mail de confirmação via **SMTP do Ethereal** (ambiente de desenvolvimento).

### **Frontend**
O frontend deverá ser desenvolvido com **Vue.js (Composition API)** e incluir:
- Formulários responsivos para auto cadastro de usuários.
- Validação de dados no frontend antes de enviar ao backend.
- **Feedback visual** para sucesso ou erro das operações.
- Estilização com **TailwindCSS** para um design moderno e responsivo.
- Tela de geolocalização obrigatoriamente utilizando **SDK da ESRI**.

---

## 🔹 Uso de TailwindCSS
### **Motivo da Escolha**
O TailwindCSS é um framework de estilização baseado em classes utilitárias que permite criar interfaces modernas de forma rápida e eficiente. No contexto deste projeto, ele será utilizado para:
- Criar componentes estilizados sem a necessidade de CSS externo.
- Garantir uma estrutura responsiva e acessível.
- Facilitar a manutenção e reaproveitamento de estilos.
- Reduzir o tempo de desenvolvimento, utilizando classes pré-definidas.

### **Padrões de Estilização**
Para manter a consistência do design, as seguintes práticas devem ser adotadas:
- **Uso de classes utilitárias** para estilização direta no template Vue.
- **Criação de componentes reutilizáveis** para botões, inputs e containers.
- **Uso de variantes e estados dinâmicos** para controle de estilos interativos.
- **Personalização através do arquivo tailwind.config.js** para adicionar cores, fontes e espaçamentos customizados.

### **Benefícios de TailwindCSS para o Projeto**
✅ Facilidade de manutenção e escalabilidade.
✅ Melhor desempenho por evitar estilos CSS desnecessários.
✅ Maior produtividade ao reduzir o tempo de estilização manual.
✅ Código mais limpo, sem a necessidade de arquivos CSS adicionais.

---

## 🔹 Critérios de Avaliação

✅ **Estrutura e configuração correta do projeto**  
✅ **Organização do código e boas práticas**  
✅ **Implementação completa dos requisitos**  
✅ **Domínio de tecnologias mencionadas (Node.js, NestJS, Vue.js)**  
✅ **Documentação clara (README)**  
✅ **Interface amigável e funcional**

---

## 🔹 Passo a Passo Sugerido

1. **Configuração Inicial:**
   - Criar um monorepo com **PNPM** e **Turborepo** (opcional).
   - Configurar backend (NestJS) e frontend (Vue.js).

2. **Desenvolvimento do Backend:**
   - Configurar banco de dados PostgreSQL com TypeORM.
   - Implementar endpoints para CRUD de usuários.
   - Criar DTOs e Pipes para validação de dados.
   - Configurar envio de e-mails com Ethereal.

3. **Desenvolvimento do Frontend:**
   - Criar formulários responsivos com validação.
   - Estilizar com **TailwindCSS**.
   - Implementar integração com o backend.

4. **Geolocalização:**
   - Integrar o **SDK ESRI** para exibição de mapas.
   - Implementar funcionalidade de ajuste manual de localização.

5. **Documentação:**
   - Criar um README claro e detalhado, incluindo:
     - Instruções de instalação e execução.
     - Configuração de variáveis de ambiente.
     - Uso de Docker para facilitar execução.

---

## Links Úteis
- [Ethereal Email](https://ethereal.email)
- [SDK da ESRI](https://developers.arcgis.com/javascript/latest/)
- [ViaCEP API](https://viacep.com.br/)
- [TailwindCSS](https://tailwindcss.com/)

---

📝 Caso tenha dúvidas durante a execução, entre em contato pelo e-mail **fabiano@notoriun.com.br**. Boa sorte! 🚀
