
frontend-build:
	docker build -t pseudopass-frontend ../web

backend-build:
	docker build -t pseudopass-backend .

compose-up: frontend-build backend-build
	docker-compose -p pseudopass up
