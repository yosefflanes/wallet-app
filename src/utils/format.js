export const formatIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
};

export const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
};