import imap from "./connexion_imap.mjs";
import { MailParser } from 'mailparser';

export default async function getEmails() {
  return new Promise((resolve, reject) => {
    imap.connect();
    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          console.error('Error opening mailbox:', err);
          reject(err);
          return;
        }

        imap.search(['ALL'], (searchErr, results) => {
          if (searchErr) {
            console.error('Error searching mailbox:', searchErr);
            reject(searchErr);
            return;
          }

          const fetch = imap.fetch(results, { bodies: ['HEADER', 'TEXT'] });
          let count = 0; // Variable pour compter les e-mails traités

          fetch.on('message', (msg) => {
            let payloadMail = {};

            const parser = new MailParser();

            parser.on('headers', (headers) => {
              payloadMail.id = msg.id;
              payloadMail.flags = msg.flags;
              payloadMail.subject = headers.get('subject');
              payloadMail.address = headers.get('from').value[0].address;
              payloadMail.name = headers.get('from').value[0].name;
              payloadMail.date = headers.get('delivery-date');
            });

            parser.on('data', (data) => {
              if (data.type === 'text') {
                payloadMail.message = data.text;
              }
            });

            msg.on('body', (stream) => {
              stream.pipe(parser);
            });

            msg.on('attributes', (attrs) => {
              msg.id = attrs.uid;
              msg.flags = attrs.flags;
            });

            msg.on('end', () => {
              //console.log('== Flags:', msg.flags);
            });

            parser.on('end', () => {
              emails.push(payloadMail);
              count++; // Incrémente le compteur des e-mails traités

              // Vérifie si tous les e-mails ont été traités
              if (count === results.length) {
                imap.end(); // Ferme la connexion IMAP
                resolve(emails);
              }
            });
          });

          fetch.once('error', (fetchErr) => {
            console.error('Error fetching emails:', fetchErr);
            reject(fetchErr);
          });

          fetch.once('end', () => {
            // Vérifie si aucun e-mail n'a été trouvé
            if (results.length === 0) {
              imap.end(); // Ferme la connexion IMAP
              resolve(emails);
            }
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error(err);
      reject(err);
    });
  });
}

const emails = await getEmails();
console.log('Emails', emails);
