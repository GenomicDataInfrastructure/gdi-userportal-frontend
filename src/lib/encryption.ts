import Cryptr from 'cryptr';

export function encrypt(text: string) {
  const secretKey = process.env.NEXTAUTH_URL!;
  const encryptor = new Cryptr(secretKey);
  return encryptor.encrypt(text);
}

export function decrypt(text: string) {
  const secretKey = process.env.NEXTAUTH_URL!;
  const encryptor = new Cryptr(secretKey);
  return encryptor.decrypt(text);
}
