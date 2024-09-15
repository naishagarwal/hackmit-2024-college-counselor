import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class SimilaritiesApi {
  private axios: AxiosInstance;
  private baseURL = "http://localhost:5010";

  constructor() {
    this.axios = axios.create({
      baseURL: this.baseURL,
    });
  }

  async querySimilarities(params: { text: string }) {
    const request: AxiosRequestConfig = {
      method: "POST",
      url: "/query_similarities",
      data: {
        query: params.text,
      },
    };

    const response = await this.axios(request);
    return response.data;
  }
}

export default SimilaritiesApi;
