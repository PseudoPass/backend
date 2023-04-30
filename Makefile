frontend-build:
	docker build -t pseudopass-frontend ../web

backend-build:
	docker build -t pseudopass-backend .

compose-up: frontend-build backend-build
	docker-compose -p pseudopass up -d

database-up:
	docker-compose -p pseudopass up redis postgres -d

make reset-db:
	npm run force-syncdb

rm-postgres:
	rm -rf ./postgres

