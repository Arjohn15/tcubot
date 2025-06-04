import { useEffect, useState } from "react";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import { motion } from "motion/react";
import axios from "axios";
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

const RecentVisitsContent = () => {
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

  return (
    <motion.div
      key="slidingDiv"
      initial={{ y: "-5%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-5%", opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="shadow-lg relative w-[10rem] max-h-[10rem] bg-white border-1 border-t-0 border-gray-half overflow-y-auto rounded-lg mt-[0.25rem] p-[1rem]">
        {recentVisitsState.loading &&
          recentVisitsState.recentVisits.length !== 0 && (
            <LoadingCircular size="1.5rem" />
          )}

        {recentVisitsState.error && (
          <p className="text-xs absolute top-[50%] translate-y-[-50%] text-center text-gray">
            {recentVisitsState.error}
          </p>
        )}
        <ul className="relative flex flex-col gap-y-2 text-sm max-lg:text-xs w-[100%] h-[100%] list-none">
          {recentVisitsState.recentVisits.length !== 0 ? (
            recentVisitsState.recentVisits.map((recentVisit) => {
              return (
                <li key={recentVisit._id}>
                  <a
                    href={`/user/visit/${recentVisit._id}`}
                    className="text-red hover:underline"
                  >
                    {recentVisit.first_name} {recentVisit.last_name}
                  </a>
                </li>
              );
            })
          ) : (
            <li
              key={"no-recent-visits"}
              className="w-max text-gray absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
            >
              No recent visits
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default RecentVisitsContent;
