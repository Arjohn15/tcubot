import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import ClickOutside from "../../../shared/components/OutsideClick";
import RecentVisitsContent from "./RecentVisitsContent";

const RecentVisits = () => {
  const [isRecentVisits, setIsRecentVisits] = useState<boolean>(false);

  {
    return (
      <>
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
                {isRecentVisits ? <RecentVisitsContent /> : null}
              </AnimatePresence>
            </ClickOutside>
          </div>
        </motion.div>
      </>
    );
  }
};

export default RecentVisits;
