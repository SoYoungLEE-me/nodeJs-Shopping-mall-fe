import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import OrderDetailModal from "./component/OrderDetailModal"; // 새로 만들 것
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (orderList?.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }

  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          key={item._id}
          orderItem={item}
          onClick={() => handleOpen(item)}
        />
      ))}

      {open && (
        <OrderDetailModal
          open={open}
          handleClose={handleClose}
          order={selectedOrder}
        />
      )}
    </Container>
  );
};

export default MyPage;
