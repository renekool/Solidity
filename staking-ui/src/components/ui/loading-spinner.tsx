import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export const LoadingSpinner = ({
  className,
  size = "default",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <Loader className={cn("animate-spin", sizeClasses[size], className)} />
  );
};
