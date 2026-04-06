"use client";

import React from "react";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AdminKpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  cardClassName?: string;
  footerContent?: React.ReactNode;
  variant?: "default" | "dark" | "gradient-blue";
}

const AdminKpiCard: React.FC<AdminKpiCardProps> = ({
  title,
  value,
  icon: Icon,
  iconClassName,
  cardClassName,
  footerContent,
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-white text-slate-800",
    dark: "bg-slate-900 text-white shadow-2xl",
    "gradient-blue": "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl",
  };

  const iconTrayStyles = {
    default: "bg-primary/5 text-primary",
    dark: "bg-white/10 text-white",
    "gradient-blue": "bg-white/20 text-white",
  };

  const titleStyles = {
    default: "text-slate-500",
    dark: "text-slate-400",
    "gradient-blue": "text-blue-100",
  };

  const footerBorderStyles = {
    default: "border-slate-50",
    dark: "border-white/5",
    "gradient-blue": "border-white/10",
  };

  return (
    <Card className={cn(
      "border-none shadow-xl rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300",
      variantStyles[variant],
      cardClassName
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={cn("font-bold uppercase tracking-wider text-[10px] mb-1.5", titleStyles[variant])}>
              {title}
            </p>
            <h3 className="text-4xl font-black tracking-tighter">
              {value}
            </h3>
          </div>
          <div className={cn("p-3 rounded-2xl", iconTrayStyles[variant], iconClassName)}>
            <Icon size={24} />
          </div>
        </div>
        {footerContent && (
          <div className={cn("mt-4 pt-4 border-t", footerBorderStyles[variant])}>
            {footerContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminKpiCard;
