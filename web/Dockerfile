FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:3002
ARG NEXT_PUBLIC_WA_LINK=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WA_LINK=$NEXT_PUBLIC_WA_LINK
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
