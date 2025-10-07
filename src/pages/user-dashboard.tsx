import { CONFIG } from 'src/config-global';

import { UserDashboardView } from 'src/sections/user-dashboard';

// ----------------------------------------------------------------------

export default function UserDashboardPage() {
  return (
    <>
      <title>{`User Dashboard - ${CONFIG.appName}`}</title>

      <UserDashboardView />
    </>
  );
}