# Stage 1
FROM oci.mydigipay.info/node:20.12.2-alpine as build-step

# Arugments
ARG configuration=production


WORKDIR workspace
# Copy the files
COPY package.json .
COPY pnpm-lock.yaml .
COPY .npmrc .

# Install packages
RUN npx pnpm install --frozen-lockfile
COPY . .
RUN npx ng build --configuration=${configuration}

# Stage 2
FROM oci.mydigipay.info/alpine:latest
COPY --from=build-step /workspace/dist/ /var/www/
