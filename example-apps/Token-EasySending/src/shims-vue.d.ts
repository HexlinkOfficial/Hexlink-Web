declare module '*.vue';

declare module "*.svg" {
    const filepath: string;
    export default filepath;
}

declare module '@meforma/vue-toaster';
declare module 'totp-generator';
declare module 'qrcode';