# PseudoPass Backend
Express.js server
## Running Development Server Instructions
(Note these are tentative instructions until more progress is made)
### Preparing PostgreSQL Local Server
If you do not already have a postgres instance setup on your machine, follow [these](https://hub.docker.com/_/postgres) instructions:
```bash
docker pull postgres
docker run --name pseudopass-postgres -p 5432:5432 -e POSTGRES_PASSWORD=pseudopass-default-password123 -d postgres
docker exec -it pseudopass-postgres bash
su postgres
createdb pseudopass
exit
```
### Preparing Development Server Environment
1. Ensure you have set up a postgres instance on your local machine (recommended using Docker)
2. Copy the `sample.env` as `development.env` using the command `cp ./examples/sample.env ./development.env` 
from the project's root directory
3. Enter your database password and API key in the `development.env` file in the fields listed with `!CHANGEME`.
   - Note: Do NOT change the file contents of `sample.env` with your credentials!
4. Install necessary node.js packages `npm install`
5. Run the InitializeDatabase script to initialize the database models: 
`npm run syncdb` 
   - Note: To reset all database tables and delete their data, run `npm run force-syncdb`
6. Run the development server in watch mode`npm run start-dev`