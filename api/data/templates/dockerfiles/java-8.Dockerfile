FROM openjdk:8
COPY . /usr/src/java-app
WORKDIR /usr/src/java-app
ENTRYPOINT [ "javac", "Main.java" ]