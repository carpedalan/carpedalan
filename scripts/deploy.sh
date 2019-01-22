CIRCLE_SHA1=$(git rev-parse HEAD)
ECR_ENDPOINT=771396871964.dkr.ecr.us-east-1.amazonaws.com
docker build -t app . --target=prod                           


eval $(aws ecr get-login --region us-east-1 --no-include-email --profile carpedev) 
docker tag app "${ECR_ENDPOINT}/carpedev:${CIRCLE_SHA1}"
echo "Pushing ${ECR_ENDPOINT}/carpedev:${CIRCLE_SHA1}";
# docker push "${ECR_ENDPOINT}/carpedev:${CIRCLE_SHA1}"



# CIRCLE_SHA1=${CIRCLE_SHA1} ECR_ENDPOINT=${ECR_ENDPOINT} ./scripts/makeRevisionJson.js 
# cat ./container-definition.json


# aws ecs register-task-definition \
#   --cli-input-json file://container-definition.json \
#   --family carpedalan \
#   --profile carpedev \
#   --region us-east-1

# OLD_TASK_ID=`aws ecs list-tasks \
#   --cluster carpedalan \
#   --desired-status RUNNING \
#   --region us-east-1 \
#   --profile carpedev \
#   --family carpedalan | \
#     egrep "task" | tr "/" " " | tr "[" " " |  awk '{print $2}' | sed 's/"$//'`

# TASK_REVISION=`aws ecs describe-task-definition \
#   --task-definition carpedalan \
#   --profile carpedev \
#   --region us-east-1 | \
#   egrep "revision" | tr "/" " " | awk '{print $2}' | sed 's/"$//'`

# echo "Updating with task revision ${TASK_REVISION}";

# aws ecs update-service \
#   --cluster carpedalan \
#   --service carpedalan \
#   --profile carpedev \
#   --region us-east-1 \
#   --task-definition carpedalan:${TASK_REVISION} \
#   --desired-count 1

