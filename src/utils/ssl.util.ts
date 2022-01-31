import * as fs from 'fs';

/**
 * generatereturn private key path
 */
export function certificatePath() {
  //return fs.readFileSync(path.join(__dirname, './../cert/cert.csr'), 'utf8');
  return fs.readFileSync('./src/assets/cert/certificate.pem', 'utf8');
};

/**
 * generatereturn private key path
 */
 export function keyPath() {
  //return fs.readFileSync(path.join(__dirname, './../cert/priv.key'), 'utf8');
  return fs.readFileSync('./src/assets/cert/key.pem', 'utf8');
};
