const ETH_CHAIN_ID_INTEGER = 4;
const rpcUrl = `https://rinkeby.infura.io/v3/${process.env.INFURA_APP_KEY}`;

/*
 * @refer https://docs.blocknative.com/onboard#options
 */
export const onboardDefaults = {
  networkId: ETH_CHAIN_ID_INTEGER,
  hideBranding: true,
  darkMode: true,
  walletSelect: {
    wallets: [
      { walletName: 'metamask' },
      { walletName: 'ledger', rpcUrl },
    ],
  },
  walletCheck: [
    { checkName: 'derivationPath' },
    { checkName: 'connect' },
    { checkName: 'accounts' },
    { checkName: 'network' },
  ],
};
