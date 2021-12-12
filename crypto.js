const crypto = require('crypto')

// iv -> initialization vector
// message = private key
const main = async () => {
    const password = 'abcd123'
    // const message = '302e020100300506032b6570042204201ee8713bc663c1f3eb81247807a48facc15a93d308abb5a4f8cb7794f6af1517'
    const message = 'This is an imp email'
    const algorithm = 'aes-256-cbc'
    const initVector = crypto.randomBytes(16)

    // const securityKey = crypto.randomBytes(32)
    const hashedPassword = crypto.createHash('sha256').update(password).digest()
    console.log('Hashed Password: ', hashedPassword.toString('hex'), hashedPassword.length)
    const securityKey = hashedPassword

    // encrypting message
    const cipher = crypto.createCipheriv(algorithm, securityKey, initVector)
    let encryptedData = cipher.update(message, 'utf-8', 'hex')
    encryptedData += cipher.final('hex')
    console.log('Encrypted data: ', encryptedData)

    // decrypting message
    const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector)
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8')
    decryptedData += decipher.final('utf-8')
    console.log('Decrypted Data: ', decryptedData)
}
main()