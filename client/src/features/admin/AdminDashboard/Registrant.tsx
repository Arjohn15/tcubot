import { Button } from "@mui/material";
import { FC } from "react";

export interface RegistrantType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  formattedBirthday: string;
  role: string;
  year: string;
  course: string;
  section: string;
  school_assigned_number: string;
}

interface RegistrantProps {
  first_name: string;
  last_name: string;
  _id: string;
  onClickID: (id: string) => void;
  isSelected: boolean;
}

const Registrant: FC<RegistrantProps> = ({
  first_name,
  last_name,
  _id,
  onClickID,
  isSelected,
}) => {
  return (
    <Button
      fullWidth
      variant="contained"
      onClick={() => onClickID(_id)}
      sx={{
        textTransform: "none",
        justifyContent: "start",
        backgroundColor: "#d9d9d977",
        padding: "1rem",
        outline: isSelected ? "2px solid #eb7373" : "none",
      }}
    >
      <span>
        {last_name}, {first_name}
      </span>
    </Button>
  );
};

export default Registrant;
