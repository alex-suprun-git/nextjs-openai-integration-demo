# Step 1: Use an official Node.js image as a base
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Step 4: Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the application for production
RUN yarn build

# Step 7: Set the environment variable to use production mode
ENV NODE_ENV=production

# Step 8: Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# Step 9: Command to start the application
CMD ["yarn", "start"]
