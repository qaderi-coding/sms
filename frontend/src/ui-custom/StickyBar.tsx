import { Box, SxProps } from '@mui/material';
import { useEffect, useRef } from 'react';
// import useConfig from '../hooks/useConfig';
import { IDictionary } from '../utils/types/IDictionary';

export interface StickySxProps {
  originalSx?: SxProps;
  scrollingSx?: SxProps;
}

interface StickyBarProps {
  id: string;
  stickTo: 'top' | 'bottom';
  offset?: number;
  sx?: StickySxProps;
  children?: any;
}

function StickyBar({ id, stickTo, offset = 0, sx, children }: StickyBarProps) {
  //   const config = useConfig();
  const sxProps = useRef(sx);

  useEffect(() => {
    sxProps.current = sx;
  }, [sx]);

  const defaultStyles: IDictionary<any> = {
    display: 'flex',
    position: 'sticky',
    gap: '5px',
    width: '100%',
    padding: '10px',
    justifyContent: 'center',
    // backgroundColor: config.navType === 'light' ? 'white' : 'rgb(33, 41, 70)',
    transition: 'box-shadow 0.05s ease',
    top: stickTo === 'top' ? '48px' : 'initial',
    bottom: stickTo === 'bottom' ? '0px' : 'initial',
    zIndex: 1024,
    ...sx?.originalSx
  };

  if (offset && stickTo === 'top') defaultStyles.top = `${offset}px`;
  else defaultStyles.bottom = `${offset}px`;

  const toggleScrollStyles = (element: HTMLElement, toggle: boolean, sx: StickySxProps | undefined) => {
    if (sx?.scrollingSx) {
      Object.getOwnPropertyNames(sx.scrollingSx).forEach((name) => {
        if (toggle) {
          element.style[name as any] = (sx.scrollingSx as IDictionary<any>)[name];
        } else {
          element.style[name as any] = defaultStyles[name];
        }
      });
    }
  };

  const attachShadow = (sx: StickySxProps | undefined) => {
    const element = document.querySelector(`#${id}`) as HTMLDivElement | null;
    if (!element) return;

    if (stickTo === 'top') {
      if (window.scrollY + (offset ?? 0) + 1 > element.offsetTop) {
        element.style.boxShadow = 'rgba(18, 25, 38, 0.24) 0px 4px 2px -2px';
        toggleScrollStyles(element, true, sx);
      } else {
        element.style.boxShadow = 'unset';
        toggleScrollStyles(element, false, sx);
      }
    } else {
      const rect = element.getBoundingClientRect();
      if (window.innerHeight + (offset ?? 0) - 1 < rect.bottom) {
        element.style.boxShadow = 'rgba(18, 25, 38, 0.24) 0px -4px 2px -2px';
        toggleScrollStyles(element, true, sx);
      } else {
        element.style.boxShadow = 'unset';
        toggleScrollStyles(element, false, sx);
      }
    }
  };

  const addStickyShadow = () => {
    const element = document.querySelector(`#${id}`) as HTMLDivElement | null;
    if (!element) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          if ((mutation.target as HTMLDivElement).style.display !== 'none') {
            attachShadow(sxProps.current);
          }
        }
      });
    });

    const panel = element.closest('[role="tabpanel"]');
    if (panel) observer.observe(panel, { attributes: true });

    const scrollHandler = () => attachShadow(sxProps.current);
    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      observer.disconnect();
    };
  };

  useEffect(() => {
    attachShadow(sxProps.current);
    return addStickyShadow();
  }, []);

  return (
    <Box
      id={id}
      sx={{
        ...defaultStyles,
        ...sx?.originalSx
      }}
    >
      {children}
    </Box>
  );
}

export default StickyBar;
