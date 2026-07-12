export type ToolCategory = 'college' | 'exams' | 'career' | 'documents' | 'developer';

export type CardSize = 'small' | 'medium' | 'large';

export interface Tool {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  featured?: boolean;
  cardSize?: CardSize;
  isNew?: boolean;
}

export interface Category {
  slug: ToolCategory;
  title: string;
  description: string;
  icon: string;
  accent: string;
  accentBg: string;
}
