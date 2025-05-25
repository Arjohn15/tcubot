import { useState, useRef, useEffect } from "react";

import { IoSend } from "react-icons/io5";

export default function ChatTextArea({
  onSubmitMessage,
}: {
  onSubmitMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  return (
    <div className="rounded-xl bg-gray w-[90%] md:w-[30%] flex items-center px-[1rem] py-[0.5rem]">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Type your message..."
        className="w-full resize-none overflow-auto p-2 rounded outline-none max-h-[4rem] max-lg:text-sm max-lg:p-1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmitMessage(message);
            setMessage("");
          }
        }}
      />
      <button
        onClick={() => {
          onSubmitMessage(message);
          setMessage("");
        }}
        className="ml-[0.5rem] hover:opacity-[0.5] hover:cursor-pointer duration-300"
      >
        <span className="text-3xl text-red">
          <IoSend />
        </span>
      </button>
    </div>
  );
}
