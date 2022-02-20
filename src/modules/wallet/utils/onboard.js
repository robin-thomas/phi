import BNCOnboard from 'bnc-onboard';
import { ethers } from 'ethers';

import { onboardDefaults, SAVED_WALLET_KEY } from '../constants/defaults';

let onboard = null;

export const login = async (setProvider) => {
  onboard = BNCOnboard({
    ...onboardDefaults,
    subscriptions: {
      wallet: async (wallet) => {
        if (wallet.provider) {
          const provider = new ethers.providers.Web3Provider(wallet.provider);
          await provider.ready;

          try {
            await provider.getSigner().getAddress();

            window.localStorage.setItem(SAVED_WALLET_KEY, wallet.name);
            setProvider(provider);
          } catch (err) {}
        } else {
          window.localStorage.removeItem(SAVED_WALLET_KEY);
          setProvider(null);
        }
      },
    },
  });

  // Check if any wallet stored in localStorage.
  const wallet = window.localStorage.getItem(SAVED_WALLET_KEY);

  await onboard.walletSelect(wallet || undefined);
  await onboard.walletCheck();
}

export const isLoggedIn = () => Boolean(window.localStorage.getItem(SAVED_WALLET_KEY));

export const logout = () => onboard.walletReset();
