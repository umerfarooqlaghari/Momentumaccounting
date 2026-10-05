import {
  BookOpen,
  BarChart3,
  CalendarCheck,
  Receipt,
  Users,
  UserRound,
  Compass,
  Rocket,
  TrendingUp,
  ArrowLeftRight,
  Building2,
  Briefcase,
  Film,
  HardHat,
  Laptop,
  Plane,
  HeartPulse,
  House,
  type LucideIcon,
} from "lucide-react";

export type IconKey =
  | "book" | "chart" | "calendar" | "receipt" | "users" | "user" | "compass" | "rocket" | "trending"
  | "switch" | "building" | "briefcase" | "film" | "hardhat" | "laptop" | "plane" | "heart" | "home";

const map: Record<IconKey, LucideIcon> = {
  book: BookOpen,
  chart: BarChart3,
  calendar: CalendarCheck,
  receipt: Receipt,
  users: Users,
  user: UserRound,
  compass: Compass,
  rocket: Rocket,
  trending: TrendingUp,
  switch: ArrowLeftRight,
  building: Building2,
  briefcase: Briefcase,
  film: Film,
  hardhat: HardHat,
  laptop: Laptop,
  plane: Plane,
  heart: HeartPulse,
  home: House,
};

export function Icon({ name, className = "size-6" }: { name: IconKey; className?: string }) {
  const Cmp = map[name] ?? BookOpen;
  return <Cmp aria-hidden className={className} strokeWidth={1.75} />;
}
