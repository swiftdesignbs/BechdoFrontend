import { CONFIG } from 'src/config-global';

import { AdminBrandView } from 'src/sections/admin-brand';

// ----------------------------------------------------------------------

export default function AdminBrandPage() {
  return (
    <>
      <title>{`Brand Management - ${CONFIG.appName}`}</title>

      <AdminBrandView />
    </>
  );
}