import { CONFIG } from 'src/config-global';

import { AdminProductsView } from 'src/sections/admin-products';

// ----------------------------------------------------------------------

export default function AdminProductsPage() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <AdminProductsView />
    </>
  );
}