import { useState } from 'react';
import ftp from 'ftp';

const FtpComponent = () => {
  const [message, setMessage] = useState('Connecting to FTP server...');

  const client = new ftp();

  client.on('ready', () => {
    setMessage('Connected to FTP server!');

    client.list((err, list) => {
      if (err) throw err;

      console.log(list);
    });

    client.end();
  });

  client.connect({
    host: 'ftp.example.com',
    user: 'user',
    password: 'password',
  });

  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

export default FtpComponent;
