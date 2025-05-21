import React, { FC, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

interface NewModalProps {
  boxContent: React.ReactNode;
  isModalOpen: boolean;
  onCloseModal: () => void;
}

const NewModal: FC<NewModalProps> = ({
  boxContent,
  isModalOpen,
  onCloseModal,
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <AnimatePresence initial={false}>
        {isModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="box"
            className="w-[100vw] h-[100vh] fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-999"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div ref={boxRef}>{boxContent}</div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default NewModal;
