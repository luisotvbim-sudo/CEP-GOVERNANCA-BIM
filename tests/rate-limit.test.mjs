import {test} from 'node:test';
import assert from 'node:assert/strict';
import {database} from './database.mjs';
import {reserveAttempt,finishAttempt} from '../src/rate-limit.js';
test('admite no máximo cinco chamadas simultâneas e renova a janela',async()=>{
 const {sqlite,DB}=database(),now=100000;
 const calls=await Promise.all(Array.from({length:20},()=>reserveAttempt(DB,'ip-a',now)));
 assert.equal(calls.filter(r=>r.allowed).length,5);
 assert.equal((await reserveAttempt(DB,'ip-b',now)).allowed,true);
 assert.equal((await reserveAttempt(DB,'ip-a',now+59999)).allowed,false);
 assert.equal((await reserveAttempt(DB,'ip-a',now+60000)).allowed,true);
 sqlite.close();
});
test('cinco erros bloqueiam quinze minutos, expiração libera, sucesso zera sequência de erros',async()=>{
 const {sqlite,DB}=database(),now=100000;
 for(let i=0;i<5;i++){assert.equal((await reserveAttempt(DB,'ip',now)).allowed,true);await finishAttempt(DB,'ip',false,now)}
 assert.equal((await reserveAttempt(DB,'ip',now+899999)).allowed,false);
 assert.equal((await reserveAttempt(DB,'ip',now+900000)).allowed,true);
 await finishAttempt(DB,'ip',false,now+900000);await finishAttempt(DB,'ip',true,now+900000);
 assert.equal(sqlite.prepare('SELECT failures FROM auth_attempts').get().failures,0);
 sqlite.close();
});
