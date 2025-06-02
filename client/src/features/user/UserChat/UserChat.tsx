import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUserState } from "../redux/userSlice";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import { SyncLoader } from "react-spinners";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import { AnimatePresence, motion } from "motion/react";
import ChatTextArea from "./ChatTextArea";
import RecentVisits from "./RecentVisits";
import { IoMdClose } from "react-icons/io";

const HOST = import.meta.env.VITE_API_URL;

const UserChat: FC = () => {
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

  async function getChatHistory() {
    try {
      const resp = await axios.get(`${HOST}/user/chat/history`, {
        headers: {
          Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
        },
      });

      setConvo(resp.data.chatHistory);
    } catch (err: any) {
      setConvo([]);
      console.error(
        err.response.data.message ||
          "Something went wrong. Please try again later."
      );
    }
  }

  async function handleSubmitMessage(message: string) {
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

      scrollDownConvoOverview(true);

      setResponseAILoading(true);

      setTimeout(() => {
        handleInput();
      }, 100);

      try {
        const resp = await axios.post(
          `${HOST}/user/chat/ai`,
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
            message: err.response.data.aiResponse,
            sender: "ai",
            _id: tempId,
          },
        ]);

        setResponseAILoading((isResponseLoading) => !isResponseLoading);
      }
    }
  }

  useEffect(() => {
    getChatHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh]">
        <LoadingCircular />;
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={chatOverviewRef}
        className="h-[70vh] mx-[20rem] mt-[1rem] overflow-y-auto max-lg:mx-[0] max-lg:text-sm"
      >
        {convo.length !== 0 && (
          <>
            <div className="sticky right-[1rem] top-[0] flex justify-end">
              <AnimatePresence initial={false}>
                {userInfos.length !== 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className=" bg-white p-[1rem] mr-[1rem] rounded-lg border-1 relative max-lg:px-[0.5rem]"
                    key="box"
                  >
                    <span>
                      Learn more by visiting{" "}
                      <a
                        className="text-underline text-red"
                        href={`/user/visit/${userInfos[0].id}`}
                      >
                        {userInfos[0].name}
                      </a>
                      ’s profile.
                    </span>

                    <button
                      onClick={() => setUserInfos([])}
                      className="absolute top-[0.25rem] right-[0.5rem] hover:cursor-pointer hover:opacity-[0.5] duration-300"
                    >
                      <span>
                        <IoMdClose />
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  <RecentVisits />
                )}
              </AnimatePresence>
            </div>
            <ul className="px-[1rem] max-lg:px-[1.5rem]">
              {convo.map((c, index) => {
                return (
                  <li key={c._id}>
                    <div className="text-wrap">
                      {c.sender === "user" ? (
                        <div className="flex justify-end text-wrap my-[2rem] max-lg:my-[1.5rem]">
                          <p className="max-w-[50%] bg-red text-white px-[1rem] py-[0.5rem] rounded-xl break-words max-lg:max-w-[80%]">
                            {c.message}
                          </p>
                        </div>
                      ) : (
                        <div className="flex justify-start my-[2rem] rounded-xl p-[1rem] max-lg:my-[1.5rem] max-lg:p-[0]">
                          {index === convo.length - 1 ? (
                            <div className="whitespace-pre-wrap">
                              <ChatMessage
                                onScrollDown={scrollDownConvoOverview}
                                message={c.message}
                              />
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">
                              <p>{c.message}</p>
                            </div>
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
          </>
        )}

        {convo.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="flex justify-center items-center flex-col opacity-[0.25]">
              <div>
                <img
                  src="/images/logos/tcubot-logo-gray(2).png"
                  alt="TCUbot gray logo"
                  className="w-[150px] max-sm:w-[120px]"
                />
              </div>
              <div className="text-center text-3xl font-bold max-sm:text-2xl">
                <p>
                  Hi, {user.first_name} <br /> How can I help you?
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-[1rem]">
        <ChatTextArea onSubmitMessage={handleSubmitMessage} />
      </div>
    </div>
  );
};

export default UserChat;
