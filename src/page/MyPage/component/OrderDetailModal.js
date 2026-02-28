import React from "react";
import { Modal, Table, Badge } from "react-bootstrap";
import { currencyFormat } from "../../../utils/number";
import { badgeBg } from "../../../constants/order.constants";

const OrderDetailModal = ({ open, handleClose, order }) => {
  if (!order) return null;

  return (
    <Modal show={open} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>주문 상세 내역</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>주문번호: {order.orderNum}</p>
        <p>주문일: {order.createdAt?.slice(0, 10)}</p>
        <p>
          상태: <Badge bg={badgeBg[order.status]}>{order.status}</Badge>
        </p>

        <hr />

        <h6>주문 상품</h6>

        <Table>
          <thead>
            <tr>
              <th>상품명</th>
              <th>가격</th>
              <th>수량</th>
              <th>합계</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.productId?.name || "삭제된 상품"}
                  {item.size && (
                    <span
                      style={{
                        marginLeft: "6px",
                        color: "#777",
                        fontSize: "13px",
                      }}
                    >
                      ({item.size.toUpperCase()})
                    </span>
                  )}
                </td>
                <td>₩ {currencyFormat(item.price)}</td>
                <td>{item.qty}</td>
                <td>₩ {currencyFormat(item.price * item.qty)}</td>
              </tr>
            ))}

            <tr>
              <td colSpan={3}>상품 금액</td>
              <td>₩ {currencyFormat(order.totalPrice)}</td>
            </tr>

            {order.discount > 0 && (
              <>
                <tr>
                  <td colSpan={3} style={{ color: "green" }}>
                    쿠폰 할인 ({order.couponCode})
                  </td>
                  <td style={{ color: "green" }}>
                    - ₩ {currencyFormat(order.discount)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={3} style={{ fontWeight: "600" }}>
                    최종 결제 금액
                  </td>
                  <td style={{ fontWeight: "600" }}>
                    ₩ {currencyFormat(order.finalPrice)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailModal;
