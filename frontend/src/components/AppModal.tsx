"use client";
import React from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "./ui/Button";
import { Loader } from "./ui/Loader";

interface IProps {
  closeModal?: () => void;
  handleSubmit?: () => void;
  children: React.ReactNode;
  modalWidth?: string;
  actionButtonText?: string;
  isLoading?: boolean;
  isFooter?: boolean;
  title?: string;
}

export const AppModal = ({
  closeModal,
  children,
  modalWidth,
  handleSubmit,
  actionButtonText,
  isLoading,
  isFooter = true,
  title = ""
}: IProps) => {
  return (
    <>
      {createPortal(
        <div
          className="modal-container"
          // onClick={(e: any) => {
          //   if (e.target.className === "modal-container")
          //     closeModal && closeModal();
          // }}
        >
          <div
            className={`rounded-[5px] relative bg-white md:px-4 px-2 py-4  shadow-lg border dark:bg-darkMain dark:text-white ${modalWidth}`}
          > 

            <div className="flex  justify-between mb-4">
              <div className="text-lg text-black font-semibold">{title}</div>

              <span
                className=" cursor-pointer "
                onClick={() => {
                  closeModal && closeModal();
                }}
              >
                <AiOutlineClose
                  className="text-gray-500 hover:text-black"
                  size="1.5em"
                />
              </span>
            </div>

            <div className="mb-7 w-full">{children}</div>
            {isFooter && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={closeModal}
                  variant="danger"
                  outlined
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader height="h-6" width="w-10" />
                  ) : (
                    actionButtonText
                  )}
                </Button>
                
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
