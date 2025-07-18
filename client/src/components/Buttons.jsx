import React from "react";

function Buttons({ button, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200">
      {button}
    </button>
  );
}

export default Buttons;
