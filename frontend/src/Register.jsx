import API from "../api";

const registerUser = async (formData) => {
  const res = await API.post("/register", formData);
  console.log(res.data);
};