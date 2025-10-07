import { CONFIG } from 'src/config-global';

import { AdminMediaView } from 'src/sections/admin-media';

// ----------------------------------------------------------------------

export default function AdminMediaPage() {
  return (
    <>
      <title>{`Media - ${CONFIG.appName}`}</title>

      <AdminMediaView />
    </>
  );
}