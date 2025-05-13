import { FC, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { IoClose, IoMailOutline, IoMailOpenOutline } from "react-icons/io5";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import CircularLoading from "../../../shared/components/LoadingCircular";
import { severity_type } from "../../../shared/components/SnackbarAuto";

interface RejectRegistrantProps {
  email: string;
  first_name: string;
  id: string;
  onOpenSB: (mes: string, sev: severity_type) => void;
}

const RejectRegistrant: FC<RejectRegistrantProps> = ({
  email,
  first_name,
  id,
  onOpenSB,
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleOpenModal(): void {
    setModal(true);
  }
  function handleCloseModal(): void {
    setModal(false);
    setMessage("");
  }

  async function handleConfirmReject() {
    const data = { email, name: first_name, message, id };

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/dashboard/send-email-reject",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
          },
        }
      );

      if (res.status === 200) {
        setLoading(false);
        handleCloseModal();
        onOpenSB("Registrant successfully rejected", "success");
      }
    } catch (err: any) {
      setLoading(false);
      handleCloseModal();
      onOpenSB(err.response.data.message || "Something went wrong", "error");
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
            <span className="text-xl">{<IoClose />}</span>
            <span>Reject</span>
          </>
        }
        buttonStyle="bg-red text-white rounded-lg flex items-center px-[1rem] py-[0.5rem] hover:cursor-pointer hover:opacity-[0.85] duration-300"
        boxContent={
          ui ? (
            ui
          ) : (
            <div className="bg-white rounded-lg px-[1rem] py-[0.5rem] w-[350px]">
              <div className="flex flex-col gap-y-[0.5rem]">
                <span className="flex items-center text-sm">
                  from:
                  <span className="font-bold ml-[0.25rem]">
                    tcuva23@gmail.com{" "}
                  </span>
                  <span className="ml-[0.25rem]">
                    <IoMailOutline />
                  </span>
                </span>
                <span className="flex items-center text-sm">
                  to:
                  <span className="font-bold ml-[0.25rem]">{email}</span>
                  <span className="ml-[0.25rem]">
                    <IoMailOpenOutline />
                  </span>
                </span>
              </div>
              <div className="my-[0.5rem]">
                <TextField
                  id="outlined-multiline-static"
                  label="Reject reason *"
                  multiline
                  rows={5}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <span style={{ fontSize: "0.65rem" }} className="italic text-red">
                Note: By clicking confirm, the registrant will be deleted and
                the reject reason will be sent to registrant's email.
              </span>
              <div className="flex justify-center mt-[1rem] gap-x-5">
                <Button color="error" onClick={handleCloseModal}>
                  <span>Cancel</span>
                </Button>
                <Button
                  color="success"
                  onClick={handleConfirmReject}
                  disabled={message === "" ? true : false}
                >
                  <span className="font-bold">Confirm</span>
                </Button>
              </div>
            </div>
          )
        }
      />
    </>
  );
};

export default RejectRegistrant;
