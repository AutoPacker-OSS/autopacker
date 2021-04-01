package no.autopacker.webtests.helpers;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Paths;

/**
 * A class with helper methods related to Chromium driver
 */
public class ChromiumDriverHelper {
    /**
     * Instantiate a Chromium WebDriver.
     * @param headless When true, run the tests without a visual browser window (headless mode)
     * @return The driver or null if something went wrong (chromedriver not found)
     */
    public static WebDriver getWebDriver(boolean headless) {
        String driverPath = findDriverPath();
        if (driverPath == null) {
            System.out.println("Can't find ChromeDriver!");
            return null;
        }
        System.out.println("Chrome Driver location: " + driverPath);
        System.setProperty("webdriver.chrome.driver", driverPath);

        WebDriver driver = null;
        try {
            ChromeOptions options = new ChromeOptions();
            if (headless) {
                options.addArguments("--headless");
            }
            options.addArguments("--disable-extensions");
            options.addArguments("--no-sandbox");
            driver = new ChromeDriver(options);
        } catch (IllegalStateException e) {
            System.out.println("Can't instantiate Selenium WebDriver: " + e.getMessage());
        }
        return driver;
    }

    /**
     * Find path to chromium driver
     * @return The path to chromiumdriver, or null if none found
     */
    private static String findDriverPath() {
        OSType osType = OsCheck.getOperatingSystemType();
        String relDriverPath = getRelDriverPath(osType);

        String driverPath = null;
        try {
            URL rp = ChromiumDriverHelper.class.getClassLoader().getResource(relDriverPath);
            if (rp != null) {
                File file = Paths.get(rp.toURI()).toFile();
                driverPath = file.getAbsolutePath();
            }
        } catch (URISyntaxException e) {
            System.out.println("Could not find chromedriver resource");
        }

        return driverPath;
    }

    /**
     * Get predefined relative path (within the project) to a chromium driver for this OS
     * @param osType The current Operating system type
     * @return Relative path to the driver or null if OS is unsupported
     */
    private static String getRelDriverPath(OSType osType) {
        final String basePath = "chromedriver" + File.separatorChar;
        switch (osType) {
            case Windows:
                return basePath + "windows" + File.separatorChar + "chromedriver.exe";
            case Linux:
                return basePath + "linux" + File.separatorChar + "chromedriver";
            case MacOS:
                return basePath + "macos" + File.separatorChar + "chromedriver";
            default:
                return null;
        }
    }
}
