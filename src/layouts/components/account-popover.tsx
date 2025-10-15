import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from 'src/routes/hooks';

import { _myAccount } from 'src/_mock';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    mobile: string;
  } | null>(null);

  // Load current user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser({
          name: user.customer_name || 'User',
          email: user.email || '',
          mobile: user.mobile || '',
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
      localStorage.removeItem('userType');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('customerId');
      localStorage.removeItem('user');
      router.push('/');
    }, [router]);

  const pathname = usePathname();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
          ...sx,
        }}
        {...other}
      >
        <Avatar src={_myAccount.photoURL} alt={currentUser?.name || _myAccount.displayName} sx={{ width: 1, height: 1 }}>
          {(currentUser?.name || _myAccount.displayName).charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {currentUser?.name || _myAccount?.displayName}
          </Typography>

          {currentUser?.email && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {currentUser.email}
            </Typography>
          )}

          {currentUser?.mobile && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              📱 {currentUser.mobile}
            </Typography>
          )}

          {!currentUser?.email && !currentUser?.mobile && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {_myAccount?.email}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList> */}

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <Box sx={{ p: 1 }}>
          <Button fullWidth color="error" size="medium" variant="text" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
