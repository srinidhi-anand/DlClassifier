import React from "react";
import "./App.css";
import "tailwindcss";

function Predict() {
    const fileResponse = localStorage.getItem('file');
    const { data: objectUrl = null, name = 'untitled image', type = '' } = fileResponse ? JSON.parse(fileResponse) : {};
    const response = localStorage.getItem('response');
    const { status = null, body = null } = response ? JSON.parse(response) : {};

    return (
        <>
            {   fileResponse !== null && fileResponse ? 
                    <>
                    <button
                        role="button"
                        className="predict button-34 back btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => { localStorage.removeItem('file'); localStorage.removeItem('response'); window.location.href = "/" }}
                    > Home </button>
                    <div className="card">
                        <h1 id={type} className="h1title">Results are ready </h1>
                        <h2><p> image {name} prediction status : {status == 200 ? 'Success' : 'Failed'} </p></h2>
                        <div className="card"> 
                            <h3><b><p> {body.label.toUpperCase().replace('_',' ')} {body.prediction} </p> </b> </h3>
                        </div>
                        <img src={objectUrl} className="resultimg"/>  
                    </div>
                    </> :
                    <> Results are cleared or not available, please start proceeding from the <a href="/">Home screen </a> </>}
        </>
    );
}

export default Predict;
