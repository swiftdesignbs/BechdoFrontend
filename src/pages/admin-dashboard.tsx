import { CONFIG } from 'src/config-global';

import { AdminDashboardView } from 'src/sections/admin-dashboard';

// ----------------------------------------------------------------------

export default function AdminDashboardPage() {
  return (
    <>
      <title>{`Admin Dashboard - ${CONFIG.appName}`}</title>

      <AdminDashboardView />
    </>
  );
}