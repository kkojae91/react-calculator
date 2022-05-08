import React, { useEffect, useState } from "react";

import "./App.css";

import CalculateButtons from "./Components/CalculateButtons";

import { convertToLocaleString } from "./utils";
import {
  SCREEN,
  EXPONENTIAL_LIMIT_POINT,
  BUTTON_TYPES,
  LOCAL_STORAGE,
} from "./constant";
import TotalScreen from "./Components/TotalScreen";

export default function App() {
  const [calculateInfo, setCalculateInfo] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE.CALCULATE_KEY)) ?? {
      firstNumber: 0,
      operation: "",
      secondNumber: "",
    }
  );

  useEffect(() => {
    window.addEventListener("beforeunload", confirmLeaveSite);

    return () => window.removeEventListener("beforeunload", confirmLeaveSite);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE.CALCULATE_KEY,
      JSON.stringify(calculateInfo)
    );
  }, [calculateInfo]);

  const confirmLeaveSite = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };

  const handleDigitButton = ({ target }) => {
    if (
      String(calculateInfo.firstNumber).length >= SCREEN.MAX_TEXT_LENGTH &&
      calculateInfo.operation === ""
    ) {
      return;
    }

    if (String(calculateInfo.secondNumber).length >= SCREEN.MAX_TEXT_LENGTH) {
      return;
    }

    if (calculateInfo.operation) {
      const prevNumber = calculateInfo.secondNumber;

      setCalculateInfo((prevCalculateInfo) => ({
        ...prevCalculateInfo,
        secondNumber: Number(prevNumber + target.textContent),
      }));

      return;
    }

    const prevNumber = calculateInfo.firstNumber;

    setCalculateInfo((prevCalculateInfo) => ({
      ...prevCalculateInfo,
      firstNumber: isNaN(prevNumber)
        ? target.textContent
        : Number(prevNumber + target.textContent),
    }));
  };

  const convertToResultNumber = (number) => {
    if (
      String(number).length > SCREEN.MAX_TEXT_LENGTH &&
      Number.isFinite(number)
    ) {
      return number.toExponential(EXPONENTIAL_LIMIT_POINT);
    }

    if (Number.isFinite(number)) {
      return number;
    }

    return SCREEN.ERROR_MESSAGE;
  };

  const calculateResultNumber = () => {
    const firstNumber = Number(calculateInfo.firstNumber);
    const secondNumber = Number(calculateInfo.secondNumber);
    let resultNumber = 0;

    switch (calculateInfo.operation) {
      case "X":
        resultNumber = firstNumber * secondNumber;
        break;
      case "/":
        resultNumber = firstNumber / secondNumber;
        break;
      case "+":
        resultNumber = firstNumber + secondNumber;
        break;
      case "-":
        resultNumber = firstNumber - secondNumber;
        break;
      default:
        break;
    }

    return resultNumber ?? firstNumber;
  };

  const canCalculate = () => calculateInfo.secondNumber !== "";

  const handleOperationButton = ({ target }) => {
    if (canCalculate(target)) {
      const resultNumber = calculateResultNumber();

      setCalculateInfo(() => ({
        firstNumber: convertToResultNumber(resultNumber),
        operation: target.textContent,
        secondNumber: "",
      }));

      return;
    }

    setCalculateInfo((prevCalculateInfo) => ({
      ...prevCalculateInfo,
      operation: target.textContent,
    }));
  };

  const handleAllClear = () => {
    setCalculateInfo(() => ({
      firstNumber: 0,
      operation: "",
      secondNumber: "",
    }));
  };

  const isFocused = (operation) => {
    if (operation === "=") return;

    return calculateInfo.operation === operation;
  };

  return (
    <div className="calculator">
      <TotalScreen
        firstNumber={calculateInfo.firstNumber}
        secondNumber={calculateInfo.secondNumber}
        convertToLocaleString={convertToLocaleString}
      />
      <CalculateButtons
        onClick={handleDigitButton}
        parentClassName="digits flex"
        childClassName="digit"
        buttons={BUTTON_TYPES.DIGIT_NUMBERS}
      />
      <CalculateButtons
        onClick={handleOperationButton}
        parentClassName="operations subgrid"
        childClassName="operation"
        buttons={BUTTON_TYPES.OPERATIONS}
        isFocused={isFocused}
      />
      <CalculateButtons
        onClick={handleAllClear}
        parentClassName="modifiers subgrid"
        childClassName="modifier"
        buttons={BUTTON_TYPES.AllClear}
      />
    </div>
  );
}
