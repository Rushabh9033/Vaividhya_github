import axios from "axios";
import { API as ConfigAPI } from "./config/api";

const API = axios.create({
  baseURL: ConfigAPI.BASE + "/api",
});

export default API;