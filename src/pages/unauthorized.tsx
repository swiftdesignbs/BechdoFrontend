import { CONFIG } from 'src/config-global';

import { UnauthorizedView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function UnauthorizedPage() {
  return (
    <>
      <title>{`Unauthorized - ${CONFIG.appName}`}</title>

      <UnauthorizedView />
    </>
  );
}