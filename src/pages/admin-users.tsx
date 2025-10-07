import { CONFIG } from 'src/config-global';

import { AdminUserView } from 'src/sections/admin-user';

// ----------------------------------------------------------------------

export default function AdminUserPage() {
  return (
    <>
      <title>{`User Management - ${CONFIG.appName}`}</title>

      <AdminUserView />
    </>
  );
}