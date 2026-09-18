import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  className,
  children,
  side = "left",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "left" | "right";
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex h-full w-[min(280px,88vw)] flex-col bg-sidebar text-sidebar-foreground shadow-soft outline-none",
          side === "left" ? "left-0 top-0" : "right-0 top-0",
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">Меню</DialogPrimitive.Title>
        {children}
        <DialogPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 text-sidebar-muted hover:bg-sidebar-accent">
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
