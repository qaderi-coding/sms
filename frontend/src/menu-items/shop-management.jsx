// assets
import {
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  TagsOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  TagsOutlined
};

// ==============================|| MENU ITEMS - SHOP MANAGEMENT ||============================== //

const shopManagement = {
  id: 'group-shop-management',
  title: 'Shop Management',
  type: 'group',
  children: [
    {
      id: 'sales',
      title: 'Sales',
      type: 'collapse',
      icon: icons.ShoppingCartOutlined,
      children: [
        {
          id: 'create-sale',
          title: 'Create Sale',
          type: 'item',
          url: '/sales/create'
        },
        {
          id: 'sales-list',
          title: 'Sales List',
          type: 'item',
          url: '/sales/list'
        },
        {
          id: 'sales-returns',
          title: 'Returns',
          type: 'item',
          url: '/sales/returns'
        }
      ]
    },
    {
      id: 'purchases',
      title: 'Purchases',
      type: 'collapse',
      icon: icons.ShopOutlined,
      children: [
        {
          id: 'create-purchase',
          title: 'Create Purchase',
          type: 'item',
          url: '/purchases/create'
        },
        {
          id: 'purchases-list',
          title: 'Purchases List',
          type: 'item',
          url: '/purchases/list'
        },
        {
          id: 'purchase-returns',
          title: 'Returns',
          type: 'item',
          url: '/purchases/returns'
        }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'collapse',
      icon: icons.TagsOutlined,
      children: [
        {
          id: 'products',
          title: 'Products',
          type: 'item',
          url: '/inventory/products'
        },
        {
          id: 'categories',
          title: 'Categories',
          type: 'item',
          url: '/inventory/categories'
        },
        {
          id: 'companies',
          title: 'Companies',
          type: 'item',
          url: '/inventory/companies'
        },
        {
          id: 'bike-models',
          title: 'Bike Models',
          type: 'item',
          url: '/inventory/bike-models'
        }
      ]
    },
    {
      id: 'parties',
      title: 'Parties',
      type: 'collapse',
      icon: icons.TeamOutlined,
      children: [
        {
          id: 'customers',
          title: 'Customers',
          type: 'item',
          url: '/parties/customers'
        },
        {
          id: 'suppliers',
          title: 'Suppliers',
          type: 'item',
          url: '/parties/suppliers'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments',
      type: 'collapse',
      icon: icons.DollarOutlined,
      children: [
        {
          id: 'receive-payment',
          title: 'Receive Payment',
          type: 'item',
          url: '/payments/receive'
        },
        {
          id: 'make-payment',
          title: 'Make Payment',
          type: 'item',
          url: '/payments/make'
        },
        {
          id: 'payment-history',
          title: 'Payment History',
          type: 'item',
          url: '/payments/history'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: icons.BarChartOutlined,
      children: [
        {
          id: 'sales-reports',
          title: 'Sales Reports',
          type: 'collapse',
          children: [
            {
              id: 'daily-sales',
              title: 'Daily Sales',
              type: 'item',
              url: '/reports/sales/daily'
            },
            {
              id: 'monthly-sales',
              title: 'Monthly Sales',
              type: 'item',
              url: '/reports/sales/monthly'
            },
            {
              id: 'customer-wise-sales',
              title: 'Customer Wise',
              type: 'item',
              url: '/reports/sales/customer-wise'
            }
          ]
        },
        {
          id: 'purchase-reports',
          title: 'Purchase Reports',
          type: 'collapse',
          children: [
            {
              id: 'daily-purchases',
              title: 'Daily Purchases',
              type: 'item',
              url: '/reports/purchases/daily'
            },
            {
              id: 'supplier-wise-purchases',
              title: 'Supplier Wise',
              type: 'item',
              url: '/reports/purchases/supplier-wise'
            }
          ]
        },
        {
          id: 'financial-reports',
          title: 'Financial Reports',
          type: 'item',
          url: '/reports/financial'
        }
      ]
    }
  ]
};

export default shopManagement;