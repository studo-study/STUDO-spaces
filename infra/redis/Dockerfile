FROM redis:7-alpine
COPY redis.conf /usr/local/etc/redis/redis.conf
# Password comes from the REDIS_PASSWORD env var (set in Coolify), not the conf file.
CMD ["sh", "-c", "redis-server /usr/local/etc/redis/redis.conf --requirepass \"$REDIS_PASSWORD\""]