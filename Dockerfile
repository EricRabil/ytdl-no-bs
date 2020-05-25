FROM node:14

# Create directory
WORKDIR /usr/src/app

# Install deps
COPY package.json .
RUN yarn

# Copy all other source code
ADD . /usr/src/app
RUN yarn build

# Start
CMD [ "yarn", "start" ]
EXPOSE 6208