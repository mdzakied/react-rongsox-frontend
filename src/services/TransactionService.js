import axiosInstance from "../api/axiosInstance";

const TransactionService = () => {
  const addTransactionDeposit = async (payload) => {
    const { data } = await axiosInstance.post("/transactions/deposit", payload);
    return data;
  };

  const getAllTransaction = async (query) => {
    const { data } = await axiosInstance.get(`/transactions`, {
      params: query,
    });
    return data;
  };

  const updateStatusTransactionDepositById = async (payload) => {
    const { data } = await axiosInstance.put(
      `/transactions/deposit/${payload.id}?status=${payload.status}`
    );
    return data;
  };

  const updateStatusTransactionWithdraw = async (payload) => {
    const { data } = await axiosInstance.put(`/transactions/withdrawal`, payload);
    return data;
  };

  return {
    addTransactionDeposit,
    getAllTransaction,
    updateStatusTransactionDepositById,
    updateStatusTransactionWithdraw,
  };
};

export default TransactionService;
