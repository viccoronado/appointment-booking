import axios from "axios";
import {
  GET_FREE_HOURS,
  GET_HOURS_TOODAY,
  GET_WSP_MSG,
  EDIT_WSP_MESSAGE,
  FIND_USER,
} from "./types";

export { contactMe, sendMessage } from "./whatsAppActions";
export { compareDate } from "./dates";

export const getUser = (id) => {
  return function (dispatch) {
    axios
      .get(`/usuario/${id}`)
      .then((res) => dispatch(saveInfo(FIND_USER, res.data)))
      .catch(() => console.log("Error al conectar con el servidor"));
  };
};

export const getFreeHours = (data) => {
  return function (dispatch) {
    axios
      .get(`/hoursFree/${data}`)
      .then((res) => dispatch(saveInfo(GET_FREE_HOURS, res.data)))
      .catch(() => console.log("Error al conectar con el servidor"));
  };
};

export const getHoursToday = (data) => {
  return function (dispatch) {
    axios
      .get(`/hoursFree/${data}`)
      .then((res) => dispatch(saveInfo(GET_HOURS_TOODAY, res.data)))
      .catch(() => console.log("Error al conectar con el servidor"));
  };
};

export const saveWspMessage = (message) => {
  return function () {
    axios.post(`/sendMessage`, { message });
  };
};

export const getWspMessage = () => {
  return function (dispatch) {
    axios
      .get(`/whatsAppMessage`)
      .then((res) => dispatch(saveInfo(GET_WSP_MSG, res.data.mensaje)))
      .catch(() => console.log("Error al conectar con el servidor"));
  };
};

export const editWspMessage = (data) => {
  return function (dispatch) {
    dispatch(saveInfo(EDIT_WSP_MESSAGE, data));
  };
};

export const saveInfo = (type, data) => {
  return {
    type: type,
    payload: data,
  };
};
