import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';

// assets
import { DownOutlined, RightOutlined } from '@ant-design/icons';

// ==============================|| NAVIGATION - COLLAPSE ||============================== //

export default function NavCollapse({ menu, level, parentId, setSelectedItems, selectedItems, setSelectedLevel }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
    if (setSelectedItems) {
      setSelectedItems(!selected ? menu.id : '');
    }
    if (setSelectedLevel) {
      setSelectedLevel(level);
    }
  };

  const checkOpenForParent = (child, id) => {
    child.forEach((item) => {
      if (item.id === id) {
        setOpen(true);
      }
    });
  };

  // menu collapse for sub-menu
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={item.id}
            menu={item}
            level={level + 1}
            parentId={parentId}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            setSelectedLevel={setSelectedLevel}
          />
        );
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Collapse or Item
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;
  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <>
      <ListItemButton
        selected={Array.isArray(selectedItems) && selectedItems.findIndex((id) => id === menu.id) > -1}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && {
            '&:hover': {
              bgcolor: 'primary.lighter'
            },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              borderRight: '2px solid',
              borderColor: 'primary.main',
              color: iconSelectedColor,
              '&:hover': {
                color: iconSelectedColor,
                bgcolor: 'primary.lighter'
              }
            }
          }),
          ...(!drawerOpen && {
            '&:hover': {
              bgcolor: 'transparent'
            },
            '&.Mui-selected': {
              '&:hover': {
                bgcolor: 'transparent'
              },
              bgcolor: 'transparent'
            }
          })
        }}
        onClick={handleClick}
      >
        {menuIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: Array.isArray(selectedItems) && selectedItems.findIndex((id) => id === menu.id) > -1 ? iconSelectedColor : textColor,
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'secondary.lighter'
                }
              }),
              ...(!drawerOpen &&
                Array.isArray(selectedItems) && selectedItems.findIndex((id) => id === menu.id) > -1 && {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                })
            }}
          >
            {menuIcon}
          </ListItemIcon>
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: Array.isArray(selectedItems) && selectedItems.findIndex((id) => id === menu.id) > -1 ? iconSelectedColor : textColor }}>
                {menu.title}
              </Typography>
            }
          />
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <>
            {open ? (
              <DownOutlined
                style={{
                  fontSize: '0.625rem',
                  marginLeft: 1,
                  color: Array.isArray(selectedItems) && selectedItems.findIndex((id) => id === menu.id) > -1 ? iconSelectedColor : textColor
                }}
              />
            ) : (
              <RightOutlined
                style={{
                  fontSize: '0.625rem',
                  marginLeft: 1,
                  color: Array.isArray(selectedItems) && selectedItems.findIndex((id) => id === menu.id) > -1 ? iconSelectedColor : textColor
                }}
              />
            )}
          </>
        )}
      </ListItemButton>
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ position: 'relative' }}>
            {menus}
          </List>
        </Collapse>
      )}
    </>
  );
}

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  parentId: PropTypes.string,
  setSelectedItems: PropTypes.func,
  selectedItems: PropTypes.array,
  setSelectedLevel: PropTypes.func
};