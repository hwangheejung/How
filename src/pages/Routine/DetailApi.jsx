import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlineConsoleSql } from "react-icons/ai";

const DetailApi = () => {
  const { state } = useLocation();
  const { id } = state;

  axios
    .get(`http://52.78.0.53/api/ex-routine?id=${id}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  return <div>상세</div>;
};

export default DetailApi;
