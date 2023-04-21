frontend-build:
	docker build -t pseudopass-frontend -f ../web/Dockerfile .

backend-build:
	docker build -t pseudopass-backend .

compose-up: frontend-build backend-build
	docker-compose -p pseudopass up

database-up:
	docker-compose -p pseudopass up redis postgres -d

make reset-db:
	npm run force-syncdb

rm-postgres:
	rm -rf ./postgres

