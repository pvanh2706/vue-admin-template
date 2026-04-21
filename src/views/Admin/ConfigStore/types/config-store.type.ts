// Danh sách cửa hàng
export interface ConfigStore {
    id: string;
    name: string;
    phone: string;
    email: string;
    numberAccount: string;
    status: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}