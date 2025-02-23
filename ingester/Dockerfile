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
cron \
&& rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else
COPY . .

ENV PYTHONPATH=/usr/app

# Copy the cron job file
COPY ingester-cron /etc/cron.d/ingester-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/ingester-cron

# Apply cron job
RUN crontab /etc/cron.d/ingester-cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Start the cron service and run the DataIngester script initially
CMD ["sh", "-c", "python src/DataIngester.py && cron && tail -f /var/log/cron.log"]

# # command to run the script once and keep the container running
# CMD ["sh", "-c", "python src/DataIngester.py && tail -f /dev/null"]



