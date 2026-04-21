# ViewMyProjects

An elegant, interactive project launcher built with p5.js featuring smooth animations, keyboard navigation, and responsive design.

## Features

- 🎨 **Modern UI**: Clean, minimalist design with animated hover effects and glowing accents
- ⌨️ **Keyboard Navigation**: Full support for arrow keys and Enter for accessibility
- 📱 **Responsive Design**: Adapts gracefully to different screen sizes
- ♿ **Accessible**: Semantic HTML, ARIA labels, and keyboard support
- 🏗️ **Modular Architecture**: Well-organized code with clear separation of concerns
- ⚡ **Performance**: Optimized rendering and event handling
- 🛡️ **Error Handling**: Graceful error management with user feedback

## Project Structure

```
.
├── index.html      # Main HTML entry point with semantic structure
├── config.js       # Project configuration (edit this to add/modify projects)
├── sketch.js       # Main application logic using p5.js
├── style.css       # Global styles with CSS custom properties
├── p5.min.js       # p5.js library (local copy)
└── README.md       # This file
```

## Configuration

Edit `config.js` to customize projects and appearance:

```javascript
const AppConfig = {
  projects: [
    {
      label: "Project Name",
      url: "https://your-project-url.com",
      accent: [220, 60, 60],  // RGB accent color
    },
    // Add more projects...
  ],
};
```

## Customization

### Colors

Edit CSS custom properties in `style.css` (`:root` selector):

```css
:root {
  --color-bg-primary: #0d0d0d;
  --color-text-primary: #ffffff;
  /* ... more variables */
}
```

### Layout

Modify layout constants in `style.css`:

```css
--btn-width: 260px;
--btn-height: 64px;
--btn-gap: 32px;
```

## Usage

1. **Add Projects**: Edit `config.js` to add your projects
2. **Customize Appearance**: Modify CSS variables in `style.css`
3. **Run**: Open `index.html` in a modern web browser

## Keyboard Controls

- **↑ / ↓**: Navigate between projects
- **Enter**: Open selected project
- **Mouse**: Click buttons or hover for visual feedback

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ❌ Not supported (uses modern JavaScript)

## Best Practices Implemented

### Code Organization
- Clear separation of concerns with configuration, rendering, and interaction logic
- Modular function design with single responsibilities
- Comprehensive comments and JSDoc documentation

### Scalability
- Easy to add/remove projects through `config.js`
- Responsive design scales to any screen size
- Extensible architecture for adding new features

### Maintainability
- CSS custom properties for consistent styling
- State management with `AppState` object
- Error handling with try-catch blocks
- Clear naming conventions

### Accessibility
- Keyboard navigation support
- Semantic HTML5 structure
- ARIA labels for screen readers
- Focus-visible styles
- noscript fallback for JavaScript-disabled browsers

### Performance
- Efficient event handling with debouncing
- Optimized resize handling
- Minimal redraws
- Event delegation where applicable

## Development Tips

### Adding a New Project

1. Open `config.js`
2. Add a new object to the `projects` array:

```javascript
{
  label: "My Awesome Project",
  url: "https://myproject.com",
  accent: [100, 200, 150],  // Custom RGB color
}
```

### Changing Colors

Modify the RGB values in `config.js` for each project's accent color, or edit the global color palette in `style.css`.

### Troubleshooting

**Projects not loading?**
- Check browser console for errors
- Ensure `config.js` is properly formatted
- Verify all project URLs are correct

**Responsive design not working?**
- Check that browser window is not zoomed
- Clear browser cache
- Ensure viewport meta tag is present in HTML

## License

MIT - Feel free to use this project as a template for your own portfolio or launcher.

## Credits

Built with [p5.js](https://p5js.org) - A JavaScript library for creative coding.
