const WINDOW=60000, LIMIT=5, BLOCK=15*60000;
export async function reserveAttempt(db,ipHash,now=Date.now()){
 // Admission and counter increment are one atomic SQL statement, including concurrent requests.
 const accepted=await db.prepare(`INSERT INTO auth_attempts (ip_hash,window_start,attempts,failures,blocked_until)
 VALUES (?,?,1,0,0)
 ON CONFLICT(ip_hash) DO UPDATE SET
 window_start=CASE WHEN ?-window_start>=60000 THEN ? ELSE window_start END,
 attempts=CASE WHEN ?-window_start>=60000 THEN 1 ELSE attempts+1 END,
 failures=CASE WHEN blocked_until>0 AND blocked_until<=? THEN 0 ELSE failures END,
 blocked_until=CASE WHEN blocked_until<=? THEN 0 ELSE blocked_until END
 WHERE blocked_until<=? AND (?-window_start>=60000 OR attempts<5)
 RETURNING ip_hash`).bind(ipHash,...Array(8).fill(now)).first();
 if(accepted)return {allowed:true};
 const row=await db.prepare('SELECT window_start, blocked_until FROM auth_attempts WHERE ip_hash = ?').bind(ipHash).first();
 return {allowed:false,retryAfter:Math.max(1,Math.ceil((Math.max(row.blocked_until,row.window_start+WINDOW)-now)/1000))};
}
export async function finishAttempt(db,ipHash,correct,now=Date.now()){
 if(correct){await db.prepare('UPDATE auth_attempts SET failures = 0 WHERE ip_hash = ?').bind(ipHash).run();return}
 await db.prepare('UPDATE auth_attempts SET failures = failures + 1, blocked_until = CASE WHEN failures + 1 >= ? THEN max(blocked_until, ?) ELSE blocked_until END WHERE ip_hash = ?').bind(LIMIT,now+BLOCK,ipHash).run();
}
export async function clientHash(request){
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('cep-auth:'+ip));
 return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
