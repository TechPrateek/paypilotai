.PHONY: help install db-push db-seed run-ml run-web dev build test

help:
	@echo "PayPilot AI — Developer Commands"
	@echo "  make install   Install Node.js and Python dependencies"
	@echo "  make db-push   Synchronize Prisma schema with database"
	@echo "  make db-seed   Seed sample transactions and benchmark models"
	@echo "  make run-ml    Start the FastAPI ML service on port 8000"
	@echo "  make run-web   Start Next.js web application on port 3000"
	@echo "  make build     Run TypeScript checks and Next.js production build"

install:
	npm install
	cd ml-service && pip install -r requirements.txt

db-push:
	npx prisma db push

db-seed:
	npx tsx prisma/seed.ts

run-ml:
	python -m uvicorn app.main:app --app-dir ml-service --host 127.0.0.1 --port 8000 --reload

run-web:
	npm run dev

build:
	npx tsc --noEmit
	npm run build
