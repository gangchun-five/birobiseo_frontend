export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: string;
  rating: number;
  badge: "BEST" | "신상품" | "추천";
  crop: string;
  soil: string;
};

export type Review = {
  id: number;
  name: string;
  product: string;
  rating: number;
  content: string;
  date?: string;
};

export type Order = {
  id: string;
  product: string;
  orderDate: string;
  amount: string;
  status: "배송중" | "배송완료" | "배합준비";
  expectedDate: string;
};

export type Recommendation = {
  id: number;
  title: string;
  crop: string;
  npk: string;
  blend: string;
  savedAt: string;
};
