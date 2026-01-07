#!/usr/bin/env bash

# Sample commands for building the project

docker build -t ng-digipay-wallet --build-arg configuration=production .

# Running the image and exposing the port
# docker run -d --name digipay_wallet -p 4080:80 ng-digipay-wallet:latest

# Removing the container
# docker container rm --force my_express
