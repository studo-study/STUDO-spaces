import axiosRoot from "axios";
import { JWT_TOKEN_KEY } from "../contexts/auth.js";

const baseUrl = import.meta.env.VITE_API_URL;

export const axios = axiosRoot.create({
  baseURL: baseUrl
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);


  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		const hadToken = localStorage.getItem(JWT_TOKEN_KEY);

		if (error.response?.status === 401 && hadToken) {
			localStorage.removeItem(JWT_TOKEN_KEY);
			window.location.href = "/logout";
		}
		return Promise.reject(error);
	}
);

export async function getAll(url) {
  const { data } = await axios.get(url);

  return data;
}

export async function getById(url) {
  const { data } = await axios.get(url);
  return data;
}

export async function save(url, { arg: body }) {
  const { id, ...data } = body;

  const response = await axios({
    method: id ? "PUT" : "POST",
    url: `${url}${id ? `/${id}` : ""}`,
    data
  });

  return response.data;
}

export async function put(url, { arg: body }) {
  await axios.put(url, body);
}

export async function patch(url, { arg: body }) {
  await axios.patch(url, body);
}


export const del = async (url, { arg: id }) => {
  await axios.delete(url);
};


