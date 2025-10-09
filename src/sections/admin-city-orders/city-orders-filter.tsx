import { useState } from 'react';
import { Paper, Box, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export interface CityOrdersFilterProps {
  filters: any;
  onChange: (filters: any) => void;
  order_type: { id: string; brand_name: string }[];
}
export function CityOrdersFilter({ filters, onChange, order_type }: CityOrdersFilterProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
    onChange(updated);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => setShowFilters((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
      {showFilters && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fafbfc' }}>
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                {/* Row 1: Search, Brand, City */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Search"
                    value={localFilters.search || ''}
                    onChange={e => handleChange('search', e.target.value)}
                    size="small"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Order Type"
                    value={localFilters.order_type || ''}
                    onChange={e => handleChange('order_type', e.target.value)}
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {order_type.map(b => (
                      <MenuItem key={b.id} value={b.id}>{b.brand_name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Row 3: Apply button, right-aligned */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => onChange(localFilters)}
                    size="medium"
                    sx={{ minWidth: 120, height: 44 }}
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </LocalizationProvider>
      )}
    </Box>
  );
}
