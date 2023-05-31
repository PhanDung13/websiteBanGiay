import { ServiceBase } from "config/service-base";

export class MessagesService extends ServiceBase {
  getMessages = async (params) => {
    const { id } = params;
    return await this.get(`/messages/${id}`);
  };
  newMessage = async (params) => {
    return await this.post("/messages", params);
  };
}
