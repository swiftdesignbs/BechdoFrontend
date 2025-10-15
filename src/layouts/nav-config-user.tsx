import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactElement;
  info?: React.ReactElement;
};

export const navData: NavItem[] = [
  {
    title: 'Profile',
    path: '/user/profile',
    icon: icon('ic-user'),
  },
  {
    title: 'Orders',
    path: '/user/orders',
    icon: icon('ic-cart'),
  },
  
];