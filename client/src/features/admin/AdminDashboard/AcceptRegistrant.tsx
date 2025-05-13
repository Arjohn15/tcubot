import { FC, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { FaCheck } from "react-icons/fa6";
import { Button } from "@mui/material";
import axios from "axios";
import CircularLoading from "../../../shared/components/LoadingCircular";
import { severity_type } from "../../../shared/components/SnackbarAuto";
interface AcceptRegistrantProps {
  email: string;
  first_name: string;
  id: string;
  onOpenSB: (mes: string, sev: severity_type) => void;
}

const AcceptRegistrant: FC<AcceptRegistrantProps> = ({
  email,
  first_name,
  id,
  onOpenSB,
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function handleOpenModal(): void {
    setModal(true);
  }
  function handleCloseModal(): void {
    setModal(false);
  }

  async function handleConfirmAccept() {
    const data = { email, name: first_name, id };

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/dashboard/send-email-accept",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
          },
        }
      );

      if (res.status === 201) {
        setLoading(false);
        handleCloseModal();
        onOpenSB("Registrant successfully accepted", "success");
      }
    } catch (err: any) {
      setLoading(false);
      handleCloseModal();
      onOpenSB(
        err.response.data.message || "Something went wrong. Please try again",
        "error"
      );
    }
  }

  let ui;

  if (loading) {
    ui = <CircularLoading />;
  }

  return (
    <>
      <Modal
        isModalOpen={modal}
        onCloseModal={handleCloseModal}
        onOpenModal={handleOpenModal}
        buttonContent={
          <>
            <span className="text-lg">{<FaCheck />}</span>
            <span>Accept</span>
          </>
        }
        buttonStyle="bg-green text-white rounded-lg flex items-center px-[1rem] py-[0.5rem] hover:cursor-pointer hover:opacity-[0.85] duration-300"
        boxContent={
          ui ? (
            ui
          ) : (
            <div className="bg-white rounded-lg px-[1rem] pt-[1rem] pb-[0.5rem] w-[350px]">
              <div className="flex items-center pb-[1rem]">
                <span className="opacity-[0.5]">
                  <img
                    src="/images/logos/tcubot-logo-gray.png"
                    alt="TCUbot gray logo"
                    width={50}
                  />
                </span>
                <h3 className="font-bold text-center text-lg">
                  Confirming the registrant
                </h3>
              </div>
              <span className="text-sm">
                By clicking <strong>Confirm</strong>, the registrant will become
                a user of TCUbot and will be notified via email. Click{" "}
                <strong>Confirm</strong> to proceed, or <strong>Cancel</strong>{" "}
                to abort.
              </span>
              <div className="flex justify-center mt-[1rem] gap-x-5">
                <Button color="error" onClick={handleCloseModal}>
                  <span>Cancel</span>
                </Button>
                <Button color="success">
                  <span className="font-bold" onClick={handleConfirmAccept}>
                    Confirm
                  </span>
                </Button>
              </div>
            </div>
          )
        }
      />
    </>
  );
};

export default AcceptRegistrant;
