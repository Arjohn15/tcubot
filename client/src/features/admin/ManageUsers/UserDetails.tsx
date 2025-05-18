import { FC, useState } from "react";
import { RegistrantType } from "../AdminDashboard/Registrant";
import Modal from "../../../shared/components/Modal";
import UserInfo from "./UserInfo";

const UserDetails: FC<{ user: RegistrantType }> = ({ user }) => {
  const [modal, setModal] = useState<boolean>(false);

  function handleOpenModal(): void {
    setModal(true);
  }
  function handleCloseModal(): void {
    setModal(false);
  }

  return (
    <>
      <Modal
        isModalOpen={modal}
        onOpenModal={handleOpenModal}
        onCloseModal={handleCloseModal}
        buttonContent={
          <div className="flex w-full text-left">
            <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
              {user.last_name}
            </span>
            <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
              {user.first_name}
            </span>
            <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
              {user.school_assigned_number}
            </span>
          </div>
        }
        buttonStyle="rounded-lg border-1 border-gray-half bg-[#efefef11] p-[1rem] normal-case w-full shadow-lg hover:bg-gray-half hover:cursor-pointer duration-300"
        boxContent={
          <div className="px-[2rem] py-[1rem] relative bg-white rounded-lg w-[100%] min-h-[100%]">
            <UserInfo user={user} onCloseModal={handleCloseModal} />
          </div>
        }
      />
    </>
  );
};

export default UserDetails;
