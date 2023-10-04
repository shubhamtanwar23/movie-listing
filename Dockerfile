FROM node:18 as base

ENV APP=/home/app

WORKDIR $APP

COPY package.json package-lock.json tsconfig.json $APP/

EXPOSE 9000


FROM base as development

RUN npm install

COPY . $APP

RUN npm run build

CMD ["npm", "run", "dev"]
