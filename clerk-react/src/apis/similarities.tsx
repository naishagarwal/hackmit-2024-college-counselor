import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface IQuerySimilaritiesPayload {
  name: string;
  college: string;
  major: string;
  query: string;
}

class SimilaritiesApi {
  private axios: AxiosInstance;
  private baseURL = "http://localhost:5010";

  constructor() {
    this.axios = axios.create({
      baseURL: this.baseURL,
    });
  }

  async querySimilarities(params: IQuerySimilaritiesPayload) {
    const request: AxiosRequestConfig = {
      method: "POST",
      url: "/query_similarities",
      data: {
        name: params.name,
        college: params.college,
        major: params.major,
        query: params.query
      },
    };

    const response = await this.axios(request);
    return response.data;
  }

  async generateCollegePlan(params: IQuerySimilaritiesPayload) {
    const request: AxiosRequestConfig = {
      method: "POST",
      url: "/generate_college_plan",
      data: {
        name: params.name,
        college: params.college,
        major: params.major,
        query: params.query
      }
    };
    const response = await this.axios(request);
    return response.data;
  }
}

export default SimilaritiesApi;
