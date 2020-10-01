FROM maven:3-jdk-11
COPY . /usr/src/servermanager

# Two needed folders for the API
RUN mkdir -p -m 777 /opt/fs/root/ /opt/fs/root/workspace/
ENTRYPOINT ["mvn", "-f", "/usr/src/servermanager", "spring-boot:run", "-DskipTests", "-Dspring-boot.run.profiles=staging"]
