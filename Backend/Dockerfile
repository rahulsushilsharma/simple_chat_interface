FROM python:3.12-slim AS builder

WORKDIR /app

COPY uv.lock pyproject.toml /app/

RUN pip install uv --no-deps
RUN uv sync --frozen

COPY . .

EXPOSE 8000

CMD ["uv","run" ,"uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]



