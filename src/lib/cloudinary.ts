import { v2 as cloudinary } from 'cloudinary';

function configureCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  if (cloudinaryUrl) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(cloudinaryUrl);
    } catch {
      throw new Error('CLOUDINARY_URL tidak valid. Gunakan format cloudinary://API_KEY:API_SECRET@CLOUD_NAME.');
    }

    const cloudName = parsedUrl.hostname;
    const apiKey = decodeURIComponent(parsedUrl.username);
    const apiSecret = decodeURIComponent(parsedUrl.password);
    if ([cloudName, apiKey, apiSecret].some((value) => /^<.*>$/.test(value) || /^your_(api_key|api_secret|cloud_name)$/i.test(value))) {
      throw new Error('Ganti placeholder di CLOUDINARY_URL dengan API Key, API Secret, dan Cloud Name akun Anda.');
    }

    if (
      parsedUrl.protocol !== 'cloudinary:' ||
      !cloudName ||
      !apiKey ||
      !apiSecret ||
      parsedUrl.pathname !== '/'
    ) {
      throw new Error('CLOUDINARY_URL tidak valid. Gunakan format cloudinary://API_KEY:API_SECRET@CLOUD_NAME.');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return;
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  const missing = [
    !CLOUDINARY_CLOUD_NAME && 'CLOUDINARY_CLOUD_NAME',
    !CLOUDINARY_API_KEY && 'CLOUDINARY_API_KEY',
    !CLOUDINARY_API_SECRET && 'CLOUDINARY_API_SECRET',
  ].filter((name): name is string => Boolean(name));

  if (missing.length > 0) {
    throw new Error(
      `Atur CLOUDINARY_URL atau lengkapi variabel berikut di .env.local: ${missing.join(', ')}.`,
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImageToCloudinary(
  file: File,
  folder = 'umkm_catalog'
): Promise<{ url: string; publicId: string }> {
  configureCloudinary();
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
    throw new Error('Gunakan gambar JPG, PNG, WebP, atau AVIF.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran gambar maksimal 5 MB.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          transformation: [{ width: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload gagal'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      )
      .end(buffer);
  });
}

export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId);
}
