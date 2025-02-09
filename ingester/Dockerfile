# Use the latest stable Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /usr/app/

# Install system dependencies first
RUN apt-get update && \
apt-get install -y \
gcc \
python3-dev \
libmariadb-dev \
libmariadb-dev-compat \
&& rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else
COPY . .

ENV PYTHONPATH=/usr/app

# command to run the script once and keep the container running
CMD ["sh", "-c", "python src/DataIngester.py && tail -f /dev/null"]
