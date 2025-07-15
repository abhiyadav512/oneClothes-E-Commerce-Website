import CryptoJS from "crypto-js";

const SECRET_KEY =import.meta.env.VITE_SECRET_HASH ; 

export const encryptUser = (userObj) => {
  const userString = JSON.stringify(userObj);
  const encrypted = CryptoJS.AES.encrypt(userString, SECRET_KEY).toString();
  return encrypted;
};

export const decryptUser = (encryptedUser) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
};
