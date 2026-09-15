import axios from "axios";

const coreTeamApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/team`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Add
export const addCoreTeamApi = async (data: FormData) => {
  return coreTeamApi.post(
    "/add-core-team",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getCoreTeamApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return coreTeamApi.get(
    `/list-core-team?page=${page}&limit=${limit}&search=${search}`
  );
};

// Detail
export const getCoreTeamByIdApi = async (
  id: string
) => {
  return coreTeamApi.get(
    `/core-team-detail/${id}`
  );
};

// Update
export const updateCoreTeamApi = async (
  id: string,
  data: FormData
) => {
  return coreTeamApi.put(
    `/update-core-team/${id}`,
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

// Delete
export const deleteCoreTeamApi = async (
  id: string
) => {
  return coreTeamApi.delete(
    `/delete-core-team/${id}`
  );
};

// Status
export const changeCoreTeamStatusApi =
  async (id: string) => {
    return coreTeamApi.patch(
      `/change-status/${id}`
    );
  };