import { Request, Response } from "express";

const errorHandlerMySQL = (
  req: Request,
  resp: Response,
  err_message: string,
  err_no: number
) => {
  switch (err_no) {
    case 1062: {
      const match = err_message.match(/for key '(.+?)'/);

      if (match) {
        const key = match[1];

        if (key.includes("email")) {
          resp.status(400).json({
            error: "Email is already taken. Please use other email address.",
          });
          return;
        } else if (key.includes("school_assigned_number")) {
          resp.status(400).json({
            error:
              "School assigned number is already in use. Make sure to use the number assigned to you by TCU.",
          });
          return;
        }
      }
    }
    default: {
      resp
        .status(500)
        .json({ error: "Server error. Please contact the administration." });
      return;
    }
  }
};

export default errorHandlerMySQL;
