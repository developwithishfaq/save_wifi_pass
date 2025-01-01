#!/bin/bash
# wait-for-rabbitmq.sh
HOST=$1
PORT=$2
until nc -z -v -w30 $HOST $PORT; do
  echo "Waiting for RabbitMQ at $HOST:$PORT..."
  sleep 1
done
echo "RabbitMQ is ready!"
