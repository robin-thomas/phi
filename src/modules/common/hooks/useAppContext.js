import { useContext } from 'react';

import { DataContext } from '../components/DataProvider';

const useAppContext = () => {
  return useContext(DataContext);
}

export default useAppContext;
