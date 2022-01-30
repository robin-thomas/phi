import { useEffect, useState } from 'react';

import { getProfile } from '../utils/ceramic';

const useWithProfiles = (addresses) => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const loadProfiles = async () => {
      for (const address of addresses) {
        const _profile = await getProfile(address);

        if (_profile?.name) {
          setProfiles(_profiles => [..._profiles, { ..._profile, address }]);
        }
      }
    }

    if (addresses?.length > 0) {
      setProfiles([]);
      loadProfiles();
    }
  }, [addresses]);

  return profiles;
}

export default useWithProfiles;
