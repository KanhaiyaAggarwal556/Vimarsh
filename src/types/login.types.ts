import { LucideIcon } from "lucide-react";

export interface FormData {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  emailOrUsername?: string;
  password?: string;
  general?: string;
}

export interface Stat {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface FeatureSlide {
  type: "feature";
  title: string;
  description: string;
  image: string;
  stats: Stat[];
}

export interface VideoSlide {
  type: "video";
  title: string;
  description: string;
  videoUrl: string;
  features: string[];
}

export type ShowcaseSlide = FeatureSlide | VideoSlide;
export type SocialProvider = "google" | "facebook" | "linkedin" | "twitter";