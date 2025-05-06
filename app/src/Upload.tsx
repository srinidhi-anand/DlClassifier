/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import "./App.css";
import { Uploader } from "rsuite";
import "rsuite/Uploader/styles/index.css";
import { useEffect, useState } from "react";
import React from "react";
import Modal from "./Modal";

function Upload() {
  const [uploaderCursor, setUploaderCursor] = useState("cursor-pointer");
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    setDisabled(isLoading);
    if (isLoading) {
      setUploaderCursor("cursor-progress");
    } else {
      setUploaderCursor("cursor-pointer");
    }
  }, [isLoading]);

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const navigate = useNavigate();
  const handleUpload = async (files: any) => {
    const file = files.blobFile;
    const formData = new FormData();
    setIsLoading(true);
    if (
      !file.name.endsWith(".jpeg") &&
      !file.name.endsWith(".jpg") &&
      !file.name.endsWith(".png")
    ) {
      handleOpen();
      setErr(`image file prediction failure due to invalid file type. Please upload of valid image types jpg, png, jpeg !`);
      console.log("File upload failed.");
    }
    formData.append("name", file.name);
    formData.append("type", file.type);
    formData.append("fileData", file);

    try {
      const response: Response = await fetch(
        "https://tf-keras-model.onrender.com/predict",
        {
          method: "POST",
          body: formData
        }
      );
      if (response && response.ok) {
        const jsonBody = await response?.json();
        localStorage.setItem(
          "file",
          JSON.stringify({
            name: file.name,
            type: file.type,
            data: URL.createObjectURL(file)
          })
        );
        localStorage.setItem(
          "response",
          JSON.stringify({ status: response.status, body: jsonBody })
        );
        handleUploadSuccess();
      } else {
        handleOpen();
        setErr(`image file prediction failure ${response.status}`);
        console.log("File upload failed.");
      }
    } catch (error: any) {
      handleOpen();
      setErr(`image file prediction failure ${error.status} ${error.message}`);
      console.log(`Error during file upload:, ${error.stack}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    navigate("/Predict");
  };

  return (
    <>
      {open && err ? (
        <Modal isOpen={open} onClose={handleClose}>
          <>
            <h1 style={{ fontSize: "2.2em" }}>Prediction Failed</h1>
            <h3 style={{ fontSize: "15px" }}>
              Api failed due to {new Error(err).message}. Hence return to home
              screen!
            </h3>
          </>
        </Modal>
      ) : (
        <></>
      )}
      <div className="w-full">
        <button
          role="button"
          className={`button-34 upload back btn btn-success pull-right absolute btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full`}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back
        </button>
        <div className="card">
          <h1>Upload a food image to start classifying it</h1>
          <Uploader
            removable={false}
            className={uploaderCursor}
            disabled={disabled}
            action=""
            accept="image/png, image/jpeg, image/jpg"
            draggable
            method="GET"
            autoUpload={false}
            listType="picture-text"
            onChange={(files) => {
              if (files && files.length > 0) {
                handleUpload(files[0] as File);
              }
            }}
          >
            <div
              style={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span>Click or Drag a image file to upload</span>
            </div>
          </Uploader>
        </div>
      </div>
    </>
  );
}

export default Upload;
