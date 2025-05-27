export interface BaseUser {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface RegularUser extends BaseUser {
  userType: 'user';
  userId: string;
  namaLengkap: string;
  tinggi_badan: number;
  berat_badan: number;
  penyakit: string[];
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
}

export interface Nutritionist extends BaseUser {
  userType: 'nutritionist';
  nutritionistId: string;
  specialization: string;
  status: 'online' | 'offline';
  lastSeen: string;
}

export type User = RegularUser | Nutritionist;

export interface AuthResponse {
  user: User;
  nutritionist?: Nutritionist;
}
