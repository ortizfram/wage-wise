import axios from "axios";
import { RESP_URL } from "../../config";

export const fetchEmployees = async (orgId) => {
  try {
    const response = await axios.get(
      `${RESP_URL}/api/organization/${orgId}/employees`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
export const fetchEmployeeWithId = async (uid) => {
  try {
    const response = await axios.get(`${RESP_URL}/api/users/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

