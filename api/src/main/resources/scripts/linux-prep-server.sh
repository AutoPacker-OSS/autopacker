#!/bin/bash

# Inspiration: https://github.com/NTNU-SysDev/sysdev-templates/blob/master/bash-scripts/springboot.sh

# Step 1, open port SSH, and provided port, and enable ufw
ufw_status=$(ufw status verbose)

ufw allow ssh

# For testing, allow all incoming and outgoing connections
ufw default allow outgoing
ufw default allow incoming

ufw --force enable

# Step 2, download docker and docker-compose

# Docker installation from https://docs.docker.com/engine/install/ubuntu/
# apt-get -y remove docker docker-engine docker.io containerd runc

apt-get update

apt-get -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get -y install docker-ce docker-ce-cli containerd.io

# docker-compose installation from https://docs.docker.com/compose/install/#linux
curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

apt-get -y install docker docker-compose
