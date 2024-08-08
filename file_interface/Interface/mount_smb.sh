#!/bin/bash

mkdir public/share
mount -t cifs -o username=smbuser,password=123 //10.0.0.82/file public/share