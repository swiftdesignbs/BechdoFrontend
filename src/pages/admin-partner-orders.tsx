import { CONFIG } from 'src/config-global';
import { AdminPartnerOrdersView } from 'src/sections/admin-partner-orders';

export default function AdminPartnerOrdersPage() {
  return (
    <>
      <title>{`Partner Orders - ${CONFIG.appName}`}</title>
      <AdminPartnerOrdersView />
    </>
  );
}
