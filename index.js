require('dotenv').config()
const { 
    Client, 
    TopicCreateTransaction, 
    PrivateKey, 
    AccountCreateTransaction,
    Hbar, 
    TopicMessageSubmitTransaction,
    TopicMessageQuery
} = require('@hashgraph/sdk')
const bcrypt = require('bcrypt')
const cors = require('cors')
const express = require('express')
const app = express()

 
app.listen(8080, () => console.log('Hedera backend started'))
app.use(express.json())
app.use(cors())

app.get('/addUser', async (req, res) => {
    const { publicKey, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt) 
    // json db public_key : hashedPassword
})

app.post('/sendMail', async (req, res) => {
    const { to_address, subject, email_body, from_address } = req.body
    console.table({
        from_address,
        to_address,
        subject,
        email_body
    })
    const topicId = await createTopicId()
    const messageReceipt = await submitMessage(topicId, email_body)
    res.json({
        messageReceipt
    })
})


const initHedera = async () => {
    const accountId = process.env.HEDERA_ACCOUNT_ID
    const privateKey = process.env.HEDERA_TEST_PRIVATE_KEY
    
    if(accountId == null || privateKey == null){
        console.error('Error reading environment variables')
    }
    
    // 1. init client for testnet
    const client = Client.forTestnet()
    client.setOperator(accountId, privateKey)
    await client.ping()
    return (client)
}

const createTopicId = async () => {
    const client = await initHedera()
    const transactionId = await new TopicCreateTransaction().execute(client)
    const transactionReceipt = await transactionId.getReceipt(client)
    const topicId = transactionReceipt.topicId
    return topicId
    console.log(`Topic Id: ${topicId}`)
}

const submitMessage = async (topicId, message) => {
    const client = await initHedera()
    const messageId = await new TopicMessageSubmitTransaction({
        topicId,
        message
    }).execute(client)
    const receipt = await messageId.getReceipt(client)
    return receipt
}

const main = async () => {

    // 2. create new consensus service topic -> private channel/open message
    const transactionId = await new TopicCreateTransaction().execute(client)
    const transactionReceipt = await transactionId.getReceipt(client)
    const topicId = transactionReceipt.topicId
    console.log(`Topic Id: ${topicId}`)
 
    const newPrivateKey = await PrivateKey.generate()
    const newPublicKey = newPrivateKey.publicKey
    console.log(`New pub key = ${newPublicKey}\nNew Priv Key: ${newPrivateKey}`)

    // creating new transaction
    const newAccountTransactionResponse = await new AccountCreateTransaction()
                                                .setKey(newPublicKey)
                                                .setInitialBalance(Hbar.fromTinybars(1000))
                                                .execute(client)

    const getReceipt = await newAccountTransactionResponse.getReceipt(client)
    const newAccountId = getReceipt.accountId
    console.log(`New Account Id: ${newAccountId}`)

}

// main()

/*
    To send a mail.
    1 -> Users create a topic id.
        The hederaClient belongs to our server.
        The topic id is then mapped to the sentDb of our users.

    2 -> Users submit a message
        get the topic id mapped to the users account &
        message viz received from req.body

    Can the message be an object?
*/

// submitMessage('0.0.18697963')

const getAllMessages = async (topicId) => {
    const client = await initHedera()
    new TopicMessageQuery()
        .setTopicId(topicId)
        .setStartTime(0)
        .subscribe(
            client,
            (message) => console.log(Buffer.from(message.contents, "utf8").toString())
        );
}
