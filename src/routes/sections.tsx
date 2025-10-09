import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { UserLayout } from 'src/layouts/user';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AdminLayout } from 'src/layouts/admin';
import { AdminProtectedRoute, UserProtectedRoute } from 'src/routes/components';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// New pages
export const AdminPartnerOrdersPage = lazy(() => import('src/pages/admin-partner-orders'));
export const AdminCustomerOrdersPage = lazy(() => import('src/pages/admin-customer-orders'));
export const AdminCityOrdersPage = lazy(() => import('src/pages/admin-city-orders'));
export const AdminChannelPartnersPage = lazy(() => import('src/pages/admin-channel-partners'));
export const HomePage = lazy(() => import('src/pages/home'));
export const AdminSignInPage = lazy(() => import('src/pages/admin-sign-in'));
export const UserSignInPage = lazy(() => import('src/pages/user-sign-in'));
export const AdminDashboardPage = lazy(() => import('src/pages/admin-dashboard'));
export const AdminProductsPage = lazy(() => import('src/pages/admin-products'));
export const AdminBrandPage = lazy(() => import('src/pages/admin-brand'));
export const AdminUsersPage = lazy(() => import('src/pages/admin-users'));
export const AdminModelPage = lazy(() => import('src/pages/admin-model'));
export const AdminMediaPage = lazy(() => import('src/pages/admin-media'));
export const AdminCustomersPage = lazy(() => import('src/pages/admin-customers'));
export const AdminVendorsPage = lazy(() => import('src/pages/admin-vendors'));
export const UserDashboardPage = lazy(() => import('src/pages/user-dashboard'));
export const UnauthorizedPage = lazy(() => import('src/pages/unauthorized'));
export const AdminOrderStatusPage = lazy(() => import('src/pages/admin-order-status'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  // Home page (public)
  {
    path: '/',
    element: (
      <Suspense fallback={renderFallback()}>
        <HomePage />
      </Suspense>
    ),
  },
  
  // Admin routes
  {
    path: 'admin',
    element: (
      <AuthLayout>
        <AdminSignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'admin/sign-in',
    element: (
      <AuthLayout>
        <AdminSignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'admin/dashboard',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminDashboardPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/products',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminProductsPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/brand',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminBrandPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/products/brand',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminBrandPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/users',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminUsersPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/model',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminModelPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/products/model',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminModelPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/media',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminMediaPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/customers',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminCustomersPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/customer-orders',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminCustomerOrdersPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/partner-orders',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminPartnerOrdersPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: 'admin/vendors',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminVendorsPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },

  {
    path: 'admin/order-status',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminOrderStatusPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },

  {
    path: 'admin/city-reports',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminCityOrdersPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },

  {
    path: 'admin/channel-partners',
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <AdminChannelPartnersPage />
          </Suspense>
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },

  
  // User routes
  {
    path: 'user/sign-in',
    element: (
      <AuthLayout>
        <UserSignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'user/dashboard',
    element: (
      <UserProtectedRoute>
        <UserLayout>
          <Suspense fallback={renderFallback()}>
            <UserDashboardPage />
          </Suspense>
        </UserLayout>
      </UserProtectedRoute>
    ),
  },
  
  // Legacy dashboard routes (keeping for compatibility)
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
    ],
  },
  
  // Legacy sign-in
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  
  // Error pages
  {
    path: 'unauthorized',
    element: (
      <Suspense fallback={renderFallback()}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
