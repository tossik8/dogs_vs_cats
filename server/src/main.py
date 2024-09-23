import os

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
import cv2
import numpy as np
import tensorflow as tf

base_dir = os.path.dirname(os.path.abspath(__file__))
model = tf.keras.models.load_model(os.path.join(base_dir, '..', 'model.keras'))
allowed_origins = os.getenv('ALLOWED_ORIGINS').split(',')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["POST", "OPTIONS"]
)

@app.post("/images")
async def predict(image: UploadFile) -> float:
    contents = await image.read()
    img_bytes = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (256, 256))
    img = img[np.newaxis, :, :, np.newaxis]
    score = float(model.predict(img, verbose=0)[0][0])
    return score
