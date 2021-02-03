import SecureStorage from 'secure-web-storage';
import AES from 'crypto-js/aes';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';

const SECRET_KEY = process.env.REACT_APP_STORAGE_KEY || '1A36591BCEEC49C832079E270D7E8B73';

const sls = new SecureStorage(localStorage, {
  hash: (key) => {
    key = HmacSHA256(key, SECRET_KEY);
    return key.toString();
  },
  encrypt: (data) => {
    data = AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  },
  decrypt: (data) => {
    data = AES.decrypt(data, SECRET_KEY);
    data = data.toString(Utf8);
    return data;
  },
});

export { sls };
