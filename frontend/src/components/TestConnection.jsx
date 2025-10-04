import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Alert, Box } from '@mui/material';
import { shopAPI } from 'api/shop';
import { authAPI } from 'api/auth';

const TestConnection = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      // Test basic API connection
      const response = await shopAPI.companies.getAll();
      setStatus(`✅ Connection successful! Found ${response.data.length} companies.`);
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    setLoading(true);
    setStatus('Seeding database...');
    
    try {
      await shopAPI.seed.all();
      setStatus('✅ Database seeded successfully!');
    } catch (error) {
      setStatus(`❌ Seeding failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          API Connection Test
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={testConnection}
            disabled={loading}
          >
            Test Connection
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={seedDatabase}
            disabled={loading}
          >
            Seed Database
          </Button>
        </Box>

        {status && (
          <Alert severity={status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'info'}>
            {status}
          </Alert>
        )}

        <Typography variant="body2" sx={{ mt: 2 }}>
          Backend URL: {import.meta.env.VITE_LOCAL_API_URL}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TestConnection;