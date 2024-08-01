import { DeleteRequest, GetRequest, PostRequest } from "@/lib/requests";
import { ProjectData } from "@/interfaces/projects";
import { AssetData } from "@/interfaces/assets";
import { ProcessData } from "@/interfaces/processes";
import { BASE_API_URL } from "@/constants";
import { AxiosResponse } from "axios";

const projectsApiUrl = "/projects";

export const GetProject = async (projectId: string) => {
  try {
    const response = await GetRequest<{ data: ProjectData }>(
      `${projectsApiUrl}/${projectId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetProjects = async (page: number, pageSize: number) => {
  try {
    const response = await GetRequest<{ data: ProjectData[] }>(
      `${projectsApiUrl}?page=${page}&page_size=${pageSize}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const CreateProject = async (data: {
  name: string;
  description: string;
}) => {
  try {
    const response = await PostRequest<{ data: ProjectData }>(
      projectsApiUrl,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetProjectAssets = async (
  projectId: string,
  page: number | null = null,
  pageSize: number|null = null
) => {
  try {

    const uri  = (page && pageSize) && (page!=undefined && pageSize!=undefined) ? `${projectsApiUrl}/${projectId}/assets?page=${page}&page_size=${pageSize}`:
    `${projectsApiUrl}/${projectId}/assets`  
    const response = await GetRequest<{ data: AssetData[] }>(
      uri
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetProjectAssetURL = (
  projectId: string,
  assetId: string | null
) => {
  return `${BASE_API_URL}/${projectsApiUrl}/${projectId}/assets/${assetId}`;
};

export const FetchAssetFile = async (
  projectId: string,
  assetId: string
): Promise<Blob> => {
  try {
    const response: AxiosResponse<Blob> = await GetRequest<Blob>(
      `${projectsApiUrl}/${projectId}/assets/${assetId}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching asset file:", error);
    throw error;
  }
};

export const AddProjectAsset = async (projectId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("files", file);
    const response = await PostRequest<{ data: any }>(
      `${projectsApiUrl}/${projectId}/assets`,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetProjectProcesses = async (projectId: string) => {
  try {
    const response = await GetRequest<{ data: ProcessData[] }>(
      `${projectsApiUrl}/${projectId}/processes`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeleteProject = async (projectId: string) => {
  try {
    const response = await DeleteRequest(`${projectsApiUrl}/${projectId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeleteAssets = async (projectId: string, assetId: string) => {
  try {
    const response = await DeleteRequest(
      `${projectsApiUrl}/${projectId}/assets/${assetId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
