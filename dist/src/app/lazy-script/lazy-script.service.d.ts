import { OptionCoreConfig } from '../option-core.config';
export declare class OptLazyScriptService {
    protected config: OptionCoreConfig;
    private scripts;
    constructor(config: OptionCoreConfig);
    load(...scripts: string[]): Promise<any[]>;
    loadScript(name: string): any;
    isLoadedScript(name: string): boolean;
}
