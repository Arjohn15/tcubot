import axios from "axios";

interface OpenChatResponse {
  status: number; // Success or error status code
  message: string; // The response or error message
}

export const sendToOpenChat = async (
  prompt: string
): Promise<OpenChatResponse> => {
  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "openchat",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    return {
      status: 200,
      message: response.data.message.content,
    };
  } catch (err: any) {
    return {
      status: err.response ? err.response.status : 500,
      message: err.response
        ? err.response.data.error || "Error occurred"
        : "Unknown error",
    };
  }
};
