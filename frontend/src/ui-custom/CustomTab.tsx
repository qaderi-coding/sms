import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
// import useConfig from '../hooks/useConfig';

interface Props {
  tabNames: string[];
  children?: any;
  elevation?: number;
  tabErrors?: boolean[]; // Add this prop
  activeTab?: number; // Optional prop to control active tab
}

export default function CustomTab({ tabNames, children, elevation, tabErrors = [], activeTab = 0 }: Props) {
  // let config = useConfig();
  let [active, setActive] = useState(activeTab);

  return (
    <Box sx={{ backgroundColor: 'transparent' }} role="tabs">
      <Box
        sx={{
          // backgroundColor: config.navType == 'light' ? 'white' : 'rgb(33, 41, 70)',
          paddingX: '10px',
          borderRadius: '10px 10px 0 0'
        }}
      >
        <Tabs
          value={active}
          onChange={(event, value: number) => {
            setActive(value);
          }}
        >
          {tabNames.map((tabName, index) => (
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {tabName}
                  {tabErrors[index] && <span style={{ color: 'red', marginLeft: '8px' }}>!</span>}
                </div>
              }
              id={`tab-${index}`}
              aria-controls={`panel-${index}`}
              key={index}
              sx={{
                fontWeight: 600,
                color: tabErrors[index] ? 'red' : 'inherit' // Change tab text color to red if there are errors
              }}
            />
          ))}
        </Tabs>
      </Box>
      {React.Children.map(children, (item, index) => (
        <div
          role="tabpanel"
          id={`panel-${index}`}
          aria-labelledby={`tab-${index}`}
          style={{
            display: active === index ? 'inherit' : 'none',
            padding: '0',
            marginTop: '5px'
          }}
          key={index}
        >
          {item}
        </div>
      ))}
    </Box>
  );
}
