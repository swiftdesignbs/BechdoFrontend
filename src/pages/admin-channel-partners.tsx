import { CONFIG } from 'src/config-global';
import { AdminChannelPartnersView } from 'src/sections/admin-channel-partners';

export default function AdminChannelPartnersPage() {
  return (
    <>
      <title>{`Channel Partners - ${CONFIG.appName}`}</title>
      <AdminChannelPartnersView />
    </>
  );
}
