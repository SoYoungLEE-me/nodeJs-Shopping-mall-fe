import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = ({
  totalPrice,
  cartList = [],
  hasStockIssue,
  couponCode, // optional
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  let discount = 0;

  if (couponCode) {
    if (couponCode === "WELCOME10") {
      discount = totalPrice * 0.1;
    } else if (couponCode === "THANKYOU") {
      discount = 5000;
    }
  }

  const finalPrice = totalPrice - discount;

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>

      <ul className="receipt-list">
        {cartList.length > 0 ? (
          cartList.map((item) => (
            <li key={item._id}>
              <div className="display-flex space-between">
                <div>
                  {item.productId?.name} ({item.size?.toUpperCase()}) x{" "}
                  {item.qty}
                </div>
                <div>
                  ₩ {currencyFormat((item.productId?.price || 0) * item.qty)}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>
            <div className="display-flex space-between">
              <div>담긴 상품이 없습니다.</div>
              <div>₩ 0</div>
            </div>
          </li>
        )}
      </ul>

      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(totalPrice || 0)}</strong>
        </div>
      </div>

      {couponCode && discount > 0 && (
        <>
          <div className="display-flex space-between text-success">
            <div>쿠폰 할인</div>
            <div>- ₩ {currencyFormat(discount)}</div>
          </div>

          <div className="display-flex space-between receipt-title">
            <div>
              <strong>최종 결제금액:</strong>
            </div>
            <div>
              <strong>₩ {currencyFormat(finalPrice)}</strong>
            </div>
          </div>
        </>
      )}

      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <>
          {hasStockIssue && (
            <div className="text-danger mb-2">
              ⚠ 재고가 부족한 상품이 있습니다.
            </div>
          )}

          <Button
            variant={hasStockIssue ? "secondary" : "dark"}
            className="payment-button"
            disabled={hasStockIssue}
            onClick={() => navigate("/payment")}
          >
            결제 계속하기
          </Button>
        </>
      )}

      <div>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다.
      </div>
    </div>
  );
};

export default OrderReceipt;
