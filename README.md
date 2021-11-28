# Phi

## Inspiration
Social networks and Blockchain are two areas I'm pretty much interested in. Social network, because that's what my daily work entails. Blockchain, because I love smart contracts and their decentralized aspect. Trying to bring both these worlds a bit closer is what inspired me to build Phi.

## What it does

To login to the dapp, the user needs to authenticate using their Metamask wallet through Moralis.

Once they are logged in, they can update their Profile details like name, about, and profile picture. If those are missing, *John Doe* and *Available* shall be used as the name and about respectively. Profile pictures are hosted on IPFS using Textile buckets. Profile information is stored using Ceramic Protocol (previously 3Box).

To start chatting with someone, they need to first send an invite request. Then can do that if they know the address of the contact. If this contact doesn't have a ceramic profile, the user shall be alerted about the same. Invite requests can only be sent to those having a ceramic profile. The contact can accept or reject the chat request. You can start chatting only if the invite is approved.

Chats are sent over IPFS using Textile threads that are accessible only to those two contacts. Image attachments can also be sent over chat. Moreover, both the messages and attachments are encrypted using Ceramic Protocol, and hence end-to-end encrypted.

One can also request loans from a contact in MATIC tokens. The user needs to specify the number of months in which the loan shall be repaid back. Once the lender has approved the loan (by sending over the MATIC tokens to the smart contract), the lendee can withdraw the money. Lendee can close the loan by repaying the amount of MATIC tokens.

## How I built it

###### Frontend

The web app is built using React and NextJS and is hosted on Vercel.

* **Material UI** = the react component library used to build the app
* **Moralis** = used for authentication with Metamask
* **Ceramic Protocol** = used for profile information, decentralized identity, as well as end-to-end encryption
* **Textile** = used to store images in IPFS (in buckets), and also chat messages (in threads)
* **Ethers.js** = for interacting with the Polygon Mumbai smart contract

###### Backend

Backend is comprised of a few APIs hosted on Vercel. All then APIs trigger an update to the textile thread passed to the API. Both the lender and lendee (if online), will be listening for any update to this thread, to trigger an update to check the loan status from the smart contract.

###### Blockchain

It has a smart contract running in Polygon Mumbai testnet, that is integrated with Chainlink. The smart contract keeps track of the loan and its status. Operations like creating a loan, approving a loan, receiving a loan, and closing a loan can be performed.

Any time, there is supposed to be an update to the status of a loan, it triggers a Chainlink job, that calls the respective API, which will send an update for that loan to both the lender and the lender. Once the chainlink job finishes successfully, it updates the loan status to the expected status.

The smart contract was deployed to Polygon Mumbai testnet using HardHat.

## Challenges I ran into

* Working with Ceramic protocol did take a bit of time, as there were too many topics to cover and too few examples in the documentation. But 3Box team members were pretty helpful and hence were able to handle all my use cases after some trial and error.

* As I had worked with Chainlink a few times before, integrating my smart contract with Chainlink was pretty easy. But this was the first time I was using Polygon with Chainlink. The lack of a Chainlink job explorer (like the one in Kovan) did hinder the integration a bit.

* Debugging smart contract errors was no easy task. It took a few iterations and deployments of the solidity code to get it all working fine.

## Accomplishments that I'm proud of

* Decentralized identity tied to Ceramic Protocol. One can update their name, description, and background image.

* Chat invitation and acknowledgment built on IPFS using Textile threads. One can send an invitation to ethereum addresses, and once they approve, they are added to their contact lists, all in real-time!

* p2p loans. Contrarily to collateral-based defi loans, in Phi, we have p2p loans where the loans are between "friends". One can request loans from friends, repay, and so on. No limits at all!

* UI/UX. Clean and modern responsive design created from scratch.

## What I have learned

* Building decentralized social applications (like Phi) on Blockchain and IPFS is simplified a lot thanks to Ceramic Protocol (previously 3Box) and IPFS (thanks to Textile). These are going to be a game-changer in the metaverse world.

* Though I had been a Solidity learner for quite some time, this hackathon has helped me learn more, with respect to solidity code, debugging, testnets, oracles, and so on.

## What's next for Phi
* Chat
    * Support emojis
    * Support more attachment formats
    * Support audio calls, video calls, and so on
* Loans
    * See how much total owed, and owe per contact, and in total
    * See remaining days for a loan before repayment
* Defi
     * Perform defi actions with a contact
     * Transfer other cryptos between contacts
