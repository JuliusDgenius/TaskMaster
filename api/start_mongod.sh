#!/usr/bin/bash
# Script to start mongodb
nohup sudo mongod --dbpath /var/lib/mongodb --bind_ip 127.0.0.1 &>/dev/null &
