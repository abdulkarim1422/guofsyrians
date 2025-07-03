# Use an official Python runtime as a parent image
FROM python:3.11-slim-buster

# Set the working directory in the container
WORKDIR /app


# Copy the application code to the container
COPY . /app
COPY requirements.txt /app

# Create a virtual environment and install dependencies
RUN python -m venv /app/venv \
    && . /app/venv/bin/activate \
    && pip install -r /app/requirements.txt

# RUN pip install -r /app/requirements.txt

# Add a non-root user and group and set permissions
RUN groupadd --gid 1001 appgroup \
    && useradd --uid 1001 --gid appgroup --no-create-home --shell /sbin/nologin appuser

# Ensure the application folder is owned by the non-root user
RUN chown -R 1001:1001 /usr/local 
RUN chown -R 1001:1001 /tmp 
RUN chown -R 1001:1001 /app

# Switch to the non-root user
USER 1001

# Expose the application port
EXPOSE 9443

# Set environment variables
ENV PATH="/app/venv/bin:$PATH"

# Command to run the application
CMD ["uvicorn", "app.src.main:app", "--host", "0.0.0.0", "--port", "8222", "--timeout-keep-alive", "7200", "--no-access-log"]
