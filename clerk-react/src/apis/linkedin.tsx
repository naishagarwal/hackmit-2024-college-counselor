import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
//
interface RequestConfig extends AxiosRequestConfig {
  headers?: {
    Authorization?: string;
    "Content-Type"?: string;
  };
  params?: {
    [key: string]: string | number | null;
  };
}
//
class LinkedInApi {
  private axios: AxiosInstance;
  private baseURL = "";

  constructor(private token: { token: string | undefined; }) {
    this.axios = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.token.token}`
      }
    })
  }

  async exchangeAuth4AccessToken(params: { code: string }) {
    const request: RequestConfig = {
      method: "POST",
      baseURL: "https://www.linkedin.com/oauth/v2/accessToken",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        grant_type: "authorization_code",
        code: params.code,
        client_id: "78qinz0gzw4aut",
        client_secret: "12jBhGzAJOgqtpb8",
        redirect_uri: "http://localhost:5173/app/uploader"
      }
    };

    const response = await this.axios(request);
    return response.data;
  }

  async basicUserInfo(params: { token: string }): Promise<{ access_token: string }> {
    const request: RequestConfig = {
      method: "GET",
      baseURL: "https://api.linkedin.com/v2/userinfo",
      headers: {
        "Authorization": `Bearer ${params.token}`
      }
    };

    const response = await this.axios(request);
    return response.data;
  }
}

export default LinkedInApi;
