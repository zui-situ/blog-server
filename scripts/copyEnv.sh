#!/bin/bash

#------------------------#
#复制env文件到dist的shell脚本#
#------------------------#

#env文件所在目录
ENV_PATH="./.env"
#dis文件所在目录
DIST_PATH="./dist"

SHELL_PATH=$(dirname $0) # 获取脚本所在的目录

cd ${SHELL_PATH}
cd ..

echo "[deploy] cloneing..."
cp -f ${ENV_PATH} ${DIST_PATH}
echo "[deploy] clone done"
