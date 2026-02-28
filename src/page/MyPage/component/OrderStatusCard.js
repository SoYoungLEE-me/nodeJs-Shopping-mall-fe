import React from "react";
import { Row, Col, Badge, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { cancelOrder } from "../../../features/order/orderSlice";

const OrderStatusCard = ({ orderItem, onClick }) => {
  const dispatch = useDispatch();
  const firstItem = orderItem.items[0];

  const handleCancel = () => {
    if (window.confirm("정말 주문을 취소하시겠습니까?")) {
      dispatch(cancelOrder(orderItem._id));
    }
  };

  return (
    <div
      className="status-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
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

          <div className="price">
            {orderItem.discount > 0 ? (
              <>
                <div style={{ textDecoration: "line-through", color: "#888" }}>
                  ₩ {currencyFormat(orderItem.totalPrice)}
                </div>
                <div style={{ color: "green", fontWeight: "600" }}>
                  ₩ {currencyFormat(orderItem.finalPrice)}
                </div>
              </>
            ) : (
              <>₩ {currencyFormat(orderItem.totalPrice)}</>
            )}
          </div>

          <div className="mobile-status d-md-none">
            <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
          </div>

          {/* 취소 버튼 */}
          {orderItem.status === "preparing" && (
            <Button
              variant="outline-danger"
              size="sm"
              className="cancel-button"
              onClick={handleCancel}
            >
              주문 취소
            </Button>
          )}
        </Col>

        {/* 데스크탑 상태 표시 */}
        <Col md={2} className="status-area d-none d-md-flex">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
