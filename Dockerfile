FROM node:18 as base

ENV APP=/home/app

WORKDIR $APP

COPY package.json package-lock.json tsconfig.json $APP/

COPY prisma $APP/prisma/

EXPOSE 9000


FROM base as development

RUN npm install

COPY . $APP

CMD ["npm", "run", "dev"]
