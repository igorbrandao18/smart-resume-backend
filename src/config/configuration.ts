export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'user_registration',
    ssl: process.env.DB_SSL === 'true'
  },
  mail: {
    host: process.env.MAIL_HOST ?? 'smtp.ethereal.email',
    port: parseInt(process.env.MAIL_PORT ?? '587', 10),
    user: process.env.MAIL_USER ?? 'ethereal.user@ethereal.email',
    pass: process.env.MAIL_PASS ?? 'ethereal.pass'
  }
}); 