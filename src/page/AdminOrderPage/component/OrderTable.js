import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({ header, data = [], openEditForm }) => {
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id} onClick={() => openEditForm(item)}>
                <td>{index + 1}</td>

                <td>{item.orderNum}</td>

                <td>{item.createdAt ? item.createdAt.slice(0, 10) : ""}</td>

                <td>{item.userId?.email || "Unknown User"}</td>

                <td>
                  {item.items?.length > 0 ? (
                    <>
                      {item.items[0]?.productId?.name || "삭제된 상품"}
                      {item.items.length > 1 &&
                        ` 외 ${item.items.length - 1}개`}
                    </>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  {item.shipTo
                    ? `${item.shipTo.address} ${item.shipTo.city}`
                    : "-"}
                </td>

                <td>
                  {item.discount > 0 ? (
                    <>
                      <div
                        style={{
                          textDecoration: "line-through",
                          color: "#888",
                        }}
                      >
                        ₩ {currencyFormat(item.totalPrice)}
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        ₩ {currencyFormat(item.finalPrice)}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontWeight: "600" }}>
                      ₩ {currencyFormat(item.totalPrice || 0)}
                    </div>
                  )}
                </td>

                <td>
                  <Badge bg={badgeBg[item.status] || "secondary"}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} className="text-center">
                No Data to show
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
