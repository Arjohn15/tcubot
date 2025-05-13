import { Button } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export interface AdminAvatarProps {
  first_name: string;
  last_name: string;
}

const AdminAvatar: FC<AdminAvatarProps> = ({ first_name, last_name }) => {
  const [isInfoOpen, setInfoOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  function handleLogoutAdmin(): void {
    localStorage.removeItem("token-admin");
    navigate("/admin");
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setInfoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-10" ref={ref}>
      <button
        onClick={() => setInfoOpen(true)}
        className="bg-green rounded-full text-2xl w-[3rem] h-[3rem] text-white hover:cursor-pointer hover:opacity-[0.5] duration-300"
        style={{
          border: isInfoOpen ? "2px solid #eb7373" : "2px solid #eb737300",
        }}
      >
        {first_name[0]}
        {last_name[0]}
      </button>
      <AnimatePresence initial={false}>
        {isInfoOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            key="box"
            className="text-center flex flex-col absolute top-[100%] right-[100%] translate-x-[45%] bg-white shadow-lg w-[150px] rounded-lg"
          >
            <h3 className="text-xl font-bold pt-[1rem]">Profile</h3>
            <div className="py-[0.5rem]">
              <span className="text-xs">Admin</span>
              <span className="block">
                {first_name} {last_name}
              </span>
            </div>
            <div className="flex justify-center">
              <Button
                sx={{
                  width: "max-content",
                  textTransform: "none",
                }}
                onClick={handleLogoutAdmin}
              >
                Log out
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AdminAvatar;
