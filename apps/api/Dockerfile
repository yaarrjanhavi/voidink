FROM python:3.11-slim

WORKDIR /app

COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api/voidink_api ./voidink_api
COPY ml ./ml
COPY models ./models

ENV PYTHONPATH=/app/ml

CMD ["uvicorn", "voidink_api.main:app", "--host", "0.0.0.0", "--port", "10000"]
