export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
}

export const branches: Branch[] = [
  {
    id: 'branch-nyc',
    name: 'Manhattan Flagship',
    code: 'NYC-01',
    city: 'New York',
  },
  { id: 'branch-bos', name: 'Back Bay', code: 'BOS-02', city: 'Boston' },
  { id: 'branch-chi', name: 'River North', code: 'CHI-03', city: 'Chicago' },
];

export const getBranchById = (id: string) =>
  branches.find(branch => branch.id === id) || branches[0];
