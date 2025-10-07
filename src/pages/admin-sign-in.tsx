import { CONFIG } from 'src/config-global';

import { AdminSignInView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function AdminSignInPage() {
  return (
    <>
      <title>{`Admin Sign in - ${CONFIG.appName}`}</title>

      <AdminSignInView />
    </>
  );
}