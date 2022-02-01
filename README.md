<p align="center">
  <a href="https://connect-phi.vercel.app/" target="_blank">
    <img src="https://i.imgur.com/EUlj7up.png" height="128">
    <h1 align="center">Phi</h1>
  </a>
</p>

<p align="center">
 <a aria-label="GitHub Release" href="https://github.com/robin-thomas/phi/releases" target="_blank">
    <img alt="" src="https://img.shields.io/github/v/release/robin-thomas/phi?labelColor=000&sort=semver&style=for-the-badge">
  </a>
 <a aria-label="Last Modified" href="https://github.com/robin-thomas/phi/releases" target="_blank">
    <img src="https://img.shields.io/github/release-date/robin-thomas/phi?style=for-the-badge&labelColor=000">
  </a>
  <a aria-label="License" href="https://github.com/robin-thomas/phi/blob/main/LICENSE" target="_blank">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000">
  </a>
  <a aria-label="Join the community on GitHub" href="https://github.com/ipfs/community/discussions/717" target="_blank">
    <img alt="" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&labelColor=0000&logo=github&logoWidth=20">
  </a>
</p>

## Inspiration
Social networks and Blockchain are two areas I'm pretty much interested in. Social network, because that's what my daily work entails. Blockchain, because I love smart contracts and their decentralized aspect. Trying to bring both these worlds a bit closer is what inspired me to build Phi.

## What it does

To login to the dapp, the user needs to authenticate using their Metamask wallet through Moralis.

Once they are logged in, they can update their Profile details like name, about, and profile picture. If those are missing, *John Doe* and *Available* shall be used as the name and about respectively. Profile pictures are hosted on IPFS using Textile buckets. Profile information is stored using Ceramic Protocol (previously 3Box).

To start chatting with someone, they need to first send an invite request. Then can do that if they know the address of the contact. If this contact doesn't have a ceramic profile, the user shall be alerted about the same. Invite requests can only be sent to those having a ceramic profile. The contact can accept or reject the chat request. You can start chatting only if the invite is approved.

Chats are sent over IPFS using Textile threads that are accessible only to those two contacts. Image attachments can also be sent over chat. Moreover, both the messages and attachments are encrypted using Ceramic Protocol, and hence end-to-end encrypted.

## How I built it

The web app is built using React and NextJS and is hosted on Vercel.

* **Material UI** = the react component library used to build the app
* **Moralis** = used for authentication with Metamask
* **Ceramic Protocol** = used for profile information, decentralized identity, as well as end-to-end encryption
* **Textile** = used to store images in IPFS (in buckets), and also chat messages (in threads)

## Challenges I ran into

* Working with Ceramic protocol did take a bit of time, as there were too many topics to cover and too few examples in the documentation. But 3Box team members were pretty helpful and hence were able to handle all my use cases after some trial and error.

## Accomplishments that I'm proud of

* Decentralized identity tied to Ceramic Protocol. One can update their name, description, and background image.

* Chat invitation and acknowledgment built on IPFS using Textile threads. One can send an invitation to ethereum addresses, and once they approve, they are added to their contact lists, all in real-time!

* UI/UX. Clean and modern responsive design created from scratch.
