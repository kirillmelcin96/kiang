/**
 * Detects if the app is running using Tauri
 * 
 * Source: https://github.com/orgs/tauri-apps/discussions/6119#discussioncomment-12024868
 */
export const IS_TAURI: boolean = typeof window !== 'undefined' && (window as any).isTauri;