export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureUrl: string | null;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pictureUrl: string | null;
}

export interface ProfileUpdate {
  firstName: string;
  lastName: string;
  pictureUrl: string | null;
}
