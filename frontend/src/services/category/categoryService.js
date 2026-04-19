import { http } from "../../utils/httpClient";

// add category
export const addCategoryAPI = async ({ name, type }) => {
  const { data } = await http.post("/categories/create", { name, type });
  return data;
};

// update category
export const updateCategoryAPI = async ({ name, type, id }) => {
  const { data } = await http.put(`/categories/update/${id}`, { name, type });
  return data;
};

// delete category
export const deleteCategoryAPI = async (id) => {
  const { data } = await http.delete(`/categories/delete/${id}`);
  return data;
};

// list categories
export const listCategoriesAPI = async () => {
  const { data } = await http.get("/categories/lists");
  return data;
};
