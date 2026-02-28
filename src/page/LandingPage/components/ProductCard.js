import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="card" onClick={() => showProduct(item._id)}>
      <div className="card-img-wrapper">
        <img src={item?.image} alt={item?.name} />
      </div>
      <div className="card-body">
        <div>{item?.name}</div>
        <div>₩ {currencyFormat(item?.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
