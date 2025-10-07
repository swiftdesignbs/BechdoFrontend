import { CONFIG } from 'src/config-global';

import { AdminVendorsView } from 'src/sections/admin-vendors';

// ----------------------------------------------------------------------

export default function AdminVendorsPage() {
  return (
    <>
      <title>{`Vendor Management - ${CONFIG.appName}`}</title>

      <AdminVendorsView />
    </>
  );
}