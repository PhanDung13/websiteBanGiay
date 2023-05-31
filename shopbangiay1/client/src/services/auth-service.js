import { ServiceBase } from "config/service-base";

export class AuthServices extends ServiceBase {
  // Implement method call API
  login = async (params) => {
    const { email, password } = params;
    return await this.post("/auth/login", { email, password });
  };
  activation = async (params) => {
    const { activation_token } = params;
    return await this.post("/auth/activation", { activation_token });
  };
  register = async (params) => {
    const { password, name, email } = params;
    return await this.post("/auth/register", {
      password,
      name,
      email,
    });
  };
  refreshToken = async (params) => {
    return await this.get("/auth/refresh_token", { withCredentials: true });
  };
  logout = async (params) => {
    return await this.post("/auth/logout", { refeshToken: params });
  };
}
