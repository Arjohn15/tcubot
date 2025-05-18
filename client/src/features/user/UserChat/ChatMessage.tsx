import { FC } from "react";
import { Typewriter } from "react-simple-typewriter";

const ChatMessage: FC<{
  message: string;
  onScrollDown: (isSmooth: boolean) => void;
}> = ({ message, onScrollDown }) => {
  return (
    <>
      <Typewriter
        words={[message]}
        loop={1}
        cursor={false}
        typeSpeed={1}
        deleteSpeed={0}
        delaySpeed={100}
        onType={() => onScrollDown(true)}
      />
    </>
  );
};

export default ChatMessage;
