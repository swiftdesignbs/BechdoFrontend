import { CONFIG } from 'src/config-global';

import { AdminCustomersView } from 'src/sections/admin-customers';

// ----------------------------------------------------------------------

export default function AdminCustomersPage() {
  return (
    <>
      <title>{`Customer Management - ${CONFIG.appName}`}</title>

      <AdminCustomersView />
    </>
  );
}