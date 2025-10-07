import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type AdminNavItem = {
  title: string;
  path?: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  children?: AdminNavItem[];
};

export const adminNavData: AdminNavItem[] = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <Iconify icon="solar:home-angle-bold-duotone" width={24} height={24} />,
  },
  {
    title: 'Product',
    icon: <Iconify icon="solar:cart-3-bold" width={24} height={24} />,
    children: [
      {
        title: 'Brand',
        path: '/admin/products/brand',
        icon: <Iconify icon="solar:pen-bold" width={20} height={20} />,
      },
      {
        title: 'Model',
        path: '/admin/products/model',
        icon: <Iconify icon="solar:eye-bold" width={20} height={20} />,
      },
    ],
  },
  {
    title: 'Users',
    path: '/admin/users',
  icon: <Iconify icon="solar:user-bold" width={24} height={24} />,
  },
  {
    title: 'Customer Orders',
    path: '/admin/customer-orders',
    icon: <Iconify icon="solar:check-circle-bold" width={24} height={24} />,
  },
  {
    title: 'Channel Partner Orders',
    path: '/admin/partner-orders',
    icon: <Iconify icon="solar:share-bold" width={24} height={24} />,
  },
  {
    title: 'Order Status',
    path: '/admin/order-status',
    icon: <Iconify icon="solar:bell-bing-bold-duotone" width={24} height={24} />,
  },
  {
    title: 'City Wise Reports',
    path: '/admin/city-reports',
    icon: <Iconify icon="eva:search-fill" width={24} height={24} />,
  },
  {
    title: 'Customers',
    path: '/admin/customers',
    icon: <Iconify icon="solar:chat-round-dots-bold" width={24} height={24} />,
  },
  {
    title: 'Media',
    path: '/admin/media',
    icon: <Iconify icon="solar:eye-bold" width={24} height={24} />,
  },
  {
    title: 'Vendors',
    path: '/admin/vendors',
    icon: <Iconify icon="solar:pen-bold" width={24} height={24} />,
  },
  {
    title: 'Channel Partners',
    path: '/admin/channel-partners',
    icon: <Iconify icon="solar:restart-bold" width={24} height={24} />,
  },
  {
    title: 'Settings Windows',
    path: '/admin/settings',
    icon: <Iconify icon="solar:settings-bold-duotone" width={24} height={24} />,
  },
  {
    title: 'Settings Mac',
    path: '/admin/settings-mac',
    icon: <Iconify icon="solar:settings-bold-duotone" width={24} height={24} />,
  },
];