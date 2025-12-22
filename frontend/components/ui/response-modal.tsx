"use client";

import * as React from "react";
import { Check, XCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ResponseVariant = "success" | "error" | "warning" | "info";

interface ResponseModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * The visual style variant of the modal
   * @default "success"
   */
  variant?: ResponseVariant;
  /**
   * Modal title
   */
  title: string;
  /**
   * Modal description text or React node
   */
  description?: React.ReactNode;
  /**
   * Primary action button callback.
   * If provided, renders a primary button.
   */
  onPrimaryAction?: () => void;
  /**
   * Label for the primary action button
   * @default "Confirm"
   */
  primaryActionLabel?: string;
  /**
   * Secondary action button callback.
   * If provided, renders a secondary button.
   */
  onSecondaryAction?: () => void;
  /**
   * Label for the secondary action button
   * @default "Cancel"
   */
  secondaryActionLabel?: string;
  /**
   * Callback for the close button.
   * Defaults to closing the modal via onOpenChange if not provided.
   */
  onClose?: () => void;
  /**
   * Label for the close button
   * @default "Close"
   */
  closeLabel?: string;
}

const variantConfig = {
  success: {
    icon: Check,
    iconColor: "text-white",
    iconBg: "bg-emerald-500",
    primaryButtonClasses:
      "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  },
  error: {
    icon: XCircle,
    iconColor: "text-white",
    iconBg: "bg-red-500",
    primaryButtonClasses:
      "border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-white",
    iconBg: "bg-amber-500",
    primaryButtonClasses:
      "border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700",
  },
  info: {
    icon: Info,
    iconColor: "text-white",
    iconBg: "bg-blue-500",
    primaryButtonClasses:
      "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  },
};

export function ResponseModal({
  open,
  onOpenChange,
  variant = "success",
  title,
  description,
  onPrimaryAction,
  primaryActionLabel = "Confirm",
  onSecondaryAction,
  secondaryActionLabel = "Cancel",
  onClose,
  closeLabel = "Close",
}: ResponseModalProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      onOpenChange(false);
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-2xl p-8 md:p-10 gap-8"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Status Icon */}
          <div
            className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center shadow-sm",
              config.iconBg
            )}
          >
            <Icon className={cn("h-10 w-10 stroke-[3px]", config.iconColor)} />
          </div>

          <DialogHeader className="space-y-4 items-center">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg text-slate-600 max-w-[400px] leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-center w-full mt-2">
          {/* Primary Action */}
          {onPrimaryAction && (
            <Button
              variant="outline"
              onClick={onPrimaryAction}
              className={cn(
                "w-full sm:w-auto rounded-full px-8 h-12 text-base font-medium",
                config.primaryButtonClasses
              )}
            >
              {primaryActionLabel}
            </Button>
          )}

          {/* Secondary Action (Usually 'Create Another' style or generic secondary) */}
          {onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              className="w-full sm:w-auto rounded-full border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 px-8 h-12 text-base font-medium"
            >
              {variant === "success" ? "+ " : ""}
              {secondaryActionLabel}
            </Button>
          )}

          {/* Close (Gray) */}
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto rounded-full border-slate-600 text-slate-600 hover:bg-slate-50 hover:text-slate-900 px-8 h-12 text-base font-medium"
          >
            {closeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
