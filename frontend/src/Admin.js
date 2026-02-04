import API from "../api";

const createEvent = async (event) => {
  await API.post("/events", event);
  alert("Event Created");
};