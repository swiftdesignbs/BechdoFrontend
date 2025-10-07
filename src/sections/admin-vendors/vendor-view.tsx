import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Avatar, 
  Stack,
  IconButton,
  Chip
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { Vendor } from 'src/utils/api-service';

interface VendorViewProps {
  vendor: Vendor;
  onClose: () => void;
}

export const VendorView: React.FC<VendorViewProps> = ({ vendor, onClose }) => {
  return (
    <Box sx={{ py: 3 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onClose} sx={{ p: 1 }}>
          <Iconify icon="solar:restart-bold" />
        </IconButton>
        <Typography variant="h4" fontWeight="600">
          Vendor Details
        </Typography>
      </Box>

      {/* Vendor Details Card */}
      <Card 
        elevation={3} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                fontSize: 36,
                fontWeight: 'bold'
              }}
            >
              {vendor.store_name?.[0]?.toUpperCase() || 'V'}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                {vendor.store_name}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {vendor.email}
              </Typography>
              <Chip 
                label={vendor.is_interested ? 'Interested' : 'Not Interested'} 
                color={vendor.is_interested ? 'success' : 'default'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: 'primary.main' }}>
            Contact Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  Primary Contact
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {vendor.contact_name || '-'}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  Phone Number
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {vendor.contact_number}
                </Typography>
              </Box>
            </Stack>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  Alternative Contact
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {vendor.alt_contact_name || '-'}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  Alternative Phone
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {vendor.alt_contact_number || '-'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: 'primary.main' }}>
            Business Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                Store Address
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {vendor.store_address}
              </Typography>
            </Box>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  Buyback Volume
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {vendor.buyback_volume || '-'}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  Registration Procedure
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {vendor.vendor_registration_procedure || '-'}
                </Typography>
              </Box>
            </Stack>
            
            {vendor.notes && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                  Notes
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {vendor.notes}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          startIcon={<Iconify icon="solar:restart-bold" />}
          sx={{ minWidth: 120 }}
        >
          Back to List
        </Button>
      </Box>
    </Box>
  );
};
