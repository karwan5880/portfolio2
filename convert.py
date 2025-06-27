from PIL import Image
import os  # Import os module to check for file existence


def png_to_ico(
    png_path,
    ico_path,
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
):
    """
    Converts a PNG image to an ICO file, ensuring it handles common icon sizes.

    Args:
        png_path (str): The path to the input PNG file.
        ico_path (str): The path to save the output ICO file.
        sizes (list of tuples): A list of (width, height) tuples for the ICO icon sizes.
                                Default includes common sizes for better compatibility.
    """
    if not os.path.exists(png_path):
        print(
            f"Error: PNG file not found at '{png_path}'. Please check the path and try again."
        )
        return

    try:
        img = Image.open(png_path)

        # Ensure the image has an alpha channel for proper transparency in ICO
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        # Resize and save for each specified size
        # Pillow's save method for ICO can handle multiple sizes directly,
        # but sometimes manual resizing prior to saving can offer more control
        # especially if the source PNG is very small or very large and you
        # want specific resampling for different sizes.
        # However, for simplicity, Pillow's 'sizes' argument is usually sufficient.
        img.save(ico_path, format="ICO", sizes=sizes)
        print(
            f"Successfully converted '{png_path}' to '{ico_path}' with sizes: {sizes}"
        )
    except Exception as e:
        print(f"An error occurred during conversion: {e}")


# --- How to use this script ---
if __name__ == "__main__":
    # IMPORTANT: Replace 'path/to/your/image.png' with the actual path to your PNG file.
    # For example, if your PNG is in the same directory as this script and named 'my_icon.png':
    input_png_file = "favicon.png"  # <--- CHANGE THIS TO YOUR PNG FILE NAME/PATH

    # This will be the name of the output .ico file
    output_ico_file = "favicon.ico"  # <--- YOU CAN CHANGE THIS TOO

    # Call the function to perform the conversion
    png_to_ico(input_png_file, output_ico_file)

    print("\n--- Usage Tips ---")
    print(f"1. Make sure '{input_png_file}' exists in the specified location.")
    print(
        f"2. After running, you should find '{output_ico_file}' in the same directory as this script (or your specified output path)."
    )
    print(
        "3. You can customize the 'sizes' list in the function call if you need specific icon dimensions."
    )
    print(
        "   Example: png_to_ico(input_png_file, output_ico_file, sizes=[(16, 16), (32, 32)])"
    )
