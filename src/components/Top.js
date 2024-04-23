import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper/core";
import { Navigation } from "swiper/modules";
import questions from "../objects/questions";
import plans from "../objects/plans";
import planMapping from "../objects/planMapping";
import TotalResult from "./TotalResult";
import "swiper/css";
import "swiper/css/navigation";

SwiperCore.use([Navigation]);

function Top() {
  const [currentQindex, setCurrentQindex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [planTable, setPlanTable] = useState([]);
  const [callPack, setCallPack] = useState([]);
  const swiperRef = useRef(null);
  const currentQ = questions[currentQindex];
  //前の設問に戻る
  const goBack = () => {
    swiperRef.current.swiper.slidePrev();
    setCallPack([]);
    // 最後の質問が answers に追加されているかどうかを確認
  const isLastQuestionAnswered = answers.some(answer => answer.questionIndex === 5);
    if (currentQindex > 0) {
      //直前の質問のインデックスを取得
      if (isLastQuestionAnswered) {
        const prevQindex = answers[answers.length - 2].questionIndex;
        setCurrentQindex(prevQindex);
        //直前の回答を削除
        setAnswers(answers.slice(0, -1));
      } else {
        const prevQindex = answers[answers.length - 1].questionIndex;
        setCurrentQindex(prevQindex);
        //直前の回答を削除
        setAnswers(answers.slice(0, -1));
      }
    }
  };

  const callPackQindex = 3;
  //回答を配列に格納
  const handleAnswerSelection = (option) => {
    const answer = { questionIndex: currentQindex, answerIndex: option };
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers); //回答を記録
    ////// 通話定額を使うかどうか //////
    if (currentQindex === callPackQindex) {
      // 通話定額を使うかの回答を取得
      const callPackage = updatedAnswers.find(
        (answer) => answer.questionIndex === 3
      );
      let callPack = null;
      // 通話定額を使う場合の処理（3=通話定額なし）
      if (callPackage && callPackage.answerIndex !== 3) {
        // call_pack テーブルからデータを取得
        fetch(`http://localhost:3001/call_pack`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((callData) => {
            console.log("Call package data received from server", callData);
            switch (callPackage.answerIndex) {
              case 0: //通話定額5分
                callPack = callData.find((item) => item.minutes === "5");
                break;
              case 1: //通話定額10分
                callPack = callData.find((item) => item.minutes === "10");
                break;
              case 2: //かけ放題
                callPack = callData.find(
                  (item) => item.minutes === "unlimited"
                );
                break;
              case 3:
                callPack = "";
                break;
              default:
                break;
            }
            setCallPack(callPack);
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation",
              error
            );
          });
      } else {
        // 通話定額を使わない場合の処理
        console.log("No call package selected");
      }
    }
    const nextQindex = currentQ.nextQ //次の質問の配列
      ? questions.findIndex((q) => q.question === currentQ.nextQ[option])
      : null; //次の質問がなければnull

    // 次の質問がない場合、最後の回答を追加
    // スライダーを無効に
    if (nextQindex === null) {
      swiperRef.current.swiper.detachEvents();
      const lastQindex =
        updatedAnswers[updatedAnswers.length - 1].questionIndex;
      const selectedGiga = questions[lastQindex].options[option].replace(
        "ギガ",
        ""
      );
      setAnswers([...answers, answer]);
      // 記録した回答をanswersKeyとして生成、部分一致でplanMappingと照合
      const answerKey = updatedAnswers
        .map(
          (answer) =>
            questions[answer.questionIndex].question +
            "_" +
            questions[answer.questionIndex].options[answer.answerIndex]
        )
        .join("_");
      const partialMatch = Object.keys(planMapping).find((key) =>
        answerKey.includes(key)
      );
      const planIndex = planMapping[partialMatch];
      //一致する場合、DBから取得
      if (typeof planIndex !== "undefined") {
        const planTable = plans[planIndex].table;
        fetch(`http://localhost:3001/plan?planTable=${planTable}`) //planTable＝クエリパラメータ→PlanTableに置き換えられる
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((data) => {
            console.log("Data received from server", data);
            //選択されたギガ数と同じギガのデータを、テーブルから抽出
            const filteredData = data.filter(
              (item) => selectedGiga == item.giga
            );
            setFilteredData(filteredData);
            setPlanTable(plans[planIndex].name);
          })
          .catch((error) => {
            console.error(
              "there was a problem with the fetch operation",
              error
            );
          });
      }
    } else {
      //nullじゃない場合
      swiperRef.current.swiper.slideNext();
      setCurrentQindex(nextQindex);
    }
  };
  return (
    <div>
      <Swiper
        ref={swiperRef}
        navigation={{ prevEl: null, nextEl: null }}
        onSlideChange={(swiper) => {
          setCurrentQindex(swiper.activeIndex);
        }}
      >
        {questions &&
          questions.map((item) => (
            <SwiperSlide>
              <h2>{currentQ.question}</h2>
              {currentQ &&
                currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className="answer"
                    onClick={() => {
                      handleAnswerSelection(index);
                    }}
                  >
                    {option}
                  </div>
                ))}
            </SwiperSlide>
          ))}
      </Swiper>
      <button className="backBtn disabled" onClick={goBack}>
        前の設問に戻る
      </button>
      <TotalResult
        filteredData={filteredData}
        planTable={planTable}
        callPack={callPack}
      />
    </div>
  );
}
export default Top;
