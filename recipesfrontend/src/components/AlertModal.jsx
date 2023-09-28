import React from "react";

const AlertModal = () => {
  return (
    <dialog id="alertmodal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Insuficient ingredients</h3>
        <p className="py-4">Please, select more than two ingredient to generate the recipe.</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AlertModal;
