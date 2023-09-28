import React from "react";

const Modal = ({ ingredients, title, steps, isLoading }) => {
  return (
    <dialog id="viewrecipe" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {isLoading ? (
          <div className="flex justify-center content-center">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        ) : (
          <>
            <h5 className="font-bold text-lg">Title:</h5>
            <p className="py-2">{title}</p>
            <h5 className="font-bold text-lg">Ingredients: </h5>
            <p className="py-2">{ingredients.join(", ")}</p>
            <h5 className="font-bold text-lg">Steps:</h5>
            <p className="py-2 text-justify">{steps}</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
