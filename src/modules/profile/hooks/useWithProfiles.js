import { useEffect, useState } from 'react';

import { getProfile } from '../utils/ceramic';

const useWithProfiles = (addresses) => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    (async () => {
      if (addresses?.length > 0) {
        for (const address of addresses) {
          const _profile = await getProfile(address);

          if (_profile?.name) {
            setProfiles(_profiles => [..._profiles, { ..._profile, address }]);
          }
        }
      }
    })();
  }, [addresses]);

  return profiles;
}

export default useWithProfiles;
