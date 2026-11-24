import type { User } from './auth';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type AuthProvider = 'GOOGLE';

export interface BranchAssignment {
   cinemaId: number;
   cinemaName: string | null;
   primary: boolean;
}

export interface UserProfile extends User {
   dateOfBirth?: string;
   gender?: Gender;
   hasPassword: boolean;
   linkedProviders: AuthProvider[];
   branches: BranchAssignment[];
}

export interface UpdateProfileRequest {
   fullName: string;
   phone: string | null;
   dateOfBirth: string | null;
   gender: Gender | null;
   avatarUrl: string | null;
}

export interface ChangePasswordRequest {
   currentPassword?: string;
   newPassword: string;
}
