FROM maven:3-jdk-11
COPY . /usr/src/userservice

RUN mkdir -p -m 777 /opt/fs/root/ /opt/fs/root/workspace/
ENTRYPOINT ["mvn", "-f", "/usr/src/userservice", "spring-boot:run", "-DskipTests", "-Dspring-boot.run.profiles=staging"]
