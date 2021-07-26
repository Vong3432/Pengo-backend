import cloudinary from 'cloudinary';
import Env from '@ioc:Adonis/Core/Env'

type Option = {

}

interface ICloudinary {
    file: string | undefined;
    folder: string;
    options?: Option;
    placeholderUrl?: string;
}

cloudinary.v2.config({
    cloud_name: Env.get("CLOUDINARY_CLOUD_NAME"),
    api_key: Env.get("CLOUDINARY_API_KEY"),
    api_secret: Env.get("CLOUDINARY_API_SECRET"),
    secure: true
})

export async function uploadToCloudinary({ file, folder, options, placeholderUrl }: ICloudinary) {
    try {
        if (!file) {
            return {
                secure_url: placeholderUrl ?? 'https://res.cloudinary.com/dpjso4bmh/image/upload/v1626867341/pengo/penger/staff/3192c5a13626653bffeb2c1171df716f_wrchju.png'
            }
        }
        const result = await cloudinary.v2.uploader.upload(file, {
            ...options,
            folder: "pengo/" + folder
        });
        return result;
    } catch (error) {
        return error;
    }

}

export async function destroyFromCloudinary(public_id: string) {
    try {
        const result = await cloudinary.v2.uploader.destroy(public_id);
        return result;
    } catch (error) {
        return error;
    }

}

