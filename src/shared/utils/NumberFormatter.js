const NumberFormatter = () => {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number).replace(",00", "");
  };

  return {
    formatRupiah,
  };
};

export default NumberFormatter;
