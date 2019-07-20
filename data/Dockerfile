FROM mongo:4.0
COPY ./mock/mongo /docker-entrypoint-initdb.d
ENV MONGO_INITDB_ROOT_USERNAME root
ENV MONGO_INITDB_ROOT_PASSWORD example
ENV MONGO_INITDB_DATABASE social