import dayjs from "dayjs";
import { FC, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUserState } from "../redux/userSlice";
import { MdOutlinePublic } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import Modal from "../../../shared/components/Modal";
import UserProfilePrivacy from "./UserProfilePrivacy";

const UserProfileBirthday: FC = () => {
  const [modal, setModal] = useState<boolean>(false);

  function handleOpenModal(): void {
    setModal(true);
  }
  function handleCloseModal(): void {
    setModal(false);
  }
  const { user } = useAppSelector(selectUserState);

  return (
    <>
      <span>
        <strong>Birthday:</strong>{" "}
        {dayjs(user.formattedBirthday).format("MMMM DD, YYYY")} (
        {dayjs().diff(dayjs(user.formattedBirthday), "year")} years old)
      </span>
      <Modal
        isModalOpen={modal}
        onOpenModal={handleOpenModal}
        onCloseModal={handleCloseModal}
        buttonContent={
          user.show_birthday === 1 ? (
            <span>
              <MdOutlinePublic />
            </span>
          ) : (
            <span>
              <FaLock />
            </span>
          )
        }
        buttonStyle="flex ml-[0.5rem] hover:cursor-pointer hover:opacity-[0.5] duration-300"
        boxContent={
          <UserProfilePrivacy
            name="Birthday"
            onCloseModal={handleCloseModal}
            is_public={user.show_birthday === 1 ? "public" : "private"}
            field="showBirthday"
          />
        }
      />
    </>
  );
};

export default UserProfileBirthday;
