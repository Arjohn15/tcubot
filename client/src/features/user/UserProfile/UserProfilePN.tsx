import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUserState } from "../redux/userSlice";
import Modal from "../../../shared/components/Modal";
import { MdOutlinePublic } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import UserProfilePrivacy from "./UserProfilePrivacy";

const UserProfilePN = () => {
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
        <strong>Phone number:</strong> {user.phone_number}
      </span>
      <Modal
        isModalOpen={modal}
        onOpenModal={handleOpenModal}
        onCloseModal={handleCloseModal}
        buttonContent={
          user.show_phone_number === 1 ? (
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
            name="Phone number"
            onCloseModal={handleCloseModal}
            is_public={user.show_phone_number === 1 ? "public" : "private"}
            field="showPhoneNumber"
          />
        }
      />
    </>
  );
};

export default UserProfilePN;
