package no.autopacker.webtests;

/**
 * Test configuration structure, stored in the application.yml file
 */
public class TestConfig {
    // Login credentials for AutoPacker user
    private String username;
    private String password;

    // When true, run tests in headless mode - without showing the browser window
    private boolean headless;

    // Base URL of the webpage to test, the whole URL (http://stage.autopacker.no or http://localhost:3000, etc)
    private String url;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
