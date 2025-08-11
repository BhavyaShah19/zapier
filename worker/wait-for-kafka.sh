echo "Waiting for Kafka to be ready..."
until nc -z kafka 9092; do
  sleep 2
done
echo "Kafka is up — starting app"

node dist/index.js