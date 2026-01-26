import type { provinces } from "../constants/provinces";

export interface School {
  name: string;
  subDistrict: string;
  district: string;
  province: string;
  level: string;
}

export type Province = (typeof provinces)[number];
