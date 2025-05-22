import TextField from "@mui/material/TextField";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SnackbarAuto from "../../../shared/components/SnackbarAuto";

const HOST = import.meta.env.VITE_API_URL;

const UserLogIn = () => {
  const [schoolNumber, setSchoolNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registered, setRegistered] = useState(false);

  const [serverMessage, setServerMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(): Promise<void> {
    try {
      const res = await axios.post(`${HOST}/auth/login/user`, {
        school_assigned_number: schoolNumber,
        password,
      });

      localStorage.setItem("token-user", res.data.token);
      navigate("/user/chat");
    } catch (err: any) {
      setServerMessage(err.response.data.message);
    }
  }

  useEffect(() => {
    const isRegister = localStorage.getItem("registered");

    if (isRegister) {
      setRegistered(true);
      setTimeout(() => {
        localStorage.removeItem("registered");
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const checkUserAccess = async () => {
      const token = localStorage.getItem("token-user");

      if (token) {
        try {
          const res = await axios.get(`${HOST}/auth/user-login-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.status === 200) {
            navigate("/user/chat");
          }
        } catch (err: any) {
          console.error(err.response.data.message);
        }
      }
    };

    checkUserAccess();
  }, []);

  return (
    <div className="h-[100vh] flex flex-col">
      <div className="grow-1 flex flex-col items-center justify-center">
        <div className="mb-[0.5rem]">
          <img
            src="/images/logos/tcubot-main-logo(2).png"
            alt="TCUbot main logo"
            width={250}
          />
        </div>
        <div className="w-[75vw] sm:w-[50vw] md:w-[25vw] border-2 border-gray-half px-[1.5rem] py-[2rem] rounded-lg grid gap-y-5 mb-[5rem]">
          <div className="mt-[1rem]">
            <TextField
              id="user-schoolNumber"
              label="School assigned number"
              variant="outlined"
              fullWidth
              onChange={(e) => setSchoolNumber(e.target.value)}
            />
          </div>
          <div>
            <TextField
              id="user-password"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <LuEye /> : <LuEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="flex flex-col items-center">
            {serverMessage && (
              <p className="text-red text-sm pb-[1rem]">{serverMessage}</p>
            )}
            <Button
              variant="contained"
              sx={{
                color: "white",
                textTransform: "none",
                padding: "0.75rem 0 0.75rem 0",
                marginTop: "1rem",
              }}
              fullWidth
              type="submit"
              onClick={handleSubmit}
            >
              <span className="text-lg">Log In</span>
            </Button>
            <Link to={"/register"} className="block mt-[1rem]">
              <span className="font-bold w-max text-red mt-[1rem] block hover:cursor-pointer hover:underline">
                Register new account
              </span>
            </Link>
          </div>
        </div>
        <span className="absolute top-[0] right-[2rem]">
          <Link to={"/admin"} target="_blank">
            <span className="font-bold w-max text-red mt-[1rem] block hover:cursor-pointer hover:underline">
              Log in as admin
            </span>
          </Link>
        </span>
        <SnackbarAuto
          isOpen={registered}
          onClose={() => setRegistered(false)}
          message={
            "Account registered! We'll email you once your info is verified."
          }
          severity="success"
        />
      </div>
    </div>
  );
};

export default UserLogIn;
