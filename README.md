# PseudoPass Backend
Express.js server
## Running Development Server Instructions
(Note these are tentative instructions until more progress is made. Reach out to @mruiz42 if you encounter any issues using these instructions)
### Preparing PostgreSQL Local Server
If you already have PostgreSQL installed on your machine, you can skip the following steps and use your postgres 
instance's username and password.

Otherwise, you can create a new postgres instance using these docker commands:

(Based on [these](https://hub.docker.com/_/postgres) instructions)
```bash
docker pull postgres
docker run --name pseudopass-postgres -p 5432:5432 -e POSTGRES_PASSWORD=pseudopass-default-password123 -d postgres
docker exec -it pseudopass-postgres bash
su postgres
createdb pseudopass
exit
exit
```
### Preparing Development Server Environment
1. Ensure you have set up a postgres instance on your local machine (recommended using Docker)
2. Copy the `sample.env` as `development.env` using the helper script: `npm run copy-env`. 
This script will attempt to backup your .env file if it already exists as `development.env.bak` so that you can 
move any values over from the backup file to the new copy if the sample file has any major changes during development.
3. Enter your database password and API key in the `development.env` file in the fields listed with `__CHANGEME__`.
   - Note: Do NOT change the file contents of `sample.env` with your credentials!
4. Install necessary node.js packages `npm install` to obtain the required node_modules.
5. Run the syncDB script to initialize the database models: 
`npm run syncdb` 
   - Note: To RESYNC all pseudopass database tables and DELETE THEIR DATA, run `npm run force-syncdb`. 
   - You should only need to use the force script when the database schema changes and you need to 
   update the relational database schema.
6. Run the development server in watch mode`npm run start-dev`

