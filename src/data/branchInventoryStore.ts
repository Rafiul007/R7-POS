import { branches } from './branches';
import { getAllProducts } from './productStore';

export interface BranchInventoryRecord {
  branchId: string;
  productId: string;
  stock: number;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  branchId: string;
  productId: string;
  type:
    | 'adjustment'
    | 'transfer-request'
    | 'transfer-send'
    | 'transfer-receive';
  quantity: number;
  reason?: string;
  fromBranchId?: string;
  toBranchId?: string;
  createdAt: string;
}

export interface TransferRequest {
  id: string;
  productId: string;
  fromBranchId: string;
  toBranchId: string;
  quantity: number;
  status: 'pending' | 'approved' | 'declined' | 'fulfilled';
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

const INVENTORY_KEY = 'pos.branch.inventory.v1';
const REQUESTS_KEY = 'pos.branch.requests.v1';
const MOVEMENTS_KEY = 'pos.branch.movements.v1';
const CURRENT_BRANCH_KEY = 'pos.branch.current.v1';

const loadJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const saveJson = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const seedStock = (productId: string, base: number, branchIndex: number) => {
  const variance = (hashString(productId) + branchIndex * 7) % 6; // 0..5
  const delta = variance - 2; // -2..3
  return Math.max(0, base + delta + branchIndex);
};

const ensureSeededInventory = () => {
  const existing = loadJson<BranchInventoryRecord[]>(INVENTORY_KEY, []);
  if (existing.length > 0) return existing;

  const products = getAllProducts();
  const now = new Date().toISOString();

  const seeded = branches.flatMap((branch, index) =>
    products.map(product => ({
      branchId: branch.id,
      productId: product.id,
      stock: seedStock(product.id, product.stock ?? 0, index),
      updatedAt: now,
    }))
  );

  saveJson(INVENTORY_KEY, seeded);
  return seeded;
};

const loadInventory = () => ensureSeededInventory();

const loadRequests = () => loadJson<TransferRequest[]>(REQUESTS_KEY, []);

const loadMovements = () => loadJson<StockMovement[]>(MOVEMENTS_KEY, []);

const saveInventory = (records: BranchInventoryRecord[]) =>
  saveJson(INVENTORY_KEY, records);

const saveRequests = (requests: TransferRequest[]) =>
  saveJson(REQUESTS_KEY, requests);

const saveMovements = (movements: StockMovement[]) =>
  saveJson(MOVEMENTS_KEY, movements);

export const getCurrentBranchId = () => {
  const stored = localStorage.getItem(CURRENT_BRANCH_KEY);
  if (stored && branches.some(branch => branch.id === stored)) {
    return stored;
  }
  const fallback = branches[0]?.id;
  if (fallback) {
    localStorage.setItem(CURRENT_BRANCH_KEY, fallback);
  }
  return fallback;
};

export const setCurrentBranchId = (branchId: string) => {
  if (branches.some(branch => branch.id === branchId)) {
    localStorage.setItem(CURRENT_BRANCH_KEY, branchId);
  }
};

export const getBranchInventoryMap = (branchId: string) => {
  const records = loadInventory();
  const map = new Map<string, number>();
  records
    .filter(record => record.branchId === branchId)
    .forEach(record => {
      map.set(record.productId, record.stock);
    });
  return map;
};

export const getBranchStock = (branchId: string, productId: string) => {
  const records = loadInventory();
  return (
    records.find(
      record => record.branchId === branchId && record.productId === productId
    )?.stock ?? 0
  );
};

export const upsertBranchStock = (
  branchId: string,
  productId: string,
  stock: number,
  reason = 'Stock set'
) => {
  const records = loadInventory();
  const now = new Date().toISOString();
  const next = records.map(record =>
    record.branchId === branchId && record.productId === productId
      ? { ...record, stock, updatedAt: now }
      : record
  );

  const exists = records.some(
    record => record.branchId === branchId && record.productId === productId
  );

  if (!exists) {
    next.push({ branchId, productId, stock, updatedAt: now });
  }

  const previous = getBranchStock(branchId, productId);
  const delta = stock - previous;
  if (delta !== 0) {
    const movements = loadMovements();
    movements.unshift({
      id: `mv_${Date.now()}`,
      branchId,
      productId,
      type: 'adjustment',
      quantity: delta,
      reason,
      createdAt: now,
    });
    saveMovements(movements);
  }

  saveInventory(next);
};

export const adjustBranchStock = (
  branchId: string,
  productId: string,
  delta: number,
  reason: string
) => {
  const current = getBranchStock(branchId, productId);
  const nextStock = Math.max(0, current + delta);
  upsertBranchStock(branchId, productId, nextStock, reason);
  return nextStock;
};

export const ensureInventoryForProduct = (
  productId: string,
  initialStock: number,
  branchId: string
) => {
  const records = loadInventory();
  const now = new Date().toISOString();
  const next = [...records];

  for (const branch of branches) {
    const exists = next.some(
      record => record.branchId === branch.id && record.productId === productId
    );
    if (!exists) {
      next.push({
        branchId: branch.id,
        productId,
        stock: branch.id === branchId ? initialStock : 0,
        updatedAt: now,
      });
    }
  }

  saveInventory(next);
};

export const getBranchAvailability = (productId: string) => {
  const records = loadInventory();
  return branches.map(branch => ({
    branchId: branch.id,
    stock:
      records.find(
        record =>
          record.branchId === branch.id && record.productId === productId
      )?.stock ?? 0,
  }));
};

export const createTransferRequest = (payload: {
  productId: string;
  fromBranchId: string;
  toBranchId: string;
  quantity: number;
  note?: string;
}) => {
  const { productId, fromBranchId, toBranchId, quantity, note } = payload;
  if (quantity <= 0) {
    return { ok: false, error: 'Quantity must be greater than zero.' };
  }

  const available = getBranchStock(fromBranchId, productId);
  if (available < quantity) {
    return { ok: false, error: 'Not enough stock at the source branch.' };
  }

  const now = new Date().toISOString();
  const requests = loadRequests();
  const request: TransferRequest = {
    id: `req_${Date.now()}`,
    productId,
    fromBranchId,
    toBranchId,
    quantity,
    status: 'pending',
    note: note?.trim() || undefined,
    createdAt: now,
  };

  requests.unshift(request);
  saveRequests(requests);

  const movements = loadMovements();
  movements.unshift({
    id: `mv_${Date.now()}`,
    branchId: toBranchId,
    productId,
    type: 'transfer-request',
    quantity,
    fromBranchId,
    toBranchId,
    reason: note?.trim() || 'Transfer requested',
    createdAt: now,
  });
  saveMovements(movements);

  return { ok: true, request };
};

export const getTransferRequests = () => loadRequests();

export const getBranchMovements = (branchId: string) =>
  loadMovements().filter(movement => movement.branchId === branchId);

export const removeInventoryForProduct = (productId: string) => {
  const records = loadInventory();
  const next = records.filter(record => record.productId !== productId);
  saveInventory(next);
};
