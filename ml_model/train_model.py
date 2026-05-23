import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)


train_data = pd.read_csv(
    "mitbih_train.csv",
    header=None
)

test_data = pd.read_csv(
    "mitbih_test.csv",
    header=None
)



X_train = train_data.iloc[:, :-1]
y_train = train_data.iloc[:, -1]

X_test = test_data.iloc[:, :-1]
y_test = test_data.iloc[:, -1]



model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)



print("Training model...\n")

model.fit(X_train, y_train)



predictions = model.predict(X_test)



accuracy = accuracy_score(y_test, predictions)

precision_weighted = precision_score(
    y_test,
    predictions,
    average='weighted'
)

recall_weighted = recall_score(
    y_test,
    predictions,
    average='weighted'
)

f1_weighted = f1_score(
    y_test,
    predictions,
    average='weighted'
)

macro_f1 = f1_score(
    y_test,
    predictions,
    average='macro'
)

cm = confusion_matrix(y_test, predictions)



print("========== MODEL RESULTS ==========\n")

print(f"Training Samples : {len(X_train)}")
print(f"Testing Samples  : {len(X_test)}\n")

print(f"Accuracy               : {accuracy:.4f}")
print(f"Weighted Precision     : {precision_weighted:.4f}")
print(f"Weighted Recall        : {recall_weighted:.4f}")
print(f"Weighted F1 Score      : {f1_weighted:.4f}")
print(f"Macro F1 Score         : {macro_f1:.4f}")

print("\n========== CLASSIFICATION REPORT ==========\n")

print(classification_report(y_test, predictions))

print("\n========== CONFUSION MATRIX ==========\n")

print(cm)

joblib.dump(model, "ecg_model.pkl")

print("\nModel saved as ecg_model.pkl")



plt.figure(figsize=(8,6))

sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    cmap='Blues'
)

plt.title("Confusion Matrix")

plt.xlabel("Predicted Label")
plt.ylabel("True Label")

plt.tight_layout()

plt.savefig(
    "confusion_matrix.png",
    dpi=300
)

plt.show()
