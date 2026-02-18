import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { UploadFile } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../hooks';
import { MESSAGES } from '../constants';
import { getAllProducts, upsertProducts } from '../data/productStore';
import type { IProduct } from '../types';

interface ParsedRow {
  index: number;
  data: Partial<IProduct>;
  errors: string[];
}

const TEMPLATE_HEADERS = [
  'name',
  'sku',
  'barcode',
  'price',
  'discountPrice',
  'category',
  'stock',
  'image',
  'description',
  'isActive',
];
const REQUIRED_HEADERS = ['name', 'price'];

const parseCsvLine = (line: string) => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
};

const parseCsv = (text: string) => {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return { headers: [] as string[], rows: [] as string[][] };
  }

  const headers = parseCsvLine(lines[0]).map(header => header.toLowerCase());
  const rows = lines.slice(1).map(parseCsvLine);
  return { headers, rows };
};

const normalizeKey = (value?: string) =>
  value ? value.trim().toLowerCase() : '';

const buildProduct = (
  row: Record<string, string>,
  index: number,
  seenKeys: Set<string>,
  existingKeys: Set<string>
): ParsedRow => {
  const errors: string[] = [];

  const name = row.name?.trim();
  const sku = row.sku?.trim();
  const barcode = row.barcode?.trim();
  const price = Number(row.price);
  const discountPrice = row.discountprice
    ? Number(row.discountprice)
    : undefined;
  const stock = row.stock ? Number(row.stock) : undefined;
  const isActive = row.isactive ? row.isactive.toLowerCase() !== 'false' : true;

  if (!name) errors.push('Missing name');
  if (!sku && !barcode) errors.push('Missing sku or barcode');
  if (Number.isNaN(price)) errors.push('Invalid price');
  if (!Number.isNaN(price) && price <= 0) errors.push('Price must be > 0');
  if (row.discountprice && Number.isNaN(discountPrice)) {
    errors.push('Invalid discountPrice');
  }
  if (
    !Number.isNaN(price) &&
    discountPrice !== undefined &&
    !Number.isNaN(discountPrice) &&
    discountPrice >= price
  ) {
    errors.push('Discount must be < price');
  }
  if (row.stock && Number.isNaN(stock)) errors.push('Invalid stock');
  if (!Number.isNaN(stock ?? NaN) && (stock ?? 0) < 0) {
    errors.push('Stock must be >= 0');
  }

  const key = normalizeKey(sku || barcode);
  if (key) {
    if (seenKeys.has(key)) {
      errors.push('Duplicate sku/barcode in CSV');
    } else {
      seenKeys.add(key);
    }
    if (existingKeys.has(key)) {
      errors.push('Duplicate sku/barcode in store');
    }
  }

  const data: Partial<IProduct> = {
    id: `csv_${Date.now()}_${index}`,
    name: name || 'Unnamed product',
    sku: sku || undefined,
    barcode: barcode || undefined,
    price: Number.isNaN(price) ? 0 : price,
    discountPrice: discountPrice,
    category: row.category || undefined,
    stock: Number.isNaN(stock) ? undefined : stock,
    image: row.image || '',
    description: row.description || undefined,
    isActive,
  };

  return { index, data, errors };
};

export const BulkUpload = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [sending, setSending] = useState(false);

  const hasErrors = rows.some(row => row.errors.length > 0);
  const validRows = rows.filter(row => row.errors.length === 0);

  const handleFileUpload = async (file: File) => {
    const text = await file.text();
    const { headers, rows: rawRows } = parseCsv(text);

    const missingRequired = REQUIRED_HEADERS.filter(
      header => !headers.includes(header)
    );
    const missingSkuAndBarcode =
      !headers.includes('sku') && !headers.includes('barcode');

    if (missingRequired.length > 0 || missingSkuAndBarcode) {
      const missing = [
        ...missingRequired,
        ...(missingSkuAndBarcode ? ['sku or barcode'] : []),
      ];
      showAlert({
        message: MESSAGES.BULK_UPLOAD.MISSING_HEADERS(missing.join(', ')),
        severity: 'error',
      });
      setRows([]);
      return;
    }

    const existing = getAllProducts();
    const existingKeys = new Set(
      existing
        .map(product => normalizeKey(product.sku || product.barcode))
        .filter(Boolean)
    );
    const seenKeys = new Set<string>();

    const parsed = rawRows.map((row, index) => {
      const record: Record<string, string> = {};
      headers.forEach((header, idx) => {
        record[header] = row[idx] || '';
      });
      return buildProduct(record, index + 1, seenKeys, existingKeys);
    });

    setRows(parsed);
    const invalidCount = parsed.filter(row => row.errors.length > 0).length;
    showAlert({
      message:
        invalidCount > 0
          ? MESSAGES.BULK_UPLOAD.INVALID_ROWS(invalidCount)
          : MESSAGES.BULK_UPLOAD.PARSED(parsed.length),
      severity: invalidCount > 0 ? 'warning' : 'info',
    });
  };

  const handleImport = () => {
    const payload = validRows.map(row => row.data as IProduct);
    upsertProducts(payload);
    showAlert({
      message: MESSAGES.BULK_UPLOAD.IMPORTED(payload.length),
      severity: 'success',
    });
    navigate('/products');
  };

  const handleSendToBackend = () => {
    const payload = validRows.map(row => row.data as IProduct);
    if (payload.length === 0 || hasErrors) return;
    setSending(true);
    showAlert({
      message: MESSAGES.BULK_UPLOAD.SEND_STARTED(payload.length),
      severity: 'info',
    });
    setTimeout(() => {
      setSending(false);
      showAlert({
        message: MESSAGES.BULK_UPLOAD.SEND_SUCCESS(payload.length),
        severity: 'success',
      });
    }, 1200);
  };

  const handleReset = () => {
    setRows([]);
    setSending(false);
    showAlert({
      message: MESSAGES.BULK_UPLOAD.RESET,
      severity: 'info',
    });
  };

  const templateCsv = useMemo(() => {
    const sampleRow =
      'Sample Product,SKU-1001,0123456789012,19.99,14.99,Accessories,25,https://example.com/image.jpg,Sample description,true';
    return `${TEMPLATE_HEADERS.join(',')}\n${sampleRow}`;
  }, []);

  const handleDownloadTemplate = () => {
    const blob = new Blob([templateCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pos-products-template.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: '100%',
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.info.main, 0)} 45%)`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Stack spacing={1}>
          <Typography
            variant='overline'
            sx={{ letterSpacing: '0.22em', color: 'text.secondary' }}
          >
            Bulk Upload
          </Typography>
          <Typography variant='h5' fontWeight={600}>
            Upload products via CSV
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Use the template to ensure correct columns before importing.
          </Typography>
        </Stack>

        <Card
          sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <Button
                variant='outlined'
                onClick={handleDownloadTemplate}
                sx={{ borderRadius: 0 }}
              >
                Download Template
              </Button>
              <Button
                variant='outlined'
                color='inherit'
                onClick={handleReset}
                sx={{ borderRadius: 0 }}
              >
                Reset
              </Button>
              <Button
                variant='contained'
                component='label'
                startIcon={<UploadFile />}
                sx={{ borderRadius: 0 }}
              >
                Upload CSV
                <input
                  type='file'
                  hidden
                  accept='.csv'
                  onChange={event => {
                    const file = event.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                />
              </Button>
              <Button
                variant='contained'
                color='success'
                disabled={rows.length === 0 || hasErrors}
                onClick={handleImport}
                sx={{ borderRadius: 0 }}
              >
                Import {validRows.length} products
              </Button>
              <Button
                variant='outlined'
                disabled={rows.length === 0 || hasErrors || sending}
                onClick={handleSendToBackend}
                sx={{ borderRadius: 0 }}
              >
                {sending ? 'Sending...' : `Send ${validRows.length} to Backend`}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ mb: 2 }}
            >
              <Typography variant='subtitle1' fontWeight={600}>
                Preview
              </Typography>
              <Chip
                label={
                  rows.length === 0
                    ? 'No file loaded'
                    : hasErrors
                      ? 'Fix errors'
                      : 'Ready to import'
                }
                color={
                  rows.length === 0
                    ? 'default'
                    : hasErrors
                      ? 'warning'
                      : 'success'
                }
                variant='outlined'
                sx={{ borderRadius: 0 }}
              />
            </Stack>

            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      Upload a CSV to preview rows.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(row => (
                    <TableRow key={row.index}>
                      <TableCell>{row.index}</TableCell>
                      <TableCell>{row.data.name}</TableCell>
                      <TableCell>{row.data.sku || '—'}</TableCell>
                      <TableCell>{row.data.barcode || '—'}</TableCell>
                      <TableCell>
                        {row.data.price !== undefined
                          ? Number(row.data.price).toFixed(2)
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {row.data.stock !== undefined ? row.data.stock : '—'}
                      </TableCell>
                      <TableCell>
                        {row.errors.length === 0 ? (
                          <Chip label='Ready' color='success' size='small' />
                        ) : (
                          <Chip
                            label={row.errors[0]}
                            color='warning'
                            size='small'
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
