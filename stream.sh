#!/bin/bash
export RDS_HOSTNAME=sotg-staging-db.ctifvcvmvtjl.us-west-2.rds.amazonaws.com
# export RDS_USERNAME=sotg_db_user
# export RDS_PASSWORD=sotg_db_pass
# export RDS_DB_NAME=sotg
export HANDLER_ADDRESS=ec2-52-27-78-211.us-west-2.compute.amazonaws.com
export API_ADDRESS=sotg-staging.elasticbeanstalk.com
export PORT=80
export HANDLER_PORT=6000

node streaming/server.js
