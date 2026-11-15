import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";

export type BadgeStyle = { label: string; variant: ComponentProps<typeof Badge>["variant"] };

type EnumBadgeProps<T extends string> = {
  value: T;
  styles: Record<T, BadgeStyle>;
};

export function EnumBadge<T extends string>({ value, styles }: EnumBadgeProps<T>) {
  const { label, variant } = styles[value];
  return <Badge variant={variant}>{label}</Badge>;
}
