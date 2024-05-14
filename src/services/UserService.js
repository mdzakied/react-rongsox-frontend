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

  return {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    updateStatusAdminById,
  };
};

export default UserService;
