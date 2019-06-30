if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi
mkcert  --cert-file ./nginx/local.carpedalan.com.pem --key-file ./nginx/local.carpedalan.com-key.pem localhost.carpedalan.com "*.local.carpedalan.com" localhost
aws s3 cp "s3://carpedev-pipeline/.env" ./.env-local --profile carpedev
aws s3 cp "s3://carpedev-pipeline/server/cfkeys" ./server/cfkeys/ --recursive --profile carpedev
aws s3 cp "s3://carpedev-pipeline/goodDataWithEtagAndKey.json" . --profile carpedev
grep -qxF '127.0.0.1	local.carpedalan.com' /etc/hosts || echo '127.0.0.1	local.carpedalan.com' >> /etc/hosts && echo 'Added local.carpedalan.com to hosts file.'

