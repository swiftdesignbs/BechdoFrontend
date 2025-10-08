import { CONFIG } from 'src/config-global';

import { AdminOrderStatusView } from 'src/sections/admin-order-status';

// ----------------------------------------------------------------------

export default function AdminOrderStatusPage() {
  return (
    <>
      <title>{`Order Status Management - ${CONFIG.appName}`}</title>

      <AdminOrderStatusView />
    </>
  );
}