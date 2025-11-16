// assets
import {
  DatabaseOutlined,
  ShopOutlined,
  ToolOutlined,
  AppstoreOutlined,
  SwapOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DatabaseOutlined,
  ShopOutlined,
  ToolOutlined,
  AppstoreOutlined,
  SwapOutlined
};

// ==============================|| MENU ITEMS - INVENTORY ||============================== //

const inventory = {
  id: 'inventory-management',
  title: 'Inventory Management',
  type: 'group',
  children: [
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'collapse',
      icon: icons.DatabaseOutlined,
      children: [
        {
          id: 'companies',
          title: 'Companies',
          type: 'item',
          url: '/inventory/companies',
          icon: icons.ShopOutlined
        },
        {
          id: 'units',
          title: 'Units',
          type: 'item',
          url: '/inventory/units',
          icon: icons.ToolOutlined
        },
        {
          id: 'bike-models',
          title: 'Bike Models',
          type: 'item',
          url: '/inventory/bike-models',
          icon: icons.AppstoreOutlined
        },
        {
          id: 'products',
          title: 'Products',
          type: 'item',
          url: '/inventory/products',
          icon: icons.DatabaseOutlined
        },
        {
          id: 'unit-conversions',
          title: 'Unit Conversions',
          type: 'item',
          url: '/inventory/product-unit-conversions',
          icon: icons.SwapOutlined
        }
      ]
    }
  ]
};

export default inventory;