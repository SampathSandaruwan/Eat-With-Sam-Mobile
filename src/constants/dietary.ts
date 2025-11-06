export const DIETARY_TAGS = ['vegan', 'vegetarian', 'gluten-free', 'halal'] as const;

export const isValidDietaryTag = (tag: string): boolean => {
  return DIETARY_TAGS.some(validTag => validTag === tag.toLowerCase());
};

