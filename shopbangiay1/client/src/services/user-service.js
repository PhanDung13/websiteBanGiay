import { ServiceBase } from "config/service-base";

export class UserServices extends ServiceBase {
  // Implement method call API
  updateUser = async (params) => {
    const { name, avatar, phone, address } = params;
    return await this.post("/auth/update", { name, avatar, phone, address });
  };
  updatePassword = async (params) => {
    const { password, newPassword } = params;
    return await this.post("/auth/updatePassword", { password, newPassword });
  };
  uploadAvatar = async (params) => {
    const { avatar } = params;

    return await this.post("/upload_avatar", { avatar });
  };
  getInfo = async () => {
    return await this.get("/auth/infor");
  };
  getInfor = async (params) => {
    const { id } = params;
    return this.get(`/auth/infor/${id}`);
  };
  getAllInfor = async (params) => {
    return this.get(`/auth/all_infor`);
  };
  updateRole = async (params) => {
    const { id, role } = params;
    return this.post(`/auth/update_role/${id}`, { role });
  };
  deleteUser = async (params) => {
    const { id } = params;
    return this.delete(`/auth/delete/${id}`);
  };
  forgot = async (params) => {
    const { email } = params;
    return this.post(`/auth/forgot`, { email });
  };
}
