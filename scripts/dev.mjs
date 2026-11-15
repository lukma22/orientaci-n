// Compatible con npm run dev y con herramientas que pasan --host / --port.
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2);
const read=(...flags)=>{for(const flag of flags){const i=args.indexOf(flag);if(i>=0)return args[i+1];}return undefined;};
const host=read('--host','--hostname','-H')||'127.0.0.1';
const port=read('--port','-p')||process.env.PORT||'3000';
const cwd=fileURLToPath(new URL('../apps/web/',import.meta.url));
const next=fileURLToPath(new URL('../node_modules/next/dist/bin/next',import.meta.url));
const mode=args.includes('--production')?'start':'dev';
const child=spawn(process.execPath,[next,mode,...(mode==='dev'?['--webpack']:[]),'-H',host,'-p',port],{cwd,stdio:'inherit',env:process.env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
child.on('error',error=>{process.stderr.write(error.message+'\n');process.exit(1);});
