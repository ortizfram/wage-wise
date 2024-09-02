import axios from "axios";
import { RESP_URL } from "../../config";

const fetchOrganization = async (orgId) => {
  try {
    const response = await axios.get(`${RESP_URL}/api/organization/${orgId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

export default fetchOrganization;
