# Use the latest stable Python runtime as a parent image
FROM python:3.11-slim

# Set the timezone in the container
ENV TZ=America/Toronto
RUN ln -snf /usr/share/zoneinfo/"$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

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


# These next lines set up a cron job
COPY ingester-cron /etc/cron.d/ingester-cron
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/ingester-cron
# Apply cron job
RUN crontab /etc/cron.d/ingester-cron
# Create log file for cron
RUN touch /var/log/cron.log

# Start cron, run script once immediately, and keep container alive
CMD ["sh", "-c", "cron && python src/DataIngester.py && tail -f /var/log/cron.log"]
