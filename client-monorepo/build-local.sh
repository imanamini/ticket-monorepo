#rm node_modules.zip
#zip -r node_modules.zip node_modules
docker build -t monorepo-client-dpx -f ./Dockerfile-local .
docker rm -f dpx
docker run -d --name dpx -p 80:80 monorepo-client-dpx
