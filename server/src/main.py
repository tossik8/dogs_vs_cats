from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import tensorflow as tf

model = tf.keras.models.load_model('../model.keras')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
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
