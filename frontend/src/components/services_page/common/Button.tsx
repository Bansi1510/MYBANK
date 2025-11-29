import React from "react";

interface Props {
  text: string;
  onClick: () => void;
}

const Button: React.FC<Props> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 mt-10 py-3 rounded-xl transition-all"
    >
      {text}
    </button>
  );
};

export default Button;
