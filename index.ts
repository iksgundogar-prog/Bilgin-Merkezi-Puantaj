export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface Location {
  id: number;
  code: string;
  name: string;
  defaultHours: number;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  locationId: number | null;
  fullName: string;
  isActive: boolean;
}

export interface Employee {
  id: number;
  sicilNo: string;
  adSoyad: string;
  locationId: number;
  gorevi: string;
  isGiris: string;
  isActive: boolean;
}

export interface PuantajCell {
  code: string;
  ubgt: number;
  fm: number;
}

export interface PuantajData {
  [employeeId: number]: {
    [day: number]: PuantajCell;
  };
}

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  detail: string;
  time: string;
}

export interface LockedPeriods {
  [periodKey: string]: boolean;
}
