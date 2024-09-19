import axios from "axios";
import { RESP_URL } from "../../config";

export const fetchShiftWithId = async (uid, startDate, endDate) => {
  try {
    const response = await axios.get(`${RESP_URL}/api/shift/${uid}`, {
      params: { startDate, endDate }, // Send the start and end dates as query parameters
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shift Id:", error);
    throw error;
  }
};
