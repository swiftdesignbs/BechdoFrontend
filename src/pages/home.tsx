import { CONFIG } from 'src/config-global';

import { HomeView } from 'src/sections/home';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <title>{`Home - ${CONFIG.appName}`}</title>

      <HomeView />
    </>
  );
}