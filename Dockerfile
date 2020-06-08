FROM node:12.17.0

EXPOSE 3003
COPY ["./package.json", "./package-lock.json", "./.eslintrc.js", "./.eslintignore", "./.babelrc", "./browserslist", "./.stylelintrc", "/app/"]

WORKDIR /app

RUN npm i --quiet

COPY ./src /app/src

RUN npm run build-client

CMD npm start
