import React, { useState, useEffect } from "react";
function TotalResult({ filteredData, planTable, callPack }) {
  const [active, setActive] = useState(false);
  const [total, setTotal] = useState("");

  useEffect(() => {
    const checkCallPack = () => {
      const callPackArea = document.querySelector(".callPackArea");
      if (callPackArea) {
        callPackArea.innerHTML = "";
        if (callPack.length !== 0) {
          //通話定額の質問に回答
          setTotal(Number(filteredData[0].price) + Number(callPack.price));
          const dt = document.createElement("dt");
          const dd = document.createElement("dd");
          dd.innerHTML = callPack.price + "円";
          switch (callPack.minutes) {
            case "5":
              dt.innerHTML = "通話定額5分：";
              break;
            case "10":
              dt.innerHTML = "通話定額10分：";
              break;
            case "unlimited":
              dt.innerHTML = "かけ放題＋：";
              break;
            default:
              dt.innerHTML = "";
              break;
          }
          callPackArea.append(dt);
          callPackArea.append(dd);
        } else {
          //通話定額の質問に回答してない
          callPackArea.innerHTML = "";
          setTotal(filteredData[0].price);
        }
      }
    };
    checkCallPack();
  }, [callPack, filteredData]);
  function isOpen() {
    setActive(!active);
  }
  if (!filteredData || filteredData.length === 0) {
    return (
      <section id="TotalResult">
        <h2>診断結果</h2>
        <div className="flex table">
          <div>データ容量 - GB</div>
          <div>月額 - 円</div>
        </div>
      </section>
    );
  }
  return (
    <section id="TotalResult">
      <h2>診断結果</h2>
      {filteredData.map((item) => (
        <div key={item.id}>
          <div className="flex">
            <div>
              データ容量<span className="fontSize">{item.giga}</span>GB
            </div>
            <div>
              月額<span className="fontSize">{total}</span>円
            </div>
            <div className="accordionItem">
              <button className="accordionBtn" onClick={isOpen}>
                内訳
              </button>
            </div>
          </div>
          <dl className={active ? "open accordionContent" : "accordionContent"}>
            <div className="flex">
              <dt className="fontSize">{planTable}</dt>
              <dd>
                <span className="fontSize">{item.price}</span>円
              </dd>
            </div>
            <div className="callPackArea flex"></div>
          </dl>
        </div>
      ))}
    </section>
  );
}
export default TotalResult;
