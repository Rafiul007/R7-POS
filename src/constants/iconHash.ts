// Icon exports from Material UI Icons
import {
  Home,
  Settings,
  Dashboard,
  ShoppingCart,
  Inventory,
  People,
  Receipt,
  BarChart,
  Add,
  Edit,
  Delete,
  Search,
  Menu,
  Close,
  ArrowBack,
  ArrowForward,
  Check,
  Clear,
} from '@mui/icons-material';

export const iconHash = {
  home: Home,
  settings: Settings,
  dashboard: Dashboard,
  shoppingCart: ShoppingCart,
  inventory: Inventory,
  people: People,
  receipt: Receipt,
  barChart: BarChart,
  add: Add,
  edit: Edit,
  delete: Delete,
  search: Search,
  menu: Menu,
  close: Close,
  arrowBack: ArrowBack,
  arrowForward: ArrowForward,
  check: Check,
  clear: Clear,
};

//export iconhash type
export type IconHashKey = keyof typeof iconHash;
