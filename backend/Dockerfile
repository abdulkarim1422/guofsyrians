FROM python:latest

WORKDIR /app/backend

COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY . .

CMD ["unicorn", "main:app", "--host", "0.0.0.0", "--port", "2011"]