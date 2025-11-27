import { FilterPattern, Plugin } from 'vite';

interface JqhtmlPluginOptions {
    /**
     * Glob patterns to include
     * @default ['**\/*.jqhtml']
     */
    include?: FilterPattern;
    /**
     * Glob patterns to exclude
     * @default ['node_modules/**']
     */
    exclude?: FilterPattern;
    /**
     * Enable source maps
     * @default true in development
     */
    sourcemap?: boolean;
}
declare function jqhtmlPlugin(options?: JqhtmlPluginOptions): Plugin;

export { type JqhtmlPluginOptions, jqhtmlPlugin as default, jqhtmlPlugin };
