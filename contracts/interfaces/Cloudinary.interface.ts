import cloudinary from 'cloudinary';

type Option = {

}

export interface ICloudinary {
    file: string | undefined;
    folder: string;
    options?: Option;
    placeholderUrl?: string;
}

export default interface CloudinaryInterface {
    uploadToCloudinary({ file, folder, options, placeholderUrl }: ICloudinary): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse>;
    destroyFromCloudinary(id: string): Promise<cloudinary.ResponseCallback | cloudinary.DeleteApiResponse>;
}