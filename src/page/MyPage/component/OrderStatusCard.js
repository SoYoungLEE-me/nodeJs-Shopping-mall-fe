import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  const firstItem = orderItem.items[0];

  return (
    <div className="status-card">
      <Row className="align-items-center w-100">
        <Col xs={3} md={2}>
          <div className="order-image-wrapper">
            <img
              src={firstItem?.productId?.image}
              alt={firstItem?.productId?.name}
            />
          </div>
        </Col>

        <Col xs={9} md={8} className="order-info">
          <div className="order-num">주문번호: {orderItem.orderNum}</div>

          <div className="text-12 text-muted">
            {orderItem.createdAt.slice(0, 10)}
          </div>

          <div className="product-name">
            {firstItem?.productId?.name}
            {orderItem.items.length > 1 &&
              ` 외 ${orderItem.items.length - 1}개`}
          </div>

          <div className="price">₩ {currencyFormat(orderItem.totalPrice)}</div>
        </Col>

        <Col md={2} className="status-area d-none d-md-flex">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
