# Variables
APP=app.main:app
PORT=8000
HOST=0.0.0.0

# Run the FastAPI app
run:
	poetry run uvicorn $(APP) --reload --host $(HOST) --port $(PORT)

# Format code
format:
	poetry run black app

# Lint
lint:
	poetry run flake8 app

# Run tests
test:
	poetry run pytest -v
