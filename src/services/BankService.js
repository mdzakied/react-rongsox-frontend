import axiosInstance from "../api/axiosInstance";

const BankService = () => {
  const addBank = async (payload) => {
    const { data } = await axiosInstance.post("/banks", payload);
    return data;
  };

  const getAllBank = async (query) => {
    const { data } = await axiosInstance.get(`/banks`, { params: query });
    return data;
  };

  const getBankById = async (id) => {
    const { data } = await axiosInstance.get(`/banks/${id}`);
    return data;
  };

  const updateBank = async (payload) => {
    const { data } = await axiosInstance.put("/banks", payload);
    return data;
  };

  const updateStatusBankById = async (payload) => {
    const { data } = await axiosInstance.put(
      `/banks/${payload.id}?status=${payload.status}`
    );
    return data;
  };

  return {
    addBank,
    getAllBank,
    getBankById,
    updateBank,
    updateStatusBankById,
  };
};

export default BankService;
