FROM maven:3-jdk-11
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get -y update && apt-get install -y google-chrome-stable

# install chromedriver
#RUN apt-get install -yqq unzip
#RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip

#RUN apt update && apt install -y libglib2.0-0 libnss3 libx11-6 chromium
## harfbuzz nss freetype ttf-freefont wqy-zenhei
#

# Cleanup
RUN rm -rf /var/lib/apt/lists/*

#
## Add Chrome as a user
#RUN mkdir -p /usr/src/app \
#    && adduser chrome \
#    && chown -R chrome:chrome /usr/src/app
#
#ENV CHROME_BIN=/usr/bin/chromium-browser \
#    CHROME_PATH=/usr/lib/chromium/
#

COPY . /usr/src/webapptest
WORKDIR /usr/src/webapptest

## RUN mvn clean compile exec:java
RUN mvn clean compile

#RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/src/webapptest/target/classes/chromedriver/linux
RUN chmod a+x /usr/src/webapptest/target/classes/chromedriver/linux/chromedriver


ENTRYPOINT ["mvn", "exec:java"]
