# Photos Folder

This folder is for storing static image assets, such as profile pictures for the VIPs.

## How to Use

1.  Add your image files to this directory (e.g., `edi_rama.jpg`).
2.  In your application code, reference the image using a root-relative path.

### Example

In your profile data, specify:
`imageUrl: '/photos/your_image_name.jpg',`

The build process for this static web app will make files in the `public` directory available at the root of the site.
