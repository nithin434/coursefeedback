from PIL import Image, ImageDraw, ImageFont

# Create icons in different sizes
sizes = [16, 48, 128]
bg_color = (37, 99, 235)  # Blue color
text_color = (255, 255, 255)  # White

for size in sizes:
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Draw a simple form icon (rectangle with lines)
    if size >= 48:
        padding = size // 6
        # Outer rectangle
        draw.rectangle([padding, padding, size-padding, size-padding], 
                      outline=text_color, width=max(1, size//24))
        
        # Lines representing form fields
        line_count = 3
        line_spacing = (size - 2*padding) // (line_count + 1)
        for i in range(1, line_count + 1):
            y = padding + i * line_spacing
            draw.line([padding + size//8, y, size - padding - size//8, y], 
                     fill=text_color, width=max(1, size//32))
    else:
        # Simple filled circle for small icon
        draw.ellipse([2, 2, size-2, size-2], fill=text_color)
    
    img.save(f'icon{size}.png')
    print(f'Created icon{size}.png')

print('All icons created successfully!')
