#stage 1
FROM registry.mydigipay.info/cicd/generic/node-20.12.2:latest as build-step
# argument
ARG configuration=production
ARG registryUrl
ARG environment
ARG appName=dpx

#copy the file
WORKDIR workspace
# Copy the files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

#install package
RUN npx pnpm install --frozen-lockfile
COPY . .

# Run Versioning script to write current version from ngsw-config.json to environment files
RUN if [ "${appName}" = "dpx" ] || [ "${appName}" = "pillar" ]; then node versioning.js ${appName} ; fi
# RUN node intrack-service-worker.js
RUN npx nx reset
RUN npx nx build ${appName} --configuration=${configuration} --outputPath=dist/apps/app

# - Generates a SHA-1 hash of ngsw.json
# - Injects the hash into index.html as window.__NGSW_HASH__
RUN if [ "${appName}" = "dpx" ]; then node ngsw-hash.js ; fi

#Obfuscate specific chunks (e.g., c2c lib)
RUN if [ "${appName}" = "dpx" ]; then node obfuscate-c2c.js ; fi

# # Conditional Sentry sourcemaps command
RUN if [ "${appName}" = "dpx" ] || [ "${appName}" = "pillar" ]; then configuration=${configuration} ./docker/sentry-sourcemap.sh ${appName} ; fi

FROM ${registryUrl}/frontend/incortex-ui/${environment}:latest as insurance

#stage 2

FROM oci.mydigipay.info/nginx:alpine as publish
COPY --from=build-step /workspace/dist/apps/app/browser /var/www
#Copy nginx configuration files
COPY ./docker/nginx/conf.d /etc/nginx/conf.d

#expose port 80
EXPOSE 80

#run nginx
CMD ["nginx" , "-g", "daemon off;"]
