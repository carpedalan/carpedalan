#!/bin/bash
mkcert  --cert-file ./nginx/local.carpedalan.com.pem --key-file ./nginx/local.carpedalan.com-key.pem local.carpedalan.com "*.local.carpedalan.com" localhost
aws s3 cp "s3://carpedev-pipeline/.env-local" ./.env-local --profile carpedev
aws s3 cp "s3://carpedev-pipeline/server/cfkeys" ./server/cfkeys/ --recursive --profile carpedev
aws s3 cp "s3://carpedev-pipeline/goodDataWithEtagAndKey.json" . --profile carpedev

