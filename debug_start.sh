#!/bin/bash
echo "Starting debug script" > debug_status.txt
npm run dev > dev_log.txt 2>&1 &
echo $! > dev_pid.txt
echo "Server started with PID $(cat dev_pid.txt)" >> debug_status.txt
