from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)


model = joblib.load("ecg_model.pkl")


labels = {
    0: "Normal Rhythm",
    1: "Supraventricular Abnormality",
    2: "Ventricular Arrhythmia",
    3: "Fusion Beat Detected",
    4: "Unknown Abnormality"
}

@app.route('/predict', methods=['POST'])
def predict():

    data = request.json

    ecg_values = data.get("ecg")

    # Convert to numpy array
    features = np.array(ecg_values).reshape(1, -1)

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    confidence = float(max(probabilities))

    return jsonify({ "prediction": labels[int(prediction)],
        "class": int(prediction),
        "confidence": round(confidence * 100, 2)
    })

if __name__ == '__main__':
    app.run(port=8000, debug=True)
