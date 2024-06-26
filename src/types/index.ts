export type Product = {
  id: string;
  title: string;
  price: number;
  address: string | null;
  description: string;
  imageUrls: string[];
  isChangeable: boolean;
  isUsed: boolean;
  tags: string[] | null;
  createdAt: string;
  createdBy: string;
  purchaseBy: string | null;
  category: string;
};

export type Shop = {
  id: string;
  name: string;
  imageUrl: string | null;
  introduce: string | null;
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  createdBy: string;
  contents: string;
  createdAt: string;
};

export type Like = {
  id: string;
  productId: string;
  createdBy: string;
  createdAt: string;
};

export type Follow = {
  id: string;
  followingShopId: string;
  createdBy: string;
  createdAt: string;
};

export type ChatRoom = {
  id: string;
  createdAt: string;
  fromShopId: string;
  toShopId: string;
};

export type ChatMessage = {
  id: string;
  createdAt: string;
  chatRoom: string;
  message: string;
  createdBy: string;
};

export type ErrorType = {
  message: string;
  success: boolean;
};
