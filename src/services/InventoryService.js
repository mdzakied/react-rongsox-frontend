import axiosInstance from "../api/axiosInstance";

const InventoryService = () => {
  const addInventory = async (payload) => {
    const { data } = await axiosInstance.post("/stuffs", payload);
    return data;
  };

  const getAllInventory = async (query) => {
    const { data } = await axiosInstance.get(`/stuffs`, { params: query });
    return data;
  };

  const getInventoryById = async (id) => {
    const { data } = await axiosInstance.get(`/stuffs/${id}`);
    return data;
  };

  const updateInventory = async (payload) => {
    const { data } = await axiosInstance.put("/stuffs", payload);
    return data;
  };

  const updateStatusInventoryById = async (payload) => {
    const { data } = await axiosInstance.put(
      `/stuffs/${payload.id}?status=${payload.status}`
    );
    return data;
  };

  return {
    addInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    updateStatusInventoryById,
  };
};

export default InventoryService;
