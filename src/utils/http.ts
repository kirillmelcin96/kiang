import { fetch } from '@tauri-apps/plugin-http'
import { IS_TAURI } from './runtime'

/**
 * Use this feature for all HTTP requests in kiang. 
 * - In a browser, it calls `window.fetch`; 
 * - in a Tauri environment, it uses the `http-tauri` plugin.
 * 
 * Link to the Tauri plugin: https://v2.tauri.app/plugin/http-client/
 */
export const httpFetch =
    IS_TAURI
        ? fetch
        : window.fetch