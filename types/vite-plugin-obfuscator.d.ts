declare module 'vite-plugin-obfuscator' {
    import { Plugin } from 'vite';

    interface ObfuscatorOptions {
        exclude?: string[];
        include?: string[];
        [key: string]: any;
    }

    export default function obfuscator(options?: ObfuscatorOptions): Plugin;
}

