"use client"

import * as React from "react"
import type { ToastProps as RadixToastProps, ToastActionElement } from "@radix-ui/react-toast"
import { X } from "lucide-react"
import * as ToastPrimitives from "@radix-ui/react-toast"

import { cn } from "@/lib/utils"
import { toastVariants } from "./toast-variants"

const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Root>, RadixToastProps>(
  ({ className, variant, ...props }, ref) => {
    return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
  },
)
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Action>, ToastActionElement>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className,
      )}
      {...props}
    />
  ),
)
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToasterProps = {
  /**
   * The region to render the toasts into.
   * @default "bottom-right"
   */
  region?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  /**
   * The duration in milliseconds that a toast will be visible.
   * @default 3000
   */
  duration?: number
  /**
   * The maximum number of toasts that can be displayed at once.
   * @default 1
   */
  limit?: number
  /**
   * The offset from the edge of the screen.
   * @default "20px"
   */
  offset?: string
  /**
   * The gap between toasts.
   * @default "10px"
   */
  gap?: string
  /**
   * The class name to apply to the toast container.
   */
  className?: string
  /**
   * The class name to apply to the toast.
   */
  toastClassName?: string
  /**
   * The class name to apply to the toast title.
   */
  titleClassName?: string
  /**
   * The class name to apply to the toast description.
   */
  descriptionClassName?: string
  /**
   * The class name to apply to the toast action button.
   */
  actionButtonClassName?: string
  /**
   * The class name to apply to the toast close button.
   */
  closeButtonClassName?: string
  /**
   * The class name to apply to the toast viewport.
   */
  viewportClassName?: string
}

export {
  type RadixToastProps,
  type ToastActionElement,
  ToastPrimitives,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
