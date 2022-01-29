import BNCOnboard from 'bnc-onboard';
import { ethers } from 'ethers';

import { onboardDefaults } from '../constants/defaults';

let onboard = null;

export const login = async (setProvider) => {
  onboard = BNCOnboard({
    ...onboardDefaults,
    subscriptions: {
      wallet: wallet => {
        if (wallet.provider) {
          setProvider(new ethers.providers.Web3Provider(wallet.provider, 'any'))
        } else {
          setProvider(null);
        }
      },
    },
  });

  await onboard.walletSelect();
  await onboard.walletCheck();
}

export const logout = () => onboard.walletReset();
