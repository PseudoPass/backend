FROM node:alpine as base
WORKDIR .
COPY package.json package-lock.json ./
COPY certs/fullchain.pem cert.pem
COPY certs/privkey.pem key.pem
RUN rm -rf node_modules && npm ci --only=production
COPY . .
CMD ["npm", "start"]