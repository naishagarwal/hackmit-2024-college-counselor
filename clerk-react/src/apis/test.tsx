import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
//
import type {
  ICreateChannel,
  IUpdateChannel,
  ChannelCredentials,
  IWooCommerceChannel,
  IFalabellaChannel
} from "../types/user.types";

interface RequestConfig extends AxiosRequestConfig {
  headers?: {
    Authorization?: string;
  };
  params?: {
    [key: string]: string | number | null;
  };
}

class UserAPI {
  private axios: AxiosInstance;
  private baseURL: string = import.meta.env.VITE_API_URL as string;

  constructor(private token: { token: string | undefined; }) {
    this.axios = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.token.token}`,
      }
    });
  }

  async getUserData(params: { userId: string }) {
    const request: RequestConfig = {
      method: "GET",
      url: "/users",
      params: {
        userId: params.userId,
      }
    };

    const response = await this.axios(request);
    return response.data;
  }

  async createChannel(params: ICreateChannel) {
    const { platformId } = params;
    let channelCredentials: ChannelCredentials;
    switch (platformId) {
      case "woocommerce": {
        const wc_credentials = params.credentials as IWooCommerceChannel;
        channelCredentials = {
          origin_url: wc_credentials.origin_url,
          client_key: wc_credentials.client_key,
          client_secret: wc_credentials.client_secret
        } as IWooCommerceChannel;
        break;
      }
      case "falabella": {
        const fsc_credentials = params.credentials as IFalabellaChannel;
        channelCredentials = {
          user_id: fsc_credentials.user_id,
          api_key: fsc_credentials.api_key
        } as IFalabellaChannel;
        break;
      }
      default:
        throw new Error("Invalid platformId");
    }

    const request: RequestConfig = {
      method: "POST",
      url: "/users/channels",
      data: {
        userId: params.user_id,
        channel: {
          name: params.name,
          platform: params.platform,
          platformId: params.platformId,
          apiCredentials: channelCredentials
        }
      }
    };

    const response = await this.axios(request);
    return response.data;
  }

  // TODO: Pending to refactor on a separate service for channels
  async updateChannel(params: IUpdateChannel) {
    const { channel } = params;

    const request: RequestConfig = {
      method: "PUT",
      url: `/users/channels/${channel.channelId}`,
      data: { channel }
    };

    const response = await this.axios(request);
    return response.data;
  }

  async removeChannel(params: { user_id: string, channel_id: string }) {
    const request: RequestConfig = {
      method: "DELETE",
      url: "/users/channels",
      data: {
        userId: params.user_id,
        channelId: params.channel_id,
      }
    };

    const response = await this.axios(request);
    return response.data;
  }

  async retrieveUsers() {
    const request: RequestConfig = {
      method: "GET",
      url: "/users/all"
    };

    const response = await this.axios(request);
    return response.data;
  }

  async createUser({ userData }: { userData: { name: string; email: string; pwd: string; } }) {
    const request: RequestConfig = {
      method: "POST",
      url: "/users",
      data: {
        user: {
          name: userData.name,
          email: userData.email,
          pwd: userData.pwd
        }
      }
    };

    const response = await this.axios(request);
    return response.data;
  }

  async removeUser({ userId }: { userId: string }) {
    const encodedUserId = encodeURIComponent(userId);
    const request: RequestConfig = {
      method: "DELETE",
      url: `/users/${encodedUserId}`
    };

    const response = await this.axios(request);
    return response.data;
  }
}

export default UserAPI;