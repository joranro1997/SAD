# our base image
FROM alpine

# Install python and pip
RUN apk add --update py3-pip

# upgrade pip
RUN pip install --upgrade pip

# Install the mqtt library
RUN pip install paho-mqtt

# Copy the script to the base directory
COPY sisub.py /

# run the application
CMD ["python3", "sisub.py"]
