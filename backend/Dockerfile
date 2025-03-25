FROM python:latest

WORKDIR /app/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 2011

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "2011"]