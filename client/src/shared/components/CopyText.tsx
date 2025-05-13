import { FC, ReactNode, useState } from "react";
import SnackbarAuto from "./SnackbarAuto";

interface CopyTextProps {
  text_copy: string;
  button_copy_content: ReactNode;
}
const CopyText: FC<CopyTextProps> = ({ text_copy, button_copy_content }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text_copy);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  return (
    <>
      <button
        onClick={handleCopy}
        className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
      >
        {button_copy_content}
      </button>

      <SnackbarAuto
        isOpen={copied}
        message="Copy successful!"
        onClose={() => setCopied(false)}
        severity="success"
      />
    </>
  );
};

export default CopyText;
