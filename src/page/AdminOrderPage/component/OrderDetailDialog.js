import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ORDER_STATUS } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { updateOrder } from "../../../features/order/orderSlice";

const OrderDetailDialog = ({ open, handleClose }) => {
  const selectedOrder = useSelector((state) => state.order.selectedOrder);

  const dispatch = useDispatch();

  const [orderStatus, setOrderStatus] = useState(selectedOrder?.status || "");

  useEffect(() => {
    setOrderStatus(selectedOrder?.status || "");
  }, [selectedOrder]);

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };

  const submitStatus = () => {
    dispatch(
      updateOrder({
        id: selectedOrder._id,
        status: orderStatus,
      })
    );
    handleClose();
  };

  if (!selectedOrder || !selectedOrder._id) {
    return null;
  }

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Detail</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>주문번호: {selectedOrder.orderNum}</p>

        <p>
          주문날짜:{" "}
          {selectedOrder.createdAt ? selectedOrder.createdAt.slice(0, 10) : ""}
        </p>

        <p>이메일: {selectedOrder.userId?.email || "Unknown User"}</p>

        <p>
          주소:{" "}
          {selectedOrder.shipTo
            ? `${selectedOrder.shipTo.address} ${selectedOrder.shipTo.city}`
            : "-"}
        </p>

        <p>
          연락처:{" "}
          {selectedOrder.contact
            ? `${selectedOrder.contact.firstName || ""} ${
                selectedOrder.contact.lastName || ""
              } ${selectedOrder.contact.contact || ""}`
            : "-"}
        </p>

        <p>주문내역</p>

        <div className="overflow-x">
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {selectedOrder.items?.length > 0 ? (
                selectedOrder.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>

                    <td>{item.productId?.name || "삭제된 상품"}</td>

                    <td>₩ {currencyFormat(item.price || 0)}</td>

                    <td>{item.qty}</td>

                    <td>₩ {currencyFormat((item.price || 0) * item.qty)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No Items
                  </td>
                </tr>
              )}

              <tr>
                <td colSpan={4}>상품 금액:</td>
                <td>₩ {currencyFormat(selectedOrder.totalPrice || 0)}</td>
              </tr>

              {selectedOrder.discount > 0 && (
                <>
                  <tr>
                    <td colSpan={4} style={{ color: "green" }}>
                      쿠폰 할인 ({selectedOrder.couponCode})
                    </td>
                    <td style={{ color: "green" }}>
                      - ₩ {currencyFormat(selectedOrder.discount)}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={4} style={{ fontWeight: "600" }}>
                      최종 결제 금액:
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      ₩ {currencyFormat(selectedOrder.finalPrice)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        </div>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            submitStatus();
          }}
        >
          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>

            <Form.Select
              value={orderStatus}
              onChange={handleStatusChange}
              disabled={selectedOrder.status === "cancel"}
            >
              {ORDER_STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="order-button-area">
            <Button
              variant="light"
              onClick={handleClose}
              className="order-button"
            >
              닫기
            </Button>

            <Button type="submit" disabled={selectedOrder.status === "cancel"}>
              저장
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
