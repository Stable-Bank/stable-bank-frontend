import { toast } from "sonner";

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Successfully copied to clipboard!"))
    .catch(() => toast.error("Failed to copy to clipboard!"));
}
