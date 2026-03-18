export interface DrawerOption {
  id: string;
  drawerName: string;
  branchId: string;
}

export const drawers: DrawerOption[] = [
  {
    id: 'drawer-nyc-01',
    drawerName: 'Front Register',
    branchId: 'branch-nyc',
  },
  {
    id: 'drawer-nyc-02',
    drawerName: 'Express Counter',
    branchId: 'branch-nyc',
  },
  {
    id: 'drawer-bos-01',
    drawerName: 'Main Till',
    branchId: 'branch-bos',
  },
  {
    id: 'drawer-bos-02',
    drawerName: 'Side Counter',
    branchId: 'branch-bos',
  },
  {
    id: 'drawer-chi-01',
    drawerName: 'Front Desk',
    branchId: 'branch-chi',
  },
  {
    id: 'drawer-chi-02',
    drawerName: 'Pickup Counter',
    branchId: 'branch-chi',
  },
];

export const getDrawersByBranchId = (branchId: string) =>
  drawers.filter(drawer => drawer.branchId === branchId);

export const getDrawerById = (id: string) =>
  drawers.find(drawer => drawer.id === id);
