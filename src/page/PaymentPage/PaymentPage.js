import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";
import { getCartList } from "../../features/cart/cartSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const navigate = useNavigate();

  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });

  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cartList.length === 0 && !firstLoading) {
      navigate("/cart");
    }
  }, [cartList, firstLoading, navigate]);

  useEffect(() => {
    setFirstLoading(false);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 오더 생성하기
    if (cartList.length === 0) {
      navigate("/cart");
      return;
    }

    if (!validateCoupon(couponCode)) {
      return;
    }

    const { firstName, lastName, contact, address, city, zip } = shipInfo;

    if (!firstName || !lastName || !contact || !address || !city || !zip) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }

    if (!cardValue.number || !cardValue.expiry || !cardValue.cvc) {
      alert("결제 정보를 입력해주세요.");
      return;
    }

    try {
      dispatch(
        createOrder({
          totalPrice,
          couponCode,
          shipTo: { firstName, lastName, contact, address, city, zip },
          contact: { firstName, lastName, contact },
          orderList: cartList.map((item) => {
            return {
              productId: item.productId._id,
              price: item.productId.price,
              qty: item.qty,
              size: item.size,
            };
          }),
          paymentInfo: cardValue,
        })
      ).unwrap();
      navigate("/payment/success");
    } catch (error) {
      console.error("주문 실패:", error);
    }
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const { name, value } = event.target;
    setShipInfo({
      ...shipInfo,
      [name]: value,
    });
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "expiry") {
      updatedValue = cc_expires_format(value);
    }

    setCardValue({
      ...cardValue,
      [name]: updatedValue,
    });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  const validateCoupon = (code) => {
    if (!code) {
      setCouponError("");
      return true;
    }

    if (code === "WELCOME10" || code === "THANKYOU") {
      setCouponError("");
      return true;
    }

    setCouponError("유효하지 않은 쿠폰입니다.");
    return false;
  };

  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zip"
                    />
                  </Form.Group>

                  <Form.Group className="mt-4">
                    <Form.Label>쿠폰 코드</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="쿠폰 코드를 입력하세요"
                      value={couponCode}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        setCouponCode(value);
                        validateCoupon(value);
                      }}
                      isInvalid={!!couponError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {couponError}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      사용 가능한 쿠폰 코드: <strong>THANKYOU</strong>
                    </Form.Text>
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  <OrderReceipt
                    totalPrice={totalPrice}
                    cartList={cartList}
                    couponCode={couponCode}
                  />
                </div>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                  <PaymentForm
                    cardValue={cardValue}
                    handlePaymentInfoChange={handlePaymentInfoChange}
                    handleInputFocus={handleInputFocus}
                  />
                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                  disabled={!!couponError}
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt
            totalPrice={totalPrice}
            cartList={cartList}
            couponCode={couponCode}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
