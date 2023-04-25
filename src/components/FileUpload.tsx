import ftpClient from 'basic-ftp';
import React, { useState } from 'react';
import { Readable } from 'stream';

interface FileUploadProps {
  serverUrl: string;
  username: string;
  password: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ serverUrl, username, password }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      return;
    }

    const client = new ftpClient.Client();
    try {
      await client.access({
        host: serverUrl,
        user: username,
        password: password,
      });

      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result as ArrayBuffer;
        const fileStream = new Readable();
        fileStream.push(Buffer.from(fileContent));
        fileStream.push(null);
        await client.uploadFrom(fileStream, '/remote/path/' + file.name);
        console.log('File uploaded successfully!');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
    } finally {
      client.close();
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
