/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import "./App.css";
import { Uploader } from 'rsuite';
import 'rsuite/Uploader/styles/index.css';
import { useEffect, useState } from "react";


function Upload() {

    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    useEffect(( ) => {
        console.log(isLoading);
        setDisabled(isLoading);
    }, [isLoading]);
    const navigate = useNavigate();
    const handleUpload = async (files: any) => {
        const file = files.blobFile;
        const formData = new FormData();
        setIsLoading(true);
        console.log('file ', file.name, file.type, );
        formData.append('name', file.name)
        formData.append('type', file.type)
        formData.append('fileData', file); // 'file_upload' should match the FastAPI parameter name
        console.log('formData ', formData);
        
        try {
          const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            body: formData,
          });
          if (response.ok) {
            const jsonBody = await response.json();
            console.log('File uploaded successfully!', jsonBody);
            localStorage.setItem('file', JSON.stringify({ name: file.name, type: file.type, data: URL.createObjectURL(file)}))
            localStorage.setItem('response', JSON.stringify({status: response.status, body: jsonBody,}))
            handleUploadSuccess()
          } else {
            console.error('File upload failed.');
          }
        } catch (error: any) {
          console.error(`Error during file upload:, ${error.stack}`);
        } finally {
            setIsLoading(false);
        }
    };


  const handleUploadSuccess = () => {
    navigate('/Predict');
  }
  
  return (
    <>
    <div className="w-full">
        <button
            role="button"
            className="button-34 back btn btn-success pull-right absolute btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => { window.location.href = "/"; }}>
            Back
        </button>
        <div className="card">
            <h1>Upload a food image to start classify it</h1> 
            <Uploader disabled={disabled} action="" draggable method="GET" autoUpload={false}  listType="picture-text"  onChange={(files) => { if (files && files.length > 0) { handleUpload(files[0] as File);}}}>
            <div
                style={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
                }}
            >
                <span>Click or Drag files to this area to upload</span>
            </div>
            </Uploader>
        </div>
    </div>
    </>
  );
}

export default Upload;
