

export type MenuCategory = {
    id: string;
    label: string;
    emoji?: string;
  };

export type MenuItem = {
    id: string;
    title: string;
    description?: string;
    price: string; // e.g. "£9.99"
    kcal?: number;
    tags?: string[]; // e.g. ["Vegan", "Spicy"]
    discountPercent?: number; // e.g. 40 shows a badge
    imageUri?: string;
};
