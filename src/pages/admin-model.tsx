import { CONFIG } from 'src/config-global';

import { AdminModelView } from 'src/sections/admin-model/admin-model-view';

// ----------------------------------------------------------------------

export default function AdminModelPage() {
  return (
    <>
      <title>{`Model Management - ${CONFIG.appName}`}</title>

      <AdminModelView />
    </>
  );
}