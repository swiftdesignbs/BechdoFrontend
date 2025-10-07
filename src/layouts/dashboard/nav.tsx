import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';

import type { NavItem } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
  open?: boolean;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
  open = true,
}: NavContentProps & { layoutQuery: Breakpoint; open?: boolean }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-current-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} open={open} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx, open = true }: NavContentProps) {
  const pathname = usePathname();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: open ? 'flex-start' : 'center', mb: 2 }}>
        <Logo />
      </Box>

      {slots?.topArea}

      <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Scrollbar fillContent>
          <Box
            component="nav"
            sx={[
              {
                minHeight: 0,
                display: 'flex',
                flex: '1 1 auto',
                flexDirection: 'column',
                pb: 'var(--layout-nav-content-padding-bottom)',
              },
              ...(Array.isArray(sx) ? sx : [sx]),
            ]}
          >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
              px: open ? 2 : 1,
              py: 1,
            }}
          >
            {data.map((item) => {
              const isActived = item.path === pathname;

              const navItem = (
                <ListItemButton
                  disableGutters
                  component={RouterLink}
                  href={item.path}
                  sx={[
                    (theme) => ({
                      pl: 0,
                      py: 1,
                      gap: open ? 2 : 0,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: theme.vars.palette.text.secondary,
                      minHeight: 44,
                      justifyContent: open ? 'flex-start' : 'center',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        color: theme.vars.palette.primary.main,
                        bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                        '&:hover': {
                          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                        },
                      }),
                    }),
                  ]}
                >
                  <Box component="span" sx={{ width: 24, height: 24 }}>
                    {item.icon}
                  </Box>

                  {open && (
                    <>
                      <Box component="span" sx={{ flexGrow: 1 }}>
                        {item.title}
                      </Box>

                      {item.info && item.info}
                    </>
                  )}
                </ListItemButton>
              );

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  {!open ? (
                    <Tooltip title={item.title} placement="right">
                      {navItem}
                    </Tooltip>
                  ) : (
                    navItem
                  )}
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>
      </Box>

      {slots?.bottomArea}

      {/* {open && <NavUpgrade />} */}
    </>
  );
}
