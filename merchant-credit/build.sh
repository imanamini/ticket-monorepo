#!/usr/bin/env bash

# Sample commands for building the project
docker build --no-cache -t ng-digipay-merchant-credit --build-arg configuration=production .

# Running the image and exposing the port
# docker run -d --name digipay_merchant_credit -p 4080:80 ng-digipay-merchant-credit:latest

# Removing the container
# docker container rm --force digipay_merchant_credit
