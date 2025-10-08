import { CONFIG } from 'src/config-global';
import { AdminCustomerOrdersView } from 'src/sections/admin-customer-orders';

export default function AdminCustomerOrdersPage() {
  return (
    <>
      <title>{`Customer Orders - ${CONFIG.appName}`}</title>
      <AdminCustomerOrdersView />
    </>
  );
}
