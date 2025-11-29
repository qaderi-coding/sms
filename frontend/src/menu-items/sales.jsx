// assets
import {
  ShoppingCartOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UndoOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ShoppingCartOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UndoOutlined
};

// ==============================|| MENU ITEMS - SALES ||============================== //

const sales = {
  id: 'sales-management',
  title: 'Sales Management',
  type: 'group',
  children: [
    {
      id: 'sales',
      title: 'Sales',
      type: 'collapse',
      icon: icons.ShoppingCartOutlined,
      children: [
        {
          id: 'sales-list',
          title: 'Sales List',
          type: 'item',
          url: '/sales',
          icon: icons.UnorderedListOutlined
        },
        {
          id: 'create-sale',
          title: 'New Sale',
          type: 'item',
          url: '/sales/create',
          icon: icons.PlusOutlined
        }
      ]
    }
  ]
};

export default sales;