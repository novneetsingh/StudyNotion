import toast from "react-hot-toast";

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (error) {
    toast.error("Failed to copy");
  }
};
