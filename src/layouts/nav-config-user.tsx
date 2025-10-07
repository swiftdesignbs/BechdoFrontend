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
    title: 'Dashboard',
    path: '/user/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Profile',
    path: '/user/profile',
    icon: icon('ic-user'),
  },
  {
    title: 'Activities',
    path: '/user/activities',
    icon: icon('ic-cart'),
  },
  {
    title: 'Settings',
    path: '/user/settings',
    icon: icon('ic-lock'),
  },
];