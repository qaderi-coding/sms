// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - ADMINISTRATION ||============================== //

const administration = {
  id: 'group-administration',
  title: 'Navigation',
  type: 'group',
  children: [
   {
         id: 'category',
         title: 'Category',
         type: 'collapse',
         icon: icons.ShoppingCartOutlined,
         children: [
           {
             id: 'create-category',
             title: 'Create Category',
             type: 'item',
             url: '/category/add'
           },
           {
             id: 'category-list',
             title: 'Category List',
             type: 'item',
             url: '/category/list'
           },
       
         ]
       }
      ]
  
};

export default administration;
