import { http } from "../../utils/httpClient";

// add transaction
export const addTransactionAPI = async ({
  type,
  category,
  date,
  description,
  amount,
}) => {
  const { data } = await http.post("/transactions/create", {
    category,
    date,
    description,
    amount,
    type,
  });
  return data;
};

// update category (same path as category service; kept name for compatibility)
export const updateCategoryAPI = async ({ name, type, id }) => {
  const { data } = await http.put(`/categories/update/${id}`, { name, type });
  return data;
};

// delete category
export const deleteCategoryAPI = async (id) => {
  const { data } = await http.delete(`/categories/delete/${id}`);
  return data;
};

// list transactions
export const listTransactionsAPI = async ({
  category,
  type,
  startDate,
  endDate,
}) => {
  const { data } = await http.get("/transactions/lists", {
    params: { category, endDate, startDate, type },
  });
  return data;
};
