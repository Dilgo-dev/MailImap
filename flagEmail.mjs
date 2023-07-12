import imap from "./connexion_imap.mjs";

function flagEmail(messageId, flag, removed = false ) {
  return new Promise((resolve, reject) => {

    imap.connect();

    imap.on('ready', () => {

      imap.openBox('INBOX', false, (err, box) => {
        if (err) { console.error('Error opening mailbox:', err); reject(err); return; }

        const fetch = imap.fetch(messageId, { bodies: ['HEADER', 'TEXT'] });

        fetch.on('message', (msg) => {
          msg.once('attributes', (attrs) => {
            const existingFlags = attrs.flags || [];
            if (removed && existingFlags.includes(flag)) {
                imap.delFlags(messageId, flag, (delFlagsErr) => {
                    if (delFlagsErr) { console.error('Error setting flags:', delFlagsErr); reject(delFlagsErr); return; };

                    imap.end(); 
                    resolve();
                });
            } else if (!(removed)) {
                imap.addFlags(messageId, flag, (setFlagsErr) => {
                    if (setFlagsErr) { console.error('Error setting flags:', setFlagsErr); reject(setFlagsErr); return; }

                    imap.end();
                    resolve();
                });
            } else {
                imap.end();
                resolve();
            }

          });
        });

        fetch.on('error', (err) => {
            console.error('IMAP connection error:', err);
            reject(err); 
        });

    });

    imap.on('error', (err) => {
      console.error('IMAP connection error:', err);
      reject(err);
    });
  });
})
};

const messageId = 43;
const flag = '\\Deleted';

flagEmail(messageId, flag)
