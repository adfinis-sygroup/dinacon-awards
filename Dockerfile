FROM danlynn/ember-cli:latest as build

COPY package.json yarn.lock /myapp/

RUN yarn install

COPY . /myapp/

RUN yarn ember deploy production

FROM nginx:alpine

COPY --from=build /myapp/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
