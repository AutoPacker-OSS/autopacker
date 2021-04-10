package no.autopacker.api.service;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;

import no.autopacker.api.config.AppConfig;
import no.autopacker.api.entity.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Responsible for executing scripts on a given server.
 */
@Service
public class RemoteScriptExec {

    // Config
    private final AppConfig appConfig;

    @Autowired
    public RemoteScriptExec(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    /**
     * This method let's the user connect to a remote server and transfers a linux-prep-server.sh
     * script ChannelSftp Object is handles the transferring from client to server. ChannelExec
     * Object is created over the session, and defined a command to execute.
     */
    public void serverInit(Server server, String serverPassword) {
        Session session = this.connectWithPwdAndUname(server, serverPassword);
        if (session.isConnected()) {
            ChannelExec channel = null;
            try {
                fileTransfer(session, "src/main/resources/scripts/linux-prep-server.sh",
                    "linux-prep-server.sh");
                channel = (ChannelExec) session.openChannel("exec");
            } catch (JSchException e) {
                e.printStackTrace();
            }
            // Convert to unix (line endings)
            channel.setCommand(
                "sudo apt-get -y install dos2unix; dos2unix linux-prep-server.sh; sudo sh linux-prep-server.sh");
            runCommand(channel, server, serverPassword);
            session.disconnect();
        }
    }

    private void runCommand(ChannelExec channel, Server server, String serverPassword) {
        try {
            channel.setPty(true);
            InputStream in = channel.getInputStream();
            OutputStream out = channel.getOutputStream();
            PrintWriter writer = new PrintWriter(out, true);
            ((ChannelExec) channel).setErrStream(System.err);

            channel.connect();

            //TODO: remember to swap out passphrase
            out.write((serverPassword + "\n").getBytes());
            out.flush();

            byte[] tmp = new byte[1024];
            String response = "";
            while (true) {
                while (in.available() > 0) {
                    int i = in.read(tmp, 0, 1024);
                    if (i < 0) {
                        break;
                    }
                    response = new String(tmp, 0, i);
                }
                System.out.println(response);
                if (channel.isClosed()) {
                    System.out.println("exit-status: " + channel.getExitStatus());
                    break;
                }
                try {
                    Thread.sleep(1000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (JSchException | IOException e) {
            e.printStackTrace();
        } finally {
            channel.disconnect();
        }
    }

    private void fileTransfer(Session session, String src, String dst) {
        ChannelSftp sftpChannel;
        File srcFile = new File(src);
        try {
            if (!srcFile.isDirectory()) {
                sftpChannel = (ChannelSftp) session.openChannel("sftp");
                sftpChannel.connect();
                sftpChannel.put(src, dst);
            }
        } catch (JSchException | SftpException e) {
            e.printStackTrace();
        }
    }

    /**
     * Establish SSH connection with the remote server with ssh-key through the JSCH library.
     *
     * @return Session contains the connection object between client and server.
     */
    private Session connectWithSSHKey() {
        //TODO: make it possible to connect with SSH key
        return null;
    }

    /**
     * Establish SSH connection with the remote server with username and password credentials,
     * through the JSCH library.
     *
     * @return Session contains the connection object between client and server.
     */
    private Session connectWithPwdAndUname(Server server, String serverPassword) {
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession(server.getServerUsername(), server.getIp(), 22);
            session.setPassword(serverPassword);
            session.setConfig("StrictHostKeyChecking", "no");
            session.connect();
            return session;
        } catch (JSchException e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean startDockerCompose(Server server, String username, String project, String serverPassword) {
        try {
            Session session = this.connectWithPwdAndUname(server, serverPassword);
            if (session.isConnected()) {
                ChannelExec channel = (ChannelExec) session.openChannel("exec");
                String dockerComposePath =
                    this.appConfig.getApiRootUrl() + "/api/projects/" + username + "/" + project
                        + "/docker-compose.yml";
                System.out.println(dockerComposePath);
                channel.setCommand(
                    "sudo docker-compose -v; touch docker-compose." + username + "_" + project
                        + ".yml; curl -X GET " + dockerComposePath + " >> docker-compose."
                        + username + "_" + project + ".yml; sudo docker-compose -f docker-compose."
                        + username + "_" + project + ".yml up -d");
                runCommand(channel, server, serverPassword);
                session.disconnect();
                return true;
            } else {
                return false;
            }
        } catch (JSchException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean stopDockerCompose(Server server, String username, String project, String serverPassword) {
        try {
            Session session = this.connectWithPwdAndUname(server, serverPassword);
            if (session.isConnected()) {
                ChannelExec channel = (ChannelExec) session.openChannel("exec");
                channel.setCommand("sudo rm docker-compose." + username + "_" + project
                    + ".yml; sudo docker container rm -f " + username + "-" + project);
                runCommand(channel, server, serverPassword);
                session.disconnect();
                return true;
            } else {
                return false;
            }
        } catch (JSchException e) {
            e.printStackTrace();
            return false;
        }
    }

}
