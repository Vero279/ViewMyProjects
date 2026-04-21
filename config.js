/**
 * Application Configuration
 * 
 * This file contains all configurable settings for the project launcher.
 * Edit this file to customize projects, colors, and layout.
 */

const AppConfig = {
  /**
   * Projects array - Add or modify projects here
   * Each project requires:
   *   - label: Display name (string)
   *   - url: Project URL (string, opened in new tab)
   *   - accent: RGB color array [red, green, blue] (0-255)
   * 
   * Color Palette (Blue & Green Cold Tones):
   *   - Cyan: [0, 212, 255]
   *   - Blue: [0, 191, 255]
   *   - Teal: [0, 201, 183]
   *   - Green: [45, 212, 191]
   *   - Ocean: [70, 150, 200]
   *   - Deep Blue: [100, 150, 200]
   */
  projects: [
    {
      label: "Red Circle",
      url: "https://vero279.github.io/RedCircle/",
      accent: [0, 191, 255],  // Vibrant blue
    },
    {
      label: "Blue Square",
      url: "https://vero279.github.io/BlueSquare/",
      accent: [45, 212, 191],  // Elegant teal
    },
    // Add more projects below:
    // {
    //   label: "Project Name",
    //   url: "https://example.com/project",
    //   accent: [0, 212, 255],  // Cyan
    // },
  ],
};
