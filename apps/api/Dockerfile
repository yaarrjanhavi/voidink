FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY voidink_api ./voidink_api
COPY ../../ml /app/ml
COPY ../../models /app/models

ENV PYTHONPATH=/app/ml:/app
ENV MODEL_MODE=auto

EXPOSE 8000

CMD ["uvicorn", "voidink_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
