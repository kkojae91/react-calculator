import React from "react";
import { SCREEN } from "../constant";

export default function TotalScreen({
  firstNumber,
  secondNumber,
  convertToLocaleString,
}) {
  const resultNumber = secondNumber || firstNumber;
  const fontSize =
    String(resultNumber).length > SCREEN.FONT_SIZE_SCALE_STANDARD
      ? "3rem"
      : "4rem";

  return (
    <>
      <h1 className="total" style={{ fontSize: `${fontSize}` }}>
        {convertToLocaleString(resultNumber)}
      </h1>
    </>
  );
}
