openssl genrsa -des3 -out private.pem 2048
phrase:motodey
openssl rsa -in private.pem -outform PEM -pubout -out public.pem


openssl genrsa -out config/jwt/private.pem -aes256 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem


openssl genrsa -out src/cert/private.pem -aes256 4096
openssl rsa -pubout -in src/cert/private.pem -out src/cert/public.pem
phrase:sslcertificationmotodey
sslcertificationmotodey


#generate the RSA private key
openssl genpkey -outform PEM -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out priv.key

#Create the CSR (Click csrconfig.txt in the command below to download config)
openssl req -new -nodes -key priv.key -config csrconfig.txt -nameopt utf8 -utf8 -out cert.csr