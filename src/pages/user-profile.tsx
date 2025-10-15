import { CONFIG } from 'src/config-global';

import { UserProfileView } from 'src/sections/user-profile';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  return (
    <>
      <title>{`Profile Settings - ${CONFIG.appName}`}</title>

      <UserProfileView />
    </>
  );
}