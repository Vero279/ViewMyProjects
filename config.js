/**
 * Application Configuration
 * * This file contains all configurable settings for the project launcher.
 * Edit this file to customize projects, colors, and layout.
 */

const AppConfig = {
  /**
   * Projects array - Add or modify projects here
   * Each project requires:
   * - label: Display name (string)
   * - url: Project URL (string, opened in new tab)
   * - accent: RGB color array [red, green, blue] (0-255)
   * * Color Palette (Blue & Green Cold Tones):
   * - Deep Cyan: [0, 212, 255]
   * - Vibrant Blue: [0, 191, 255]
   * - Ocean Blue: [70, 150, 200]
   * - Teal: [0, 201, 183]
   * - Mint Green: [45, 212, 191]
   * - Light Cyan: [100, 200, 240]
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
    {
      label: "Films JSON",
      url: "https://vero279.github.io/Films-JSON/",
      accent: [0, 212, 255],  // Deep cyan
    },
    {
      label: "Weather API",
      url: "https://vero279.github.io/Weather-API/",
      accent: [70, 150, 200],  // Ocean blue
    },
    {
      label: "Camera Toggles",
      url: "https://vero279.github.io/Camera-Toggles-Twist-Dancing/",
      accent: [0, 201, 183],  // Teal
    },
    {
      label: "Camera Slider",
      url: "https://vero279.github.io/Camera-Slider/",
      accent: [100, 200, 240],  // Light cyan
    },
    {
      label: "Speech Recognition",
      url: "https://vero279.github.io/EDI_MUL_INTERATIVAS_01/",
      accent: [0, 212, 255],  // Deep cyan
    },
    {
      label: "Brushes 4 Foto Editing",
      url: "https://vero279.github.io/EDI_MUL_INT_01/",
      accent: [0, 201, 183],  // Teal
    },
  ],
};
