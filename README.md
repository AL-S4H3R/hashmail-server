# What is Hashmail?

### Hashmail intends to be a decentralized communication service.
1. It leverages Hedera Consensus Service to approve the messages.
2. Alice sends an email to Bob 
3. This creates a new topic Id and adds the message to HCS.
4. The message is then queued for approval.
5. The Backend is subscribed to a mirror node which listens for aprroval.
6. As soon as it is approved, Bob can then receive the email.
### All of the above is accomplished via the users wallet(Metamask in this case)

### Future iterations.

In order to make it truly decentralized, all the messages will be encrypted using a Tripple Diffie Hellman.
The users wallets supply the private keys, which can make the encryption possible.
