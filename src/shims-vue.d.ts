declare module '*.vue';

declare module "*.svg" {
    const filepath: string;
    export default filepath;
}