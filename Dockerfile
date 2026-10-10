FROM node:24-alpine AS frontend
WORKDIR /src/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM golang:1.27-alpine AS backend
WORKDIR /src/backend
COPY backend/ ./
RUN go test ./... && CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/dola2api ./cmd/dola2api

FROM alpine:3.23
RUN apk add --no-cache ca-certificates tzdata \
    && addgroup -S -g 10001 dola2api \
    && adduser -S -D -H -u 10001 -G dola2api dola2api \
    && mkdir -p /app/data \
    && chown 10001:10001 /app/data
WORKDIR /app
COPY --from=backend /out/dola2api /app/dola2api
COPY --from=frontend /src/frontend/dist /app/frontend/dist
ENV DOLA2API_ADDR=0.0.0.0:8080 \
    DOLA2API_DATA=/app/data \
    DOLA2API_STATIC=/app/frontend/dist
USER 10001:10001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
ENTRYPOINT ["/app/dola2api"]
