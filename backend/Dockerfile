# Use an official Python runtime as a parent image
FROM python:3.11-slim-buster

# Set the working directory in the container
WORKDIR /app

# Add a non-root user and group
RUN groupadd --gid 1001 appgroup
RUN useradd --uid 1001 --gid appgroup appuser

# Copy requirements first to leverage Docker cache
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code and startup script
COPY . .
COPY startup.sh .

# Set permissions
RUN chown -R appuser:appgroup /app && \
    chown -R appuser:appgroup /usr/local && \
    chown -R appuser:appgroup /tmp && \
    chmod +x startup.sh

# Expose the application port
EXPOSE 8222

# Switch to non-root user
USER appuser

# Command to run the application
CMD ["./startup.sh"]
