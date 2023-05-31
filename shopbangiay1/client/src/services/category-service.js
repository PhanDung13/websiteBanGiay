import { ServiceBase } from "config/service-base";

export class CategoryService extends ServiceBase {
  // Implement method call API

  getCategory = async () => {
    return await this.get("/category");
  };
  deleteCategory = async (params) => {
    const { id } = params;
    return await this.delete(`/category/${id}`);
  };
  newCategory = async (params) => {
    const { image, name, description } = params;
    return await this.post("/category", { image, name, description });
  };
  updateCategory = async (params) => {
    const { image, name, description, id } = params;
    return await this.put(`/category/${id}`, { image, name, description });
  };
}
