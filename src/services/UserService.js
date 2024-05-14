import axiosInstance from "../api/axiosInstance";

const UserService = () => {
  const getAllAdmin = async (query) => {
    const { data } = await axiosInstance.get(`/admins`, { params: query });
    return data;
  };

  const getAdminById = async (id) => {
    const { data } = await axiosInstance.get(`/admins/${id}`);
    return data;
  };

  const updateAdmin = async (payload) => {
    const { data } = await axiosInstance.put("/admins", payload);
    return data;
  };

  const updateStatusAdminById = async (payload) => {
    const { data } = await axiosInstance.put(
      `/admins/${payload.id}?status=${payload.status}`
    );
    return data;
  };

  const getAllCustomer = async (query) => {
    const { data } = await axiosInstance.get(`/customers`, { params: query });
    return data;
  };

  const getCustomerById = async (id) => {
    const { data } = await axiosInstance.get(`/customers/${id}`);
    return data;
  };

  const updateCustomer = async (payload) => {
    const { data } = await axiosInstance.put("/customers", payload);
    return data;
  };

  const updateStatusCustomerById = async (payload) => {
    const { data } = await axiosInstance.put(
      `/customers/${payload.id}?status=${payload.status}`
    );
    return data;
  };

  return {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    updateStatusAdminById,
    getAllCustomer,
    getCustomerById,
    updateCustomer,
    updateStatusCustomerById,
  };
};

export default UserService;
