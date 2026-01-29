import type { AvatarProps } from "@nuxt/ui";

export type UserStatus = "subscribed" | "unsubscribed" | "bounced";
export type SaleStatus = "paid" | "failed" | "refunded";

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: AvatarProps;
  status: UserStatus;
  location: string;
};

export type Mail = {
  id: number;
  unread?: boolean;
  from: User;
  subject: string;
  body: string;
  date: string;
};

export type Member = {
  name: string;
  username: string;
  role: "member" | "owner";
  avatar: AvatarProps;
};

export type Stat = {
  title: string;
  icon: string;
  value: number | string;
  variation: number;
  formatter?: (value: number) => string;
};

export type Sale = {
  id: string;
  date: string;
  status: SaleStatus;
  email: string;
  amount: number;
};

export type Notification = {
  id: number;
  unread?: boolean;
  sender: User;
  body: string;
  date: string;
};

export type Period = "daily" | "weekly" | "monthly";

export type Range = {
  start: Date;
  end: Date;
};
