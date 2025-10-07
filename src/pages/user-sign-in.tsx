import { CONFIG } from 'src/config-global';

import { UserSignInView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function UserSignInPage() {
  return (
    <>
      <title>{`User Sign in - ${CONFIG.appName}`}</title>

      <UserSignInView />
    </>
  );
}