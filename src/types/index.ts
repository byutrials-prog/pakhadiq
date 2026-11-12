export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  price: number;
  description: string;
  image_url: string;
  image_public_id: string;
  is_available: boolean;
  created_at: string;
  category?: Category | null;
}

export interface StoreInfo {
  id: number;
  name: string;
  promo_text: string;
  hero_title: string;
  hero_description: string;
  whatsapp_number: string;
  address: string;
  instagram_url: string;
  about_description: string;
  opening_hours: string;
  advantages: string[];
  map_url: string;
}
