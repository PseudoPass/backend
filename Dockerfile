FROM node:alpine as base
WORKDIR .
COPY package.json package-lock.json ./

RUN rm -rf node_modules && npm ci --only=production
COPY . .
CMD ["npm", "start"]