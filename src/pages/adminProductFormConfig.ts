import type { Path } from 'react-hook-form';
import * as yup from 'yup';
import type { CreateProductPayload } from '../api/product/productApi';

export type SelectOption = {
  value: string;
  label: string;
};

export type CreateProductVariantFormValues = {
  name: string;
  value: string;
  additionalPrice: number;
  stock: number;
};

export type CreateProductFormValues = {
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string;
  tags: string;
  variants: CreateProductVariantFormValues[];
};

type CreateProductField = {
  name: Path<CreateProductFormValues>;
  label: string;
  type: 'text' | 'select';
  inputType?: 'text' | 'number';
  options?: SelectOption[];
  placeholder?: string;
  grid: {
    xs: number;
    sm?: number;
  };
};

const numberField = (label: string) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value
    )
    .typeError(`${label} must be a number`);

export const createProductDefaultValues: CreateProductFormValues = {
  name: '',
  price: 0,
  stock: 0,
  category: '',
  images: '',
  tags: '',
  variants: [
    {
      name: 'Storage',
      value: '',
      additionalPrice: 0,
      stock: 0,
    },
  ],
};

export const createProductSchema: yup.ObjectSchema<CreateProductFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .required('Product name is required')
      .min(2, 'Product name must be at least 2 characters'),
    price: numberField('Price')
      .required('Price is required')
      .positive('Price must be greater than 0'),
    stock: numberField('Stock')
      .required('Stock is required')
      .integer('Stock must be a whole number')
      .min(0, 'Stock cannot be negative'),
    category: yup.string().required('Category is required'),
    images: yup
      .string()
      .trim()
      .required('Image URL is required')
      .url('Enter a valid image URL'),
    tags: yup.string().trim().required('At least one tag is required'),
    variants: yup
      .array()
      .of(
        yup.object({
          name: yup.string().trim().required('Variant name is required'),
          value: yup.string().trim().required('Variant value is required'),
          additionalPrice: numberField('Additional price')
            .required('Additional price is required')
            .min(0, 'Additional price cannot be negative'),
          stock: numberField('Variant stock')
            .required('Variant stock is required')
            .integer('Variant stock must be a whole number')
            .min(0, 'Variant stock cannot be negative'),
        })
      )
      .required('At least one variant is required')
      .min(1, 'At least one variant is required'),
  });

export const getCreateProductFields = (
  categoryOptions: SelectOption[]
): CreateProductField[] => [
  {
    name: 'name',
    label: 'Product Name',
    type: 'text',
    placeholder: 'Samsung Galaxy S24 Ultra',
    grid: { xs: 12 },
  },
  {
    name: 'price',
    label: 'Price',
    type: 'text',
    inputType: 'number',
    grid: { xs: 12, sm: 6 },
  },
  {
    name: 'stock',
    label: 'Stock',
    type: 'text',
    inputType: 'number',
    grid: { xs: 12, sm: 6 },
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: categoryOptions,
    grid: { xs: 12 },
  },
  {
    name: 'images',
    label: 'Image URL',
    type: 'text',
    placeholder: 'https://example.com/product.jpg',
    grid: { xs: 12 },
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'text',
    placeholder: 'Samsung, Smartphone, S24 Ultra',
    grid: { xs: 12 },
  },
];

export const getCreateProductVariantFields = (
  index: number
): CreateProductField[] => [
  {
    name: `variants.${index}.name`,
    label: 'Name',
    type: 'text',
    placeholder: 'Storage',
    grid: { xs: 12, sm: 3 },
  },
  {
    name: `variants.${index}.value`,
    label: 'Value',
    type: 'text',
    placeholder: '12GB / 256GB',
    grid: { xs: 12, sm: 3 },
  },
  {
    name: `variants.${index}.additionalPrice`,
    label: 'Additional Price',
    type: 'text',
    inputType: 'number',
    grid: { xs: 12, sm: 3 },
  },
  {
    name: `variants.${index}.stock`,
    label: 'Stock',
    type: 'text',
    inputType: 'number',
    grid: { xs: 12, sm: 3 },
  },
];

export const createEmptyVariant = (): CreateProductVariantFormValues => ({
  name: 'Storage',
  value: '',
  additionalPrice: 0,
  stock: 0,
});

export const toCreateProductPayload = (
  values: CreateProductFormValues
): CreateProductPayload => ({
  name: values.name.trim(),
  price: values.price,
  stock: values.stock,
  category: values.category,
  images: [values.images.trim()],
  tags: values.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean),
  variants: values.variants.map(variant => ({
    name: variant.name.trim(),
    value: variant.value.trim(),
    additionalPrice: variant.additionalPrice,
    stock: variant.stock,
  })),
});
