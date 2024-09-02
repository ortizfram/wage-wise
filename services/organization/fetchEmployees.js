import axios from "axios";
import { RESP_URL } from "../../config";

const fetchEmployees = async (orgId) => {
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

export default fetchEmployees;
