import fs from 'fs-extra';
import tmp from 'tmp';

import { Config } from '../src/index';

import { should } from 'chai';

should();

interface Test {
    wsEndpoint?: string;
    logLevel?: string;
    nodeVersion?: string;
    port?: number;
    dbURI?: string;
}

const subject = new Config<Test>();
const wsEndpoint = 'ws://localhost:11000'
const nodeVersion = 'v0.7.26';
const logLevel = 'debug';
const dbURI = 'db-uri-content';
const port = 3000;
const mainContent = `
wsEndpoint: "${wsEndpoint}"
logLevel: "${logLevel}"
nodeVersion: "${nodeVersion}"
port: ${port}
`;
const secretContent = `
dbURI: "${dbURI}"
`;
const mainTmp = tmp.fileSync();
fs.writeSync(mainTmp.fd, mainContent);

const secretTmp = tmp.fileSync();
fs.writeSync(secretTmp.fd, secretContent);

describe('Config reader', () => {
    it('should read multiple valid config files', () => {
        const result = subject.parse(mainTmp.name);

        result.wsEndpoint.should.eq(wsEndpoint);
        result.logLevel.should.eq(logLevel);
        result.port.should.eq(port);
        result.nodeVersion.should.eq(nodeVersion);
        (result.dbURI === undefined).should.be.true;
    });
    it('should read multiple valid config files and merge the contents', () => {
        const result = subject.parse(mainTmp.name, secretTmp.name);

        result.wsEndpoint.should.eq(wsEndpoint);
        result.logLevel.should.eq(logLevel);
        result.port.should.eq(port);
        result.nodeVersion.should.eq(nodeVersion);
        result.dbURI.should.eq(dbURI);
    });

    it('should throw with unexisting paths', () => {
        ((): Test => subject.parse('not_a_real_path')).should.throw();
    });
});
