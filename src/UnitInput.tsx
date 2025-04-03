import { useState } from "react";
import minusIcon from "/minus.svg";
import plusIcon from "/plus.svg";

const UnitInput = () => {
  const [value, setValue] = useState("0");
  const [lastValidValue, setLastValidValue] = useState("0");
  const [unit, setUnit] = useState("%");
  const options = ["%", "px"];

  const extractNumber = (str: string) => {
    str = str.replace(",", ".");

    const invalidCharIndex = str.search(/[^0-9.]/);

    if (invalidCharIndex !== -1) {
      str = str.substring(0, invalidCharIndex);
    }

    const parts = str.split(".");

    if (parts.length > 2) {
      str = parts[0] + "." + parts.slice(1).join("");
    }

    return str === "" || isNaN(Number(str)) ? undefined : parseFloat(str);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numValue = extractNumber(inputValue);

    if (numValue) {
      setValue(inputValue);
      setLastValidValue(inputValue);
    } else {
      setValue(inputValue);
    }
  };

  const handleBlur = () => {
    const numValue = extractNumber(value);

    if (numValue === undefined) {
      setValue(lastValidValue);
      return;
    }

    let adjustedValue = numValue;

    if (adjustedValue < 0) {
      adjustedValue = 0;
    }
    if (unit === "%" && adjustedValue > 100) {
      adjustedValue = 100;
    }

    const finalValue = adjustedValue.toString();
    setValue(finalValue);
    setLastValidValue(finalValue);
  };

  const handleIncrement = () => {
    const numValue = extractNumber(value) ?? 0;
    let newValue = numValue + 0.1;

    if (unit === "%" && newValue > 100) {
      newValue = 100;
    }

    setValue(newValue.toFixed(1));
    setLastValidValue(newValue.toFixed(1));
  };

  const handleDecrement = () => {
    const numValue = extractNumber(value) ?? 0;
    let newValue = numValue - 0.1;

    if (newValue < 0) {
      newValue = 0;
    }

    setValue(newValue.toFixed(1));
    setLastValidValue(newValue.toFixed(1));
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);

    const numValue = extractNumber(value) ?? 0;

    if (newUnit === "%" && numValue > 100) {
      setValue("100");
      setLastValidValue("100");
    }
  };

  const numValue = extractNumber(value) ?? 0;
  const isDecrementDisabled = numValue <= 0;
  const isIncrementDisabled = unit === "%" && numValue >= 100;

  return (
    <div className="bg-[#151515] p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs min-w-[100px] text-[#AAAAAA]">Unit</span>

        <div className="relative flex items-center gap-[2px] bg-[#212121] p-[2px] rounded-lg w-[140px] overflow-hidden">
          <div
            className={`absolute top-[2px] left-[2px] w-[66px] h-8 bg-[#424242] rounded-md transition-transform duration-300 ease-out ${
              unit === "px" ? "transform translate-x-[70px]" : ""
            }`}
          ></div>
          {options.map((item) => (
            <button
              key={item}
              onClick={() => handleUnitChange(item)}
              className={`relative z-10 px-4 py-2 flex-1 rounded-md text-xs transition ${
                unit === item
                  ? "text-[#F9F9F9]"
                  : "text-[#AAAAAA] cursor-pointer"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs min-w-[100px] text-[#AAAAAA]">Value</span>

        <div className="flex items-center bg-[#212121] h-9 transition rounded-lg w-[140px]">
          <button
            onClick={handleDecrement}
            title={"Value must be greater than 0"}
            disabled={isDecrementDisabled}
            className={`min-w-9 p-2 h-full rounded-lg ${
              isDecrementDisabled ? "cursor-not-allowed" : "hover:bg-[#3B3B3B]"
            } transition cursor-pointer group relative`}
          >
            <img
              src={minusIcon}
              alt=""
              className={`size-3 m-auto ${
                isDecrementDisabled ? "opacity-50" : ""
              } `}
            />

            {isDecrementDisabled && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-[#212121] text-[#F9F9F9] text-xs rounded py-1 px-2 whitespace-nowrap">
                Value must be greater than 0
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1C2526]"></span>
              </span>
            )}
          </button>

          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full text-xs p-2 text-center text-[#F9F9F9] focus:outline-none"
          />

          <button
            onClick={handleIncrement}
            disabled={isIncrementDisabled}
            className={`p-2 min-w-9 h-full rounded-lg ${
              isIncrementDisabled ? "cursor-not-allowed" : "hover:bg-[#3B3B3B]"
            } transition cursor-pointer group relative`}
          >
            <img
              src={plusIcon}
              alt=""
              className={`size-3 m-auto ${
                isIncrementDisabled ? "opacity-50" : ""
              } `}
            />

            {isIncrementDisabled && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-[#212121] text-[#F9F9F9] text-xs rounded py-1 px-2 whitespace-nowrap">
                Value must smaller than 100
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1C2526]"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitInput;
