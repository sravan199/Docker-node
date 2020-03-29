# note - run  this below command before build producation image
# npm run build 
FROM node:10-alpine
WORKDIR /usr/app
COPY  package*.json ./   
RUN npm install
COPY . .
CMD [ "npm", "run","startproduction"]