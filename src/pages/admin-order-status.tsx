import { CONFIG } from 'src/config-global';

import { AdminBrandView } from 'src/sections/admin-order-status';

// ----------------------------------------------------------------------

export default function AdminOrderStatusPage() {
  return (
    <>
      <title>{`Order Status Management - ${CONFIG.appName}`}</title>

      <AdminBrandView />
    </>
  );
}