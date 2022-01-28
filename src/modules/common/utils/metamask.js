import config from '@/config/metamask.json';

const Metamask = {
  chainId: () => {
    return function() {
      return {
        // get user's current metamask chainId.
        get: async function() {
          return await window.ethereum.request({ method: 'eth_chainId' });
        },

        // add a chainId to user's metamask.
        add: async function(chainId) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [config[chainId]],
          });
        },

        // switch to a different chainId.
        switchTo: async function(chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }]
            });
          } catch (err) {
            // If failed because the chainId doesnt exist in metamask, add it first.
            if (err.message.startsWith('Unrecognized chain ID')) {
              await this.add(chainId);
              return await this.switchTo(chainId);
            }
          }
        }
      }
    }();
  },
};

export default Metamask;
