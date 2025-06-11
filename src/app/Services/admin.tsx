import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-nzoagro.onrender.com";

// User management
export const updateUserStatus = async (userId: number, status: 'Pendente' | 'Aprovado' | 'Rejeitado') => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/status`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating user status:", error);
    throw error.response?.data || { message: "Error updating user status" };
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/users/${userId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw error.response?.data || { message: "Error deleting user" };
  }
};

// Order management
export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/orders/${orderId}/status`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating order status:", error);
    throw error.response?.data || { message: "Error updating order status" };
  }
};

export const deleteOrder = async (orderId: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/orders/${orderId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting order:", error);
    throw error.response?.data || { message: "Error deleting order" };
  }
};

// Transporter management  
export const updateTransporterStatus = async (transporterId: number, status: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/transporters/${transporterId}/status`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating transporter status:", error);
    throw error.response?.data || { message: "Error updating transporter status" };
  }
};

export const deleteTransporter = async (transporterId: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/transporters/${transporterId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting transporter:", error);
    throw error.response?.data || { message: "Error deleting transporter" };
  }
};
