const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadLogo() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  try {
    const result = await cloudinary.uploader.upload(logoPath, {
      public_id: 'site_logo',
      folder: 'system',
    });
    console.log('Logo uploaded successfully:', result.public_id);
  } catch (error) {
    console.error('Error uploading logo:', error);
  }
}

uploadLogo();
