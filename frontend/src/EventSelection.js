import API from "../api";

const submitEvents = async (data) => {
  const res = await API.post("/register", data);
  alert("Receipt: " + res.data.receipt_no);
};