import { FC, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { FaKey } from "react-icons/fa6";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { snackbarOpened } from "../../store/shared/snackbarSlice";

const HOST = import.meta.env.VITE_API_URL;

const UPChangePassword: FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isOldPassword, setIsOldPassword] = useState<boolean>(false);
  const [isNewPassword, setIsNewPassword] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  function handleOpenModal(): void {
    setModal(true);
  }
  function handleCloseModal(): void {
    setModal(false);
  }

  async function handleSavePassword() {
    try {
      const resp = await axios.put(
        `${HOST}/user-update-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-user")}`,
          },
        }
      );

      if (resp.status === 200) {
        dispatch(
          snackbarOpened({
            isSnackbar: true,
            message: "Password changed successfully",
            severity: "success",
          })
        );
        setPasswordErr(null);
        handleCloseModal();
      }
    } catch (err: any) {
      const errors: any[] = err.response.data.errors;

      if (!errors) {
        setPasswordErr(`${err.response.data.message}`);
      }

      if (errors.length > 0) {
        setPasswordErr(`${errors.map((error) => error.message).join(", ")}`);
      }
    }
  }

  return (
    <>
      <Modal
        isModalOpen={modal}
        onOpenModal={handleOpenModal}
        onCloseModal={handleCloseModal}
        buttonContent={
          <>
            <span>Change my password</span>
            <span className="block ml-[0.5rem]">
              <FaKey />
            </span>
          </>
        }
        buttonStyle="flex items-center border-2 border-gray rounded-xl px-[0.5rem] hover:cursor-pointer hover:opacity-[0.65] duration-300 font-bold"
        boxContent={
          <div className="bg-white p-[1rem] rounded-lg w-[20vw]">
            <h3 className="font-bold text-center text-xl pb-[1rem]">
              Change password
            </h3>

            <div className="grid gap-y-5">
              <div>
                <TextField
                  variant="outlined"
                  label="Old password"
                  fullWidth
                  type={isOldPassword ? "text" : "password"}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setIsOldPassword(!isOldPassword)}
                            edge="end"
                          >
                            {oldPassword ? <LuEye /> : <LuEyeOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  variant="outlined"
                  label="New password"
                  fullWidth
                  type={isNewPassword ? "text" : "password"}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setIsNewPassword(!isNewPassword)}
                            edge="end"
                          >
                            {newPassword ? <LuEye /> : <LuEyeOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              {passwordErr && (
                <span className="text-xs block text-center text-red">
                  {passwordErr}
                </span>
              )}
              <div className="flex justify-center gap-x-5">
                <Button variant="text" onClick={handleCloseModal}>
                  <span className="capitalize">Cancel</span>
                </Button>
                <Button variant="contained" onClick={handleSavePassword}>
                  <span className="capitalize text-white">Save</span>
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};

export default UPChangePassword;
