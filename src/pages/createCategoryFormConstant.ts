import type { Path } from 'react-hook-form';
import * as yup from 'yup';
import type { CreateCategoryPayload } from '../api/product/productApi';
import type { SelectOption } from './createProductFormConstant';

export type CreateCategoryFormValues = {
  name: string;
  description: string;
  parent: string;
};

export type CreateCategoryField = {
  name: Path<CreateCategoryFormValues>;
  label: string;
  type: 'text' | 'select';
  options?: SelectOption[];
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  grid: {
    xs: number;
  };
};

export const createCategoryFieldComponentMap = {
  text: 'RhfTextField',
  select: 'RhfSelect',
} as const;

export const createCategoryDefaultValues: CreateCategoryFormValues = {
  name: '',
  description: '',
  parent: '',
};

export const createCategorySchema: yup.ObjectSchema<CreateCategoryFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .required('Category name is required')
      .min(2, 'Category name must be at least 2 characters'),
    description: yup
      .string()
      .trim()
      .max(240, 'Description is too long')
      .default('')
      .defined(),
    parent: yup.string().trim().default('').defined(),
  });

export const getCreateCategoryFormFields = (
  parentOptions: SelectOption[]
): CreateCategoryField[] => [
  {
    name: 'name',
    label: 'Category Name',
    type: 'text',
    placeholder: 'Electronics',
    grid: { xs: 12 },
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Products grouped under this catalog category',
    multiline: true,
    rows: 3,
    grid: { xs: 12 },
  },
  {
    name: 'parent',
    label: 'Parent Category',
    type: 'select',
    options: [{ value: '', label: 'No parent category' }, ...parentOptions],
    grid: { xs: 12 },
  },
];

export const toCreateCategoryPayload = (
  values: CreateCategoryFormValues
): CreateCategoryPayload => ({
  name: values.name.trim(),
  description: values.description.trim() || undefined,
  parent: values.parent || null,
});
