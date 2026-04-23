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
  imageUrl: string;
  tagsInput: string;
  variants: CreateProductVariantFormValues[];
};

export type CreateProductField = {
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

export const createProductFieldComponentMap = {
  text: 'RhfTextField',
  select: 'RhfSelect',
} as const;

export type CreateProductFormSection = {
  id: 'basic' | 'details';
  title: string;
  fields: CreateProductField[];
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
  imageUrl: '',
  tagsInput: '',
  variants: [],
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
    imageUrl: yup
      .string()
      .trim()
      .required('Image URL is required')
      .url('Enter a valid image URL'),
    tagsInput: yup
      .string()
      .trim()
      .required('At least one tag is required')
      .test(
        'has-tags',
        'At least one tag is required',
        value =>
          value
            ?.split(',')
            .map(tag => tag.trim())
            .filter(Boolean).length > 0
      ),
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
      .default([])
      .test(
        'variant-stock-total',
        'Variant stock total must equal the main product stock',
        function (variants) {
          if (!variants || variants.length === 0) {
            return true;
          }

          const stock = this.parent.stock;
          if (typeof stock !== 'number' || Number.isNaN(stock)) {
            return true;
          }

          const totalVariantStock = variants.reduce(
            (sum, variant) => sum + (variant?.stock ?? 0),
            0
          );

          return totalVariantStock === stock;
        }
      ),
  });

export const getCreateProductFormSections = (
  categoryOptions: SelectOption[]
): CreateProductFormSection[] => [
  {
    id: 'basic',
    title: 'Basic Information',
    fields: [
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
    ],
  },
  {
    id: 'details',
    title: 'Details',
    fields: [
      {
        name: 'imageUrl',
        label: 'Image URL',
        type: 'text',
        placeholder: 'https://example.com/product.jpg',
        grid: { xs: 12 },
      },
      {
        name: 'tagsInput',
        label: 'Tags',
        type: 'text',
        placeholder: 'Samsung, Smartphone, Galaxy, S24 Ultra, S24',
        grid: { xs: 12 },
      },
    ],
  },
];

export const getCreateProductVariantFields = (
  index: number
): CreateProductField[] => [
  {
    name: `variants.${index}.name` as Path<CreateProductFormValues>,
    label: 'Name',
    type: 'text',
    placeholder: 'Storage',
    grid: { xs: 12, sm: 3 },
  },
  {
    name: `variants.${index}.value` as Path<CreateProductFormValues>,
    label: 'Value',
    type: 'text',
    placeholder: '12GB / 256GB',
    grid: { xs: 12, sm: 3 },
  },
  {
    name: `variants.${index}.additionalPrice` as Path<CreateProductFormValues>,
    label: 'Additional Price',
    type: 'text',
    inputType: 'number',
    grid: { xs: 12, sm: 3 },
  },
  {
    name: `variants.${index}.stock` as Path<CreateProductFormValues>,
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

const toNumber = (value: number | string) => Number(value);
const toInteger = (value: number | string) => Math.trunc(Number(value));

export const toCreateProductPayload = (
  values: CreateProductFormValues
): CreateProductPayload => ({
  name: values.name.trim(),
  price: toNumber(values.price),
  stock: toInteger(values.stock),
  category: values.category,
  images: [values.imageUrl.trim()],
  tags: values.tagsInput
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean),
  variants: values.variants.map(variant => ({
    name: variant.name.trim(),
    value: variant.value.trim(),
    additionalPrice: toNumber(variant.additionalPrice),
    stock: toInteger(variant.stock),
  })),
});
