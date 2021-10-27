import { useContext } from 'react';

import { DataContext } from './DataProvider';

export const useAppContext = () => {
  return useContext(DataContext);
}
