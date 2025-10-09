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

export interface ChannelPartnersFilterProps {
  filters: any;
  onChange: (filters: any) => void;
  brands: { id: number; brand_name: string }[];
  cities: { id: number; name: string }[];
  order_status: { id: number; name: string }[];
}
export function ChannelPartnersFilter({ filters, onChange, brands, cities, order_status }: ChannelPartnersFilterProps) {
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
                    label="Brand"
                    value={localFilters.brand_id || ''}
                    onChange={e => handleChange('brand_id', e.target.value)}
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {brands.map(b => (
                      <MenuItem key={b.id} value={b.id}>{b.brand_name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="City"
                    value={localFilters.city || ''}
                    onChange={e => handleChange('city', e.target.value)}
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {cities.map(c => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Row 2: Order Status, Date Range */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Order Status"
                    value={localFilters.orderStatus || ''}
                    onChange={e => handleChange('orderStatus', e.target.value)}
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {order_status.map((status) => (
                      <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <DatePicker
                      label="From"
                      value={localFilters.from || null}
                      onChange={date => handleChange('from', date)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          variant: 'outlined',
                          fullWidth: true,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                    <DatePicker
                      label="To"
                      value={localFilters.to || null}
                      onChange={date => handleChange('to', date)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          variant: 'outlined',
                          fullWidth: true,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Box>
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
