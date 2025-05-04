
import base64
import os
from typing import Annotated

from schemas import FoodNote

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
import requests
# import tensorflowjs as tfjs
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# import base64
from numpy import expand_dims, squeeze
import json

TF_ENABLE_ONEDNN_OPTS=0
IMG_HEIGHT = 224
IMG_WIDTH = 224

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_img_predict(img_path):
    img = tf.keras.preprocessing.image.load_img(img_path, target_size = (IMG_HEIGHT, IMG_WIDTH))
    img = tf.keras.preprocessing.image.img_to_array(img)
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)

    img = expand_dims(img, axis = 0)
    print("image loaded for prediction!")
    return img

def predict_image(img_path,classifier):
    print("image started for prediction!")
    img = load_img_predict(img_path)
    res = classifier.predict(img)
    print(f"imagepredicted {res}")
    classesList = []
    with open('assets/classes.json', 'r') as file:
        classesList = json.load(file)
    print(f"classesList {classesList}")
    res = sorted (
        list(zip ( 
            classesList
            , squeeze(res)
         )
        )
     , key=lambda x: x[1]   
     , reverse=True
    )
    print(f"res final {res}")
    if (len(res) > 0):
        return res[0]
    return res

# def image_url_to_base64(image_url):
#     """
#     Converts an image URL to a base64 encoded string.

#     Args:
#         image_url: The URL of the image.

#     Returns:
#         A base64 encoded string of the image, or None if an error occurs.
#     """
#     try:
#         response = requests.get(image_url, stream=True)
#         response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
 
#         image = response.content
#         base64_encoded = base64.b64encode(image).decode('utf-8')
#         print(f" image fetched! {base64_encoded}")
#         return base64_encoded
#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching image: {e}")
#         return None
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return None


# @app.post('/predict')
@app.api_route("/predict", methods=["POST", "OPTIONS"])
def main(body: Annotated[FoodNote, Form()]):
    try:
        contents = body.fileData.file.read()
        # Process the file content
        print(f"Uploaded file: {contents} {body.fileData.filename}")
        model = tf.keras.models.load_model('assets/model.h5')
        print('from load saved!')
        # print(model.summary())
        # # tfjs.converters.save_keras_model(model, 'assets/tfjs_model')
        classifier = model # tf.keras.models.load_model('assets/tfjs_model/model.json')
        # img_data = image_url_to_base64(data.base64str)
        img_path = f"assets/{body.name}"
        with open(img_path, "wb") as fh:
            # fh.write(data.base64str.decode('base64'))
            # fh.write(base64.urlsafe_b64decode(contents))
            fh.write(contents)
            fh.close()
        result = predict_image(img_path,classifier)
        print(f"predVal returned {result}")
        label, predVal = result
        predVal = round(predVal*100, 3)
        print(f"result {label} {predVal}")
        if os.path.exists(img_path):
            os.remove(img_path)
        else:
            print(f"The file {img_path} does not exist")
        if predVal >= 50:
            return {'prediction': f"{str(predVal)}%", 'label': label }
        else:
            return {'prediction': f"{str(predVal)}%", 'label': 'unknown' }
    except HTTPException as e:
        raise HTTPException(status_code = e.status_code, detail=f'error occurred {e}')
