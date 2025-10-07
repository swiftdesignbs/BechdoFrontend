import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';

import type { AdminNavItem } from '../nav-config-admin';

// ----------------------------------------------------------------------

export type AdminNavContentProps = {
  data: AdminNavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
  open?: boolean;
};

export function AdminNavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
  open = true,
}: AdminNavContentProps & { layoutQuery: Breakpoint; open?: boolean }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-current-width)',
        borderRight: `1px solid ${theme.vars.palette.divider}`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <AdminNavContent data={data} slots={slots} open={open} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function AdminNavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: AdminNavContentProps & { open: boolean; onClose: () => void }) {
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
      <AdminNavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function AdminNavContent({ data, slots, sx, open = true }: AdminNavContentProps) {
  const pathname = usePathname();

  return (
    <>
      {slots?.topArea ?? (
        <Box sx={{ px: open ? 2 : 1, py: 3 }}>
          <Logo />
        </Box>
      )}

      <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Scrollbar fillContent>
          <Box
            component="nav"
            sx={[
              {
                minHeight: 0,
                display: 'flex',
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
            {data.map((item) => (
              <AdminNavItem key={item.title} item={item} pathname={pathname} open={open} />
            ))}
          </Box>
        </Box>
      </Scrollbar>
      </Box>

      {slots?.bottomArea}

      {/* {open && <NavUpgrade />} */}
    </>
  );
}

// ----------------------------------------------------------------------

function AdminNavItem({ 
  item, 
  pathname, 
  open, 
  level = 0 
}: { 
  item: AdminNavItem; 
  pathname: string; 
  open: boolean;
  level?: number;
}) {
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActived = item.path === pathname;
  const isChildActive = hasChildren && item.children?.some(child => child.path === pathname);

  const handleToggle = () => {
    if (hasChildren) {
      setOpenSubmenu(!openSubmenu);
    }
  };

  // Auto-expand if child is active
  useEffect(() => {
    if (isChildActive) {
      setOpenSubmenu(true);
    }
  }, [isChildActive]);

  const navButton = (
    <ListItemButton
      disableGutters
      component={item.path ? RouterLink : 'div'}
      href={item.path}
      onClick={hasChildren ? handleToggle : undefined}
      sx={[
        (theme) => ({
          pl: open ? level * 1.5 : 0,
          py: 1,
          gap: open ? 2 : 0,
          pr: 1.5,
          borderRadius: 0.75,
          typography: 'body2',
          fontWeight: 'fontWeightMedium',
          color: theme.vars.palette.text.secondary,
          minHeight: 44,
          justifyContent: open ? 'flex-start' : 'center',
          cursor: hasChildren ? 'pointer' : 'default',
          ...(isActived && {
            fontWeight: 'fontWeightSemiBold',
            color: theme.vars.palette.primary.main,
            bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
            '&:hover': {
              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
            },
          }),
          ...(isChildActive && !isActived && {
            color: theme.vars.palette.primary.main,
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

          {hasChildren && (
            <Iconify
              icon="carbon:chevron-sort"
              width={16}
              height={16}
              sx={{
                transform: openSubmenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          )}

          {item.info && item.info}
        </>
      )}
    </ListItemButton>
  );

  return (
    <>
      <ListItem disableGutters disablePadding>
        {!open ? (
          <Tooltip title={item.title} placement="right">
            {navButton}
          </Tooltip>
        ) : (
          navButton
        )}
      </ListItem>

      {hasChildren && open && (
        <Collapse in={openSubmenu} unmountOnExit>
          <Box component="ul" sx={{ pl: 0 }}>
            {item.children?.map((child) => (
              <AdminNavItem
                key={child.title}
                item={child}
                pathname={pathname}
                open={open}
                level={level + 1}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </>
  );
}