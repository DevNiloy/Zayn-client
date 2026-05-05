export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse extends IUser {
  message?: string;
  success?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
  image?: string | File; // Multer ব্যবহারের জন্য File সাপোর্ট রাখা হয়েছে
}