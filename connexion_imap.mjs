import Imap from 'node-imap';
import * as dotenv from 'dotenv'
dotenv.config();

const imap = new Imap({
    user: process.env.MAIL_AUTH_USER,
    password: process.env.MAIL_AUTH_PASSWORD,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    tls: process.env.TLS
});

export default imap;