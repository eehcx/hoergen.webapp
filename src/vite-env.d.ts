/// <reference types="vite/client" />

declare module 'vite-plugin-obfuscator' {
    import { Plugin } from 'vite';
    interface ObfuscatorOptions {
        [key: string]: any;
    }
    export default function obfuscator(options?: ObfuscatorOptions): Plugin;
}