// import { appI18next } from 'i18n';
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const HistoryListener = () => {
  const location = useLocation();
  const navType = useNavigationType(); // optional, tells if it's POP/PUSH/REPLACE

  useEffect(() => {
    const path = location.pathname;

    // const matched = menuList.find((item) => item.url === path);
    // const code = matched?.code || 'UNKNOWN';

    // const title = matched ? `${appI18next.t(matched.id)}: ${matched.code}` : `Unknown Route: ${path}`;

    const entry = {
      // title,
      url: path,
      timestamp: new Date().toISOString(),
      navType
    };

    const old = JSON.parse(localStorage.getItem('routeHistory') || '[]');
    if (old.length && old[0].url === path) return;

    const updated = [entry, ...old].slice(0, 20);
    localStorage.setItem('routeHistory', JSON.stringify(updated));
  }, [location, navType]);

  return null;
};
export default HistoryListener;
