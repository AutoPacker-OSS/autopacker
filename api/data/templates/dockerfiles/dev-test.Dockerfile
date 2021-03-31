FROM bash:4.4
COPY . /usr/src/project
ENTRYPOINT ["echo", "Project was successfully deployed", ">>", ".deploy"]