import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';

import { Scrollbar } from 'src/components/scrollbar';

import type { Customer } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface CustomersTableProps {
  customers: Customer[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomersTable({
  customers,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
}: CustomersTableProps) {

  const formatAddress = (address: string) => {
    if (!address) return '-';
    return address.length > 50 ? `${address.substring(0, 50)}...` : address;
  };

  const getStatusChip = (status: number) => {
    if (status === 1) {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="error" size="small" />;
  };

  return (
    <Card>
        <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Customers Management</Typography>
            </Box>
        </Box>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Loading customers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No customers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {page * rowsPerPage + index + 1}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" noWrap>
                          {customer.customer_name || '-'}
                        </Typography>
                        {customer.company_name && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {customer.company_name}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {customer.email || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {customer.mobile || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" title={customer.address}>
                        {formatAddress(customer.address)}
                      </Typography>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showFirstButton
        showLastButton
      />
    </Card>
  );
}