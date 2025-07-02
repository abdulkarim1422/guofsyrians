FROM python:latest

WORKDIR /app/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8222

# Create a startup script that runs admin creation and then starts the server
CMD ["sh", "-c", "python ./create_admin.py && uvicorn app.main:app --host 0.0.0.0 --port 8222"]