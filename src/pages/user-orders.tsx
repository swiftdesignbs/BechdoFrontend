import { CONFIG } from 'src/config-global';

import { UserOrdersView } from 'src/sections/user-orders';

// ----------------------------------------------------------------------

export default function UserOrdersPage() {
  return (
    <>
      <title>{`My Orders - ${CONFIG.appName}`}</title>

      <UserOrdersView />
    </>
  );
}