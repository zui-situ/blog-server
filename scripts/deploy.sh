#!/bin/bash

SHELL_PATH=$(dirname $0)

echo "[deploy] start deployment..."
sh ${SHELL_PATH}/copyEnv.sh
sh ${SHELL_PATH}/restart.sh
echo "[deploy] finished"
