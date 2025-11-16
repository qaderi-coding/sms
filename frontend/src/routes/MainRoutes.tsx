import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { CategoryForm, CategoryPage } from '@/apps/administration/category';
import { 
  CompanyPage, 
  CompanyForm,
  UnitPage,
  UnitForm,
  BikeModelPage,
  BikeModelForm,
  ProductPage,
  ProductForm,
  ProductUnitConversionPage,
  ProductUnitConversionForm
} from '@/apps/inventory';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// render - shop management pages
const ShopPage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const SalesList = Loadable(lazy(() => import('apps/sales/pages/SalesList')));
const CreateSale = Loadable(lazy(() => import('apps/sales/pages/CreateSale')));
const InvoicePrint = Loadable(lazy(() => import('apps/sales/print/InvoicePrint')));
const CustomerManagement = Loadable(lazy(() => import('apps/parties/customer/views/CustomerManagement')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    // Shop Management Routes
    {
      path: 'sales',
      children: [
        { path: 'create', element: <CreateSale /> },
        { path: 'list', element: <SalesList /> },
        { path: 'edit/:id', element: <CreateSale /> },
        { path: 'print/:id', element: <InvoicePrint /> },
        { path: 'returns', element: <ShopPage /> }
      ]
    },
    {
      path: 'category',
      children: [
        // { path: 'create', element: <CreateSale /> },
        { path: 'list', element: <CategoryPage /> },
        { path: 'add', element: <CategoryForm /> },
        { path: 'edit/:id', element: <CategoryForm /> }
      ]
    },
    {
      path: 'purchases',
      children: [
        { path: 'create', element: <ShopPage /> },
        { path: 'list', element: <ShopPage /> },
        { path: 'returns', element: <ShopPage /> }
      ]
    },
    {
      path: 'inventory',
      children: [
        {
          path: 'companies',
          children: [
            { index: true, element: <CompanyPage /> },
            { path: 'create', element: <CompanyForm /> },
            { path: 'edit/:id', element: <CompanyForm /> }
          ]
        },
        {
          path: 'units',
          children: [
            { index: true, element: <UnitPage /> },
            { path: 'create', element: <UnitForm /> },
            { path: 'edit/:id', element: <UnitForm /> }
          ]
        },
        {
          path: 'bike-models',
          children: [
            { index: true, element: <BikeModelPage /> },
            { path: 'create', element: <BikeModelForm /> },
            { path: 'edit/:id', element: <BikeModelForm /> }
          ]
        },
        {
          path: 'products',
          children: [
            { index: true, element: <ProductPage /> },
            { path: 'create', element: <ProductForm /> },
            { path: 'edit/:id', element: <ProductForm /> }
          ]
        },
        {
          path: 'product-unit-conversions',
          children: [
            { index: true, element: <ProductUnitConversionPage /> },
            { path: 'create', element: <ProductUnitConversionForm /> },
            { path: 'edit/:id', element: <ProductUnitConversionForm /> }
          ]
        }
      ]
    },
    {
      path: 'parties',
      children: [
        { path: 'customers', element: <CustomerManagement /> },
        { path: 'suppliers', element: <ShopPage /> }
      ]
    },
    {
      path: 'payments',
      children: [
        { path: 'receive', element: <ShopPage /> },
        { path: 'make', element: <ShopPage /> },
        { path: 'history', element: <ShopPage /> }
      ]
    },
    {
      path: 'reports',
      children: [
        {
          path: 'sales',
          children: [
            { path: 'daily', element: <ShopPage /> },
            { path: 'monthly', element: <ShopPage /> },
            { path: 'customer-wise', element: <ShopPage /> }
          ]
        },
        {
          path: 'purchases',
          children: [
            { path: 'daily', element: <ShopPage /> },
            { path: 'supplier-wise', element: <ShopPage /> }
          ]
        },
        { path: 'financial', element: <ShopPage /> }
      ]
    }
  ]
};

export default MainRoutes;
