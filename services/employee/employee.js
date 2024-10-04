import axios from "axios";
import { RESP_URL } from "../../config";

export const updateEmployee = async (uid, updateData) => {
  try {
    const response = await axios.put(
      `${RESP_URL}/api/users/${uid}/update`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating employee");
  }
};
