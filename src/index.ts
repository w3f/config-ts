import path from 'path';
import process from 'process';

import { Files } from '@w3f/files';


export class Config<T> {
    parse(...rawCfgPaths: string[]): T {
        const cfgs: T[] = new Array<T>();

        rawCfgPaths.forEach((rawCfgPath) => {
            const cfgPath = path.resolve(process.cwd(), rawCfgPath);
            cfgs.push(this.parseFile(cfgPath));
        })

        return Object.assign({}, ...cfgs);
    }
    private parseFile(rawPath: string): T {
        const cfgPath = path.resolve(process.cwd(), rawPath);
        return Files.readYAML(cfgPath) as T;
    }
}
