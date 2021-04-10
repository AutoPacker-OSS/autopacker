package no.autopacker.webtests;

/**
 * Test configuration structure, stored in the application.yml file
 */
public class TestConfig {
    // Login credentials for regular AutoPacker user
    private String regularUsername;
    private String regularPassword;

    // Login credentials for admin user
    private String adminUsername;
    private String adminPassword;

    // When true, run tests in headless mode - without showing the browser window
    private boolean headless;

    // Base URL of the webpage to test, the whole URL (http://stage.autopacker.no or http://localhost:3000, etc)
    private String url;

    public String getRegularUsername() {
        return regularUsername;
    }

    public void setRegularUsername(String username) {
        this.regularUsername = username;
    }

    public String getRegularPassword() {
        return regularPassword;
    }

    public void setRegularPassword(String password) {
        this.regularPassword = password;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    public boolean isHeadless() {
        return headless;
    }

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
