#!/bin/bash

echo "[deploy] restarting..."
pm2 restart /data/server-dist/dist/main.js
echo "[deploy] restart done"
