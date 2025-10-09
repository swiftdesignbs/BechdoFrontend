import { CONFIG } from 'src/config-global';
import { AdminCityOrdersView } from 'src/sections/admin-city-orders';

export default function AdminCityOrdersPage() {
  return (
    <>
      <title>{`City Orders - ${CONFIG.appName}`}</title>
      <AdminCityOrdersView />
    </>
  );
}
