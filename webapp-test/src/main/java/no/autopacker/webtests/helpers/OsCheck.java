package no.autopacker.webtests.helpers;

import java.util.Locale;

/**
 * Helper class to check the operating system this Java VM runs in
 * <p>
 * Code adapted from http://stackoverflow.com/questions/228477/how-do-i-programmatically-determine-operating-system-in-java
 */
public final class OsCheck {

    // cached result of OS detection
    protected static OSType detectedOS;

    /**
     * detect the operating system from the os.name System property and cache
     * the result
     *
     * @return - the operating system detected
     */
    public static OSType getOperatingSystemType() {
        if (detectedOS == null) {
            String OS = System.getProperty("os.name", "generic").toLowerCase(Locale.ENGLISH);
            System.out.println("OS: " + OS);
            if ((OS.contains("mac")) || (OS.contains("darwin"))) {
                detectedOS = OSType.MacOS;
            } else if (OS.contains("win")) {
                detectedOS = OSType.Windows;
            } else if (OS.contains("nux")) {
                detectedOS = OSType.Linux;
            } else {
                detectedOS = OSType.Other;
            }
        }
        return detectedOS;
    }
}