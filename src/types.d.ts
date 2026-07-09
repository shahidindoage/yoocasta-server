declare module 'uuid' {
    export function v4(options?: { random?: number[] }): string;
    export function v1(options?: any): string;
    export function v5(name: string, namespace: string): string;
}