export interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  contact: string;
  category: string;
  image?: string; // Base64 string for image
  status: 'Lost' | 'Found' | 'Claimed';
}