import { FC, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useAppSelector } from "../../store/hooks";
import { selectUserState } from "../redux/userSlice";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import { SyncLoader } from "react-spinners";
import axios from "axios";
import { HOST } from "../../../utils/getHost";
import ChatMessage from "./ChatMessage";
import { AnimatePresence, motion } from "motion/react";

const UserChat: FC = () => {
  const [message, setMessage] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");

  const [convo, setConvo] = useState<
    { _id: string; message: string; sender: string }[]
  >([]);
  const [userInfos, setUserInfos] = useState<any[]>([]);

  const [responseAILoading, setResponseAILoading] = useState<boolean>(false);

  const { loading, user } = useAppSelector(selectUserState);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatOverviewRef = useRef<HTMLDivElement>(null);

  function scrollDownConvoOverview(isSmooth: boolean): void {
    setTimeout(() => {
      const chatOverviewEl = chatOverviewRef.current;
      if (chatOverviewEl) {
        chatOverviewEl.scrollTo({
          top: chatOverviewEl.scrollHeight,
          behavior: isSmooth ? "smooth" : "auto",
        });
      }
    }, 100);
  }

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 85) + "px";
    }
  };

  async function handleSubmitMessage() {
    if (message !== "") {
      setConvo((prevConvo) => [
        ...prevConvo,
        {
          message: message,
          sender: "user",
          _id: `temp-id-message:${message}-${new Date().getTime()}`,
        },
      ]);

      setUserInfos([]);

      setMessage("");

      scrollDownConvoOverview(true);

      setResponseAILoading(true);

      try {
        const resp = await axios.post(
          `http://${HOST}/user/chat/ai`,
          { message },
          {
            headers: {
              Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
            },
          }
        );

        const tempId = `temp-id-message:${message}-${Date.now()}`;

        setConvo((prevConvo) => [
          ...prevConvo,
          {
            message: resp.data.aiResponse,
            sender: "ai",
            _id: tempId,
          },
        ]);

        if (resp.data.userInfos) {
          setUserInfos(resp.data.userInfos);
        }

        scrollDownConvoOverview(true);
        setResponseAILoading((isResponseLoading) => !isResponseLoading);
      } catch (err: any) {
        const tempId = `temp-id-message:${message}-${Date.now()}`;

        setConvo((prevConvo) => [
          ...prevConvo,
          {
            message: err.response.data.message,
            sender: "ai",
            _id: tempId,
          },
        ]);

        setResponseAILoading((isResponseLoading) => !isResponseLoading);
      }
    }
  }

  async function getChatHistory() {
    try {
      const resp = await axios.get(`http://${HOST}/user/chat/history`, {
        headers: {
          Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
        },
      });

      setConvo(resp.data.chatHistory);
    } catch (err: any) {
      setErrMessage(
        err.response.data.message ||
          "Something went wrong. Please try again later."
      );
    }
  }

  useEffect(() => {
    getChatHistory();
  }, []);

  console.log(userInfos);

  if (loading) {
    return (
      <div className="h-[80vh]">
        <LoadingCircular />;
      </div>
    );
  }

  return (
    <div>
      <div
        ref={chatOverviewRef}
        className="h-[70vh] mx-[20rem] overflow-y-auto"
      >
        <AnimatePresence initial={false}>
          {userInfos.length !== 0 ? (
            <div className="sticky top-[0] flex justify-end">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className=" bg-white p-[1rem] rounded-lg border-1"
                key="box"
              >
                <span>
                  Learn more by visiting{" "}
                  <a
                    className="text-underline text-blue"
                    target="_blank"
                    href={`/user/visit/${userInfos[0].id}`}
                  >
                    {userInfos[0].name}
                  </a>
                  ’s profile.
                </span>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
        {convo.length !== 0 && (
          <ul>
            {convo.map((c, index) => {
              return (
                <li key={c._id}>
                  <div className="text-wrap">
                    {c.sender === "user" ? (
                      <div className="flex justify-end text-wrap my-[1.5rem]">
                        <p className="max-w-[50%] bg-red text-white px-[1rem] py-[0.5rem] rounded-xl break-words">
                          {c.message}
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-start my-[1rem]">
                        {index === convo.length - 1 ? (
                          <ChatMessage
                            onScrollDown={scrollDownConvoOverview}
                            message={c.message}
                          />
                        ) : (
                          <p>{c.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
            {responseAILoading && (
              <li>
                <span className="block px-[1rem]">
                  <SyncLoader
                    size="0.5rem"
                    color="gray"
                    speedMultiplier={0.5}
                  />
                </span>
              </li>
            )}
          </ul>
        )}

        {convo.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="flex justify-center items-center flex-col opacity-[0.25]">
              <div>
                <img
                  src="/images/logos/tcubot-main-logo(2).png"
                  alt="TCUbot gray logo"
                  width={130}
                />
              </div>
              <div className="text-center text-3xl font-bold">
                <p>
                  Hi, {user.first_name} <br /> How can I help you?
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-[2rem]">
        <div className="rounded-xl bg-gray w-[30%] flex items-center px-[1rem] py-[0.5rem]">
          <textarea
            value={message}
            placeholder="Ask about people of TCU"
            ref={textareaRef}
            onInput={handleInput}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded resize-none overflow-auto max-h-[5.3125rem] outline-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitMessage();
              }
            }}
          ></textarea>
          <button
            onClick={handleSubmitMessage}
            className="ml-[0.5rem] hover:opacity-[0.5] hover:cursor-pointer duration-300"
          >
            <span className="text-3xl text-red">
              <IoSend />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
