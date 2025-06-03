import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import ClickOutside from "../../../shared/components/OutsideClick";

const HOST = import.meta.env.VITE_API_URL;

interface RecentVisit {
  first_name: string;
  last_name: string;
  _id: string;
}

interface RecentVisitsState {
  loading: boolean;
  error: string | null;
  recentVisits: RecentVisit[];
}
const RecentVisits = () => {
  const [isRecentVisits, setIsRecentVisits] = useState<boolean>(false);
  const [recentVisitsState, setRecentVisitsState] = useState<RecentVisitsState>(
    {
      loading: true,
      error: null,
      recentVisits: [],
    }
  );

  useEffect(() => {
    const getAllRecentVisits = async () => {
      try {
        const resp = await axios.get<{ visiteesInfo: RecentVisit[] }>(
          `${HOST}/user/recent-visits`,
          {
            headers: {
              Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
            },
          }
        );
        setRecentVisitsState({
          loading: false,
          error: null,
          recentVisits: resp.data.visiteesInfo,
        });
      } catch (err: any) {
        console.log(err);
        setRecentVisitsState({
          loading: false,
          error:
            err.response.data.message ??
            "Something went wrong. Please try again later.",
          recentVisits: [],
        });
      }
    };

    getAllRecentVisits();
  }, []);

  {
    return (
      <>
        {recentVisitsState.recentVisits.length !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute"
          >
            <div className="mr-[0.5rem]">
              <ClickOutside onClickOutside={() => setIsRecentVisits(false)}>
                <button
                  onClick={() => setIsRecentVisits(!isRecentVisits)}
                  className="shadow-xl bg-white border-1 border-gray-half flex gap-x-2 p-[0.25rem] items-center rounded-lg text-sm hover:bg-[#efefef] hover:cursor-pointer duration-300"
                >
                  <span>
                    <MdOutlinePeopleAlt />
                  </span>
                  <span className="max-lg:text-xs">View my recent visits</span>
                  <motion.div
                    className="inline-block"
                    animate={{ rotate: isRecentVisits ? 180 : 0 }}
                    transition={{ duration: 0.1 }}
                    key="arrowUpDown"
                  >
                    <IoIosArrowDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isRecentVisits ? (
                    <motion.div
                      key="slidingDiv"
                      initial={{ y: "-5%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-5%", opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="shadow-lg relative w-[10rem] h-[10rem] bg-white border-1 border-t-0 border-gray-half overflow-y-auto rounded-lg mt-[0.25rem] p-[0.5rem]">
                        {recentVisitsState.loading && (
                          <LoadingCircular size="1.5rem" />
                        )}

                        {recentVisitsState.error && (
                          <p className="text-xs absolute top-[50%] translate-y-[-50%] text-center text-gray">
                            {recentVisitsState.error}
                          </p>
                        )}
                        <ul className="flex flex-col gap-y-2">
                          {recentVisitsState.recentVisits.map((recentVisit) => {
                            return (
                              <li
                                key={recentVisit._id}
                                className="text-sm max-lg:text-xs"
                              >
                                <a
                                  href={`/user/visit/${recentVisit._id}`}
                                  className="text-red hover:underline"
                                >
                                  {recentVisit.first_name}{" "}
                                  {recentVisit.last_name}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </ClickOutside>
            </div>
          </motion.div>
        )}
      </>
    );
  }
};

export default RecentVisits;
