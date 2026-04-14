const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const router = express.Router();
const pino = require('pino');
const cheerio = require('cheerio');
const moment = require('moment-timezone');
const Jimp = require('jimp');
const lastYtSearch = new Map();
const crypto = require('crypto');
const youtubedl = require('youtube-dl-exec');
const yts = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const FormData = require("form-data");
const os = require('os'); 
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
const { sms, downloadMediaMessage } = require("./msg.js");
const { igdl } = require('ruhend-scraper'); 
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { smsg, getGroupAdmins, formatp, jam, formatDate, getTime, isUrl, await, sleep, clockString, msToDate, sort, toNumber, enumGetKey, runtime, fetchJson, getBuffer, json, format, logic, generateProfilePicture, parseMention, getRandom, pickRandom, reSize } = require('./myfunc.js')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    getContentType,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser,
    downloadContentFromMessage,
    proto,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    S_WHATSAPP_NET
} = require('@whiskeysockets/baileys');
const chalk = require('chalk')
const {
    sizeFormatter
} = require('human-readable')
const ALWAYS_ONLINE_ENABLED = true;
const util = require('util')
const lastPlaySearch = new Map();
const messageStore = new Map();
const {
    defaultMaxListeners
} = require('stream')
// Place this at the top of your pair.js, before any functions use it

const FileType = require('file-type');


const ANTILINK_PATH = './antilink.json';
const AUTOTYPING_PATH = './autotyping.json';
const ANTIDELETE_PATH = './antidelete.json';
const BADWORDS_PATH = './badwords.json';
const AUTOREACT_PATH = './autoreact.json';
const AUTORECORDING_PATH = './autorecording.json';
const AUTOSTATUSVIEW_PATH = './autostatusview.json';
const AUTOSTATUSREACT_PATH = './autostatusreact.json';
const BOT_MODE_PATH = './botmode.json';
const CUSTOM_PREFIX_PATH = './customprefix.json';
const USER_SETTINGS_PATH = './user_settings.json';

// Initialize user settings
function initializeUserSettings() {
    if (!fs.existsSync(USER_SETTINGS_PATH)) {
        writeJSON(USER_SETTINGS_PATH, {});
    }
}

// Get user settings
function getUserSettings(userId) {
    try {
        const userSettings = readJSON(USER_SETTINGS_PATH);
        return userSettings[userId] || getDefaultUserSettings();
    } catch (error) {
        console.error('Error reading user settings:', error);
        return getDefaultUserSettings();
    }
}

// Save user settings
function saveUserSettings(userId, settings) {
    try {
        const userSettings = readJSON(USER_SETTINGS_PATH) || {};
        userSettings[userId] = { ...getDefaultUserSettings(), ...settings };
        writeJSON(USER_SETTINGS_PATH, userSettings);
        return true;
    } catch (error) {
        console.error('Error saving user settings:', error);
        return false;
    }
}

// Default user settings
function getDefaultUserSettings() {
    return {
        autoreact: false,
        autostatusview: config.AUTO_VIEW_STATUS === 'true',
        autostatusreact: config.AUTO_LIKE_STATUS === 'true',
        autotype: false,
        autodelete: false,
        antilink: false,
        badwords: false,
        prefix: config.PREFIX,
        language: 'en',
        botmode: 'public',
        autorecording: config.AUTO_RECORDING === 'true',
        autobio: config.AUTOBIO === 'true'
    };
}

// Apply user settings to individual JSON files
function applyUserSettingsToFiles(userId, settings) {
    try {
        // Apply to autoreact.json
        const autoreactData = readJSON(AUTOREACT_PATH);
        autoreactData[userId] = settings.autoreact;
        writeJSON(AUTOREACT_PATH, autoreactData);

        // Apply to autostatusview.json
        const autostatusviewData = readJSON(AUTOSTATUSVIEW_PATH);
        autostatusviewData[userId] = settings.autostatusview;
        writeJSON(AUTOSTATUSVIEW_PATH, autostatusviewData);

        // Apply to autostatusreact.json
        const autostatusreactData = readJSON(AUTOSTATUSREACT_PATH);
        autostatusreactData[userId] = settings.autostatusreact;
        writeJSON(AUTOSTATUSREACT_PATH, autostatusreactData);

        // Apply to autotyping.json
        const autotypingData = readJSON(AUTOTYPING_PATH);
        autotypingData[userId] = settings.autotype;
        writeJSON(AUTOTYPING_PATH, autotypingData);

        // Apply to antidelete.json
        const antideleteData = readJSON(ANTIDELETE_PATH);
        antideleteData[userId] = settings.autodelete;
        writeJSON(ANTIDELETE_PATH, antideleteData);

        // Apply to antilink.json
        const antilinkData = readJSON(ANTILINK_PATH);
        antilinkData[userId] = settings.antilink;
        writeJSON(ANTILINK_PATH, antilinkData);

        // Apply to badwords.json
        const badwordsData = readJSON(BADWORDS_PATH);
        badwordsData[userId] = settings.badwords;
        writeJSON(BADWORDS_PATH, badwordsData);

        // Apply to botmode.json
        const botmodeData = readJSON(BOT_MODE_PATH);
        botmodeData[userId] = settings.botmode;
        writeJSON(BOT_MODE_PATH, botmodeData);

        // Apply to customprefix.json
        const prefixData = readJSON(CUSTOM_PREFIX_PATH);
        prefixData[userId] = settings.prefix;
        writeJSON(CUSTOM_PREFIX_PATH, prefixData);

        // Apply to autorecording.json
        const autorecordingData = readJSON(AUTORECORDING_PATH);
        autorecordingData[userId] = settings.autorecording;
        writeJSON(AUTORECORDING_PATH, autorecordingData);

        console.log(`✅ Applied settings for user: ${userId}`);
        return true;
    } catch (error) {
        console.error('Error applying user settings to files:', error);
        return false;
    }
}

// Collect current settings from individual JSON files
function collectCurrentSettings(userId) {
    try {
        const settings = getDefaultUserSettings();
        
        // Collect from individual JSON files
        const autoreactData = readJSON(AUTOREACT_PATH);
        settings.autoreact = !!autoreactData[userId];
        
        const autostatusviewData = readJSON(AUTOSTATUSVIEW_PATH);
        settings.autostatusview = !!autostatusviewData[userId];
        
        const autostatusreactData = readJSON(AUTOSTATUSREACT_PATH);
        settings.autostatusreact = !!autostatusreactData[userId];
        
        const autotypingData = readJSON(AUTOTYPING_PATH);
        settings.autotype = !!autotypingData[userId];
        
        const antideleteData = readJSON(ANTIDELETE_PATH);
        settings.autodelete = !!antideleteData[userId];
        
        const antilinkData = readJSON(ANTILINK_PATH);
        settings.antilink = !!antilinkData[userId];
        
        const badwordsData = readJSON(BADWORDS_PATH);
        settings.badwords = !!badwordsData[userId];
        
        const botmodeData = readJSON(BOT_MODE_PATH);
        settings.botmode = botmodeData[userId] || 'public';
        
        const prefixData = readJSON(CUSTOM_PREFIX_PATH);
        settings.prefix = prefixData[userId] || config.PREFIX;
        
        const autorecordingData = readJSON(AUTORECORDING_PATH);
        settings.autorecording = !!autorecordingData[userId];

        return settings;
    } catch (error) {
        console.error('Error collecting current settings:', error);
        return getDefaultUserSettings();
    }
}


if (!fs.existsSync(CUSTOM_PREFIX_PATH)) {
    writeJSON(CUSTOM_PREFIX_PATH, {});
}



if (!fs.existsSync(BOT_MODE_PATH)) {
    writeJSON(BOT_MODE_PATH, {});
}


[AUTORECORDING_PATH, AUTOSTATUSVIEW_PATH, AUTOSTATUSREACT_PATH].forEach(path => {
    if (!fs.existsSync(path)) {
        writeJSON(path, {});
    }
});



const USER_LANG_PATH = './user_lang.json';

// Function to manage user language preferences
function getUserLang(userId) {
    try {
        const userLangData = readJSON(USER_LANG_PATH);
        return userLangData[userId] || 'en';
    } catch (error) {
        return 'en';
    }
}

function setUserLang(userId, langCode) {
    try {
        const userLangData = readJSON(USER_LANG_PATH) || {};
        userLangData[userId] = langCode;
        writeJSON(USER_LANG_PATH, userLangData);
        return true;
    } catch (error) {
        return false;
    }
}

// Helper functions to read/write JSON files
// Enhanced readJSON function with better error handling
function readJSON(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8').trim();
            
            // If file is empty, return empty object
            if (!content) {
                console.log(`File ${filePath} is empty, initializing with empty object`);
                writeJSON(filePath, {});
                return {};
            }
            
            try {
                return JSON.parse(content);
            } catch (parseError) {
                console.error(`JSON parse error in ${filePath}:`, parseError);
                // If JSON is corrupted, backup and reset the file
                const backupPath = filePath + '.backup.' + Date.now();
                fs.copyFileSync(filePath, backupPath);
                console.log(`Created backup of corrupted file: ${backupPath}`);
                
                writeJSON(filePath, {});
                return {};
            }
        }
        console.log(`File ${filePath} does not exist, returning empty object`);
        return {};
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return {};
    }
}

function initializeAllJSONFiles() {
    const jsonFiles = {
        [ANTILINK_PATH]: {},
        [AUTOTYPING_PATH]: {},
        [ANTIDELETE_PATH]: {},
        [BADWORDS_PATH]: {},
        [AUTORECORDING_PATH]: {},
        [AUTOSTATUSVIEW_PATH]: {},
        [AUTOSTATUSREACT_PATH]: {},
        [BOT_MODE_PATH]: {},
        [CUSTOM_PREFIX_PATH]: {}
    };
    
    for (const [path, defaultValue] of Object.entries(jsonFiles)) {
        if (!fs.existsSync(path)) {
            console.log(`Creating missing JSON file: ${path}`);
            writeJSON(path, defaultValue);
        } else {
            // Read and validate existing files
            console.log(`Validating JSON file: ${path}`);
            readJSON(path);
        }
    }
}
    

function writeJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
    }
}

[ANTILINK_PATH, AUTOTYPING_PATH, ANTIDELETE_PATH, BADWORDS_PATH].forEach(path => {
    if (!fs.existsSync(path)) {
        writeJSON(path, {});
    }
});

if (!fs.existsSync(AUTOREACT_PATH)) {
    writeJSON(AUTOREACT_PATH, {});
}



// Call this function at startup
initializeAllJSONFiles();



// Initialize JSON files if they don't exist


const { emojis } = require('./autoreact.js');
const { url } = require('inspector');

const config = {
    AUTO_VIEW_STATUS: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'false',
    AUTO_LIKE_EMOJI: emojis, 
    PREFIX: '.',
    MAX_RETRIES: 3,
    IMAGE_PATH: 'https://files.catbox.moe/tmmvub.jpg',
    GROUP_INVITE_LINK: 'Hv5XzaighN0KWnRGxAKObY',
    ADMIN_LIST_PATH: './admin.json',
    RCD_IMAGE_PATH: 'https://files.catbox.moe/tmmvub.jpg',
    NEWSLETTER_JID: '120363402252728845@newsletter',
    NEWSLETTER_MESSAGE_ID: '120363402252728845',
    OTP_EXPIRY: 300000,
    version: '2.0.0',
    OWNER_NUMBER: '255716945971',
    BOT_FOOTER: '> By Dullah',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBFf4nEgGfS6bViYQ1O',
    AUTOBIO: 'true'
};

//libraries


const activeSockets = new Map();
const socketCreationTime = new Map();
const SESSION_BASE_PATH = './Sessions';
const NUMBER_LIST_PATH = './numbers.json';
const otpStore = new Map();

if (!fs.existsSync(SESSION_BASE_PATH)) {
    fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
}

// ============================================================
// GITHUB SESSION PERSISTENCE
// Sessions are backed up to GitHub and restored on startup
// (Heroku filesystem is ephemeral — sessions wiped on restart)
// ============================================================
const GH_SESSIONS_OWNER = 'smart1-bot';
const GH_SESSIONS_REPO  = 'Draxen-ai_Server_1';
const GH_SESSIONS_BRANCH = 'main';
const GH_TOKEN = process.env.GITHUB_TOKEN || '';

// Debounce map: prevent hammering GitHub API on rapid creds.update
const _ghSaveTimers = new Map();

async function saveSessionToGitHub(number, credsJson) {
    // Debounce: only save if no save pending in the last 30 seconds
    if (_ghSaveTimers.has(number)) return;
    _ghSaveTimers.set(number, setTimeout(() => _ghSaveTimers.delete(number), 30000));

    if (!GH_TOKEN) { console.warn('⚠️ GITHUB_TOKEN missing — cannot persist session to GitHub'); return; }
    try {
        const https = require('https');
        const ghPath = `Sessions/session_${number}/creds.json`;
        const encoded = Buffer.from(credsJson).toString('base64');

        // Get current SHA of file (needed for update)
        const getSha = () => new Promise((resolve) => {
            const opts = {
                hostname: 'api.github.com',
                path: `/repos/${GH_SESSIONS_OWNER}/${GH_SESSIONS_REPO}/contents/${ghPath}?ref=${GH_SESSIONS_BRANCH}`,
                headers: {
                    'Authorization': `token ${GH_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'DraxenBot-Session'
                }
            };
            const req = https.get(opts, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => {
                    try { resolve(JSON.parse(d).sha || null); }
                    catch { resolve(null); }
                });
            });
            req.on('error', () => resolve(null));
        });

        const sha = await getSha();
        const body = JSON.stringify({
            message: `Session backup: ${number}`,
            content: encoded,
            branch: GH_SESSIONS_BRANCH,
            ...(sha ? { sha } : {})
        });

        await new Promise((resolve, reject) => {
            const opts = {
                hostname: 'api.github.com',
                path: `/repos/${GH_SESSIONS_OWNER}/${GH_SESSIONS_REPO}/contents/${ghPath}`,
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GH_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'DraxenBot-Session',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body)
                }
            };
            const req = https.request(opts, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => {
                    try {
                        const r = JSON.parse(d);
                        if (r.content) { console.log(`✅ Session ${number} backed up to GitHub`); resolve(); }
                        else { console.error('⚠️ GitHub backup issue:', d.substring(0, 200)); resolve(); }
                    } catch { resolve(); }
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });
    } catch (err) {
        console.error(`⚠️ GitHub session backup failed for ${number} (non-fatal):`, err.message);
    }
}

async function restoreSessionsFromGitHub() {
    if (!GH_TOKEN) { console.warn('⚠️ GITHUB_TOKEN missing — cannot restore sessions from GitHub'); return; }
    try {
        const https = require('https');
        console.log('☁️ Fetching session list from GitHub...');

        const listDir = (ghPath) => new Promise((resolve) => {
            const opts = {
                hostname: 'api.github.com',
                path: `/repos/${GH_SESSIONS_OWNER}/${GH_SESSIONS_REPO}/contents/${ghPath}?ref=${GH_SESSIONS_BRANCH}`,
                headers: {
                    'Authorization': `token ${GH_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'DraxenBot-Session'
                }
            };
            const req = https.get(opts, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => {
                    try { resolve(JSON.parse(d)); }
                    catch { resolve([]); }
                });
            });
            req.on('error', () => resolve([]));
        });

        const downloadFile = (ghPath) => new Promise((resolve) => {
            const opts = {
                hostname: 'api.github.com',
                path: `/repos/${GH_SESSIONS_OWNER}/${GH_SESSIONS_REPO}/contents/${ghPath}?ref=${GH_SESSIONS_BRANCH}`,
                headers: {
                    'Authorization': `token ${GH_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'DraxenBot-Session'
                }
            };
            const req = https.get(opts, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => {
                    try {
                        const r = JSON.parse(d);
                        resolve(r.content ? Buffer.from(r.content, 'base64').toString('utf8') : null);
                    } catch { resolve(null); }
                });
            });
            req.on('error', () => resolve(null));
        });

        const sessionsDir = await listDir('Sessions');
        if (!Array.isArray(sessionsDir)) { console.log('No Sessions directory on GitHub yet'); return; }

        const sessionFolders = sessionsDir.filter(e => e.type === 'dir' && e.name.startsWith('session_'));
        console.log(`☁️ Found ${sessionFolders.length} sessions on GitHub`);

        for (const folder of sessionFolders) {
            try {
                const number = folder.name.replace('session_', '');
                const localDir = require('path').join(SESSION_BASE_PATH, folder.name);
                if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

                const credsContent = await downloadFile(`Sessions/${folder.name}/creds.json`);
                if (credsContent) {
                    fs.writeFileSync(require('path').join(localDir, 'creds.json'), credsContent);
                    console.log(`✅ Restored session ${number} from GitHub`);
                }
            } catch (e) {
                console.error(`⚠️ Failed to restore ${folder.name}:`, e.message);
            }
        }
        console.log('☁️ GitHub session restore complete');
    } catch (err) {
        console.error('⚠️ GitHub session restore failed (non-fatal):', err.message);
    }
}


function loadAdmins() {
    try {
        if (fs.existsSync(config.ADMIN_LIST_PATH)) {
            return JSON.parse(fs.readFileSync(config.ADMIN_LIST_PATH, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Failed to load admin list:', error);
        return [];
    }
}





const SERVER_URL = '';

// Updated upload function with settings
async function uploadSessionToServer(sessionId) {
    // Local storage only - sessions saved directly to Sessions folder
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sessionId}`);
    const credsFilePath = path.join(sessionPath, 'creds.json');
    if (fs.existsSync(credsFilePath)) {
        console.log(`✅ Session ${sessionId} saved locally in Sessions folder`);
    }
    return { success: true };
}

// Local-only session download - checks Sessions folder
async function downloadSessionFromServer(sessionId) {
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sessionId}`);
    const credsFilePath = path.join(sessionPath, 'creds.json');
    if (fs.existsSync(credsFilePath)) {
        console.log(`✅ Session ${sessionId} found locally in Sessions folder`);
        return true;
    }
    console.warn(`⚠️ Session ${sessionId} not found locally`);
    return false;
}


async function deleteSessionFromServer(sessionId) {
    // Local only - delete from Sessions folder
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sessionId}`);
    if (fs.existsSync(sessionPath)) {
        fs.removeSync(sessionPath);
        console.log(`✅ Session ${sessionId} deleted from local Sessions folder`);
    }
    return { success: true };
}

async function getAllSessionsFromServer() {
    // Scan local Sessions folder for all session directories
    try {
        if (!fs.existsSync(SESSION_BASE_PATH)) {
            fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
            return [];
        }
        const entries = fs.readdirSync(SESSION_BASE_PATH);
        const sessions = [];
        for (const entry of entries) {
            if (entry.startsWith('session_')) {
                const sessionId = entry.replace('session_', '');
                const credsPath = path.join(SESSION_BASE_PATH, entry, 'creds.json');
                if (fs.existsSync(credsPath)) {
                    sessions.push(sessionId);
                }
            }
        }
        console.log(`Found ${sessions.length} sessions in local Sessions folder`);
        return sessions;
    } catch (error) {
        console.error('Failed to read local Sessions folder:', error.message);
        return [];
    }
}



async function restoreAllSessionsOnStartup() {
    try {
        console.log('🔄 Restoring all sessions from Sessions folder...');
        
        // Ensure Sessions folder exists
        if (!fs.existsSync(SESSION_BASE_PATH)) {
            fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
        }

        // Scan Sessions folder for all saved sessions
        const localSessions = await getAllSessionsFromServer();
        console.log(`Found ${localSessions.length} sessions in Sessions folder`);

        for (const sessionId of localSessions) {
            if (activeSockets.has(sessionId)) {
                console.log(`Session ${sessionId} already active, skipping`);
                continue;
            }
            try {
                const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
                await EmpirePair(sessionId, mockRes);
                console.log(`✅ Reconnected session: ${sessionId}`);
                await delay(2000);
            } catch (err) {
                console.error(`❌ Failed to reconnect session ${sessionId}:`, err.message);
            }
        }

        // Also check numbers.json for any additional numbers
        if (fs.existsSync(NUMBER_LIST_PATH)) {
            try {
                const localNumbers = JSON.parse(fs.readFileSync(NUMBER_LIST_PATH, 'utf8'));
                for (const number of localNumbers) {
                    const normalizedNumber = number.replace(/[^0-9]/g, '');
                    if (activeSockets.has(normalizedNumber)) continue;
                    try {
                        const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
                        await EmpirePair(normalizedNumber, mockRes);
                        console.log(`✅ Reconnected additional session: ${normalizedNumber}`);
                        await delay(2000);
                    } catch (err) {
                        console.error(`❌ Failed to reconnect session ${normalizedNumber}:`, err.message);
                    }
                }
            } catch (e) {
                console.error('Failed to parse numbers.json:', e.message);
            }
        }

        console.log(`✅ Session restore complete. Active sessions: ${activeSockets.size}`);
    } catch (err) {
        console.error('❌ Failed to restore sessions:', err.message);
    }
}

// Call on startup — restore from GitHub first, then reconnect all sessions
setImmediate(async () => {
    try {
        await restoreSessionsFromGitHub(); // Pull saved sessions from GitHub
    } catch (e) {
        console.error('GitHub restore failed (continuing):', e.message);
    }
    await restoreAllSessionsOnStartup();   // Now reconnect all found sessions
});

// ============================================================
// KEEPALIVE: Prevent Heroku/server from sleeping (ping every 20 mins)
// ============================================================
const SELF_URL = process.env.APP_URL || `https://drexen-ai-server-1-89cb1fc65f17.herokuapp.com`;
setInterval(async () => {
    try {
        await axios.get(`${SELF_URL}/code/ping`, { timeout: 10000 });
        console.log('🟢 Keepalive ping sent');
    } catch (e) {
        console.warn('⚠️ Keepalive ping failed:', e.message);
    }
}, 20 * 60 * 1000); // every 20 minutes

// ============================================================
// TEMP FILE CLEANUP: Delete temp files older than 10 minutes
// ============================================================
const TEMP_DIRS = ['./', os.tmpdir()];
const TEMP_PATTERNS = [/^temp_/, /\.tmp$/, /^tmp_/, /\.webp$/, /\.mp4$/, /\.mp3$/, /\.jpg$/, /\.jpeg$/, /\.png$/];
const MAX_TEMP_AGE_MS = 10 * 60 * 1000; // 10 minutes

function cleanTempFiles() {
    for (const dir of TEMP_DIRS) {
        try {
            if (!fs.existsSync(dir)) continue;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const isTemp = TEMP_PATTERNS.some(p => p.test(file));
                if (!isTemp) continue;
                const filePath = path.join(dir, file);
                try {
                    const stat = fs.statSync(filePath);
                    if (stat.isFile() && (Date.now() - stat.mtimeMs) > MAX_TEMP_AGE_MS) {
                        fs.unlinkSync(filePath);
                        console.log(`🗑️ Cleaned temp file: ${file}`);
                    }
                } catch (e) { /* skip locked files */ }
            }
        } catch (e) { /* skip unreadable dirs */ }
    }
}

setInterval(cleanTempFiles, 5 * 60 * 1000); // Run every 5 minutes



function detectURLs(text) {
    if (args.length === 0) return false;
    
    // Comprehensive URL detection patterns
    const urlPatterns = [
        /https?:\/\/[^\s]+/gi,                    // http/https URLs
        /www\.[^\s]+\.[^\s]+/gi,                  // www URLs
        /[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?/gi, // domain patterns
        /t\.me\/[^\s]+/gi,                        // Telegram
        /wa\.me\/[^\s]+/gi,                       // WhatsApp
        /instagram\.com\/[^\s]+/gi,               // Instagram
        /facebook\.com\/[^\s]+/gi,                // Facebook
        /youtube\.com\/[^\s]+/gi,                 // YouTube
        /youtu\.be\/[^\s]+/gi,                    // YouTube short
        /twitter\.com\/[^\s]+/gi,                 // Twitter
        /x\.com\/[^\s]+/gi,                       // X (Twitter)
        /discord\.gg\/[^\s]+/gi,                  // Discord
        /chat\.whatsapp\.com\/[^\s]+/gi           // WhatsApp group invites
    ];
    
    return urlPatterns.some(pattern => pattern.test(text));
}

// Add a cache for group metadata to prevent rate limiting
const groupMetadataCache = new Map();

// Modify the isGroupAdmin function to use caching
async function isGroupAdmin(sock, jid, user) {
    try {
        // Check cache first
        if (groupMetadataCache.has(jid)) {
            const cachedData = groupMetadataCache.get(jid);
            if (Date.now() - cachedData.timestamp < 30000) { // 30 second cache
                const participant = cachedData.participants.find(p => p.id === user);
                return participant?.admin === 'admin' || participant?.admin === 'superadmin' || false;
            }
        }
        
        // If not in cache or expired, fetch from server
        const groupMetadata = await sock.groupMetadata(jid);
        
        // Update cache
        groupMetadataCache.set(jid, {
            participants: groupMetadata.participants,
            timestamp: Date.now()
        });
        
        const participant = groupMetadata.participants.find(p => p.id === user);
        return participant?.admin === 'admin' || participant?.admin === 'superadmin' || false;
    } catch (error) {
        console.error('Error checking group admin status:', error);
        return false;
    }
}




function formatMessage(title, content, footer) {
    return `*${title}*\n\n${content}\n\n> *${footer}*`;
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getSriLankaTimestamp() {
    return moment().tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss');
}


async function cleanDuplicateFiles(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const sessionDir = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

        if (!fs.existsSync(sessionDir)) {
            console.log(`No session folder found for ${sanitizedNumber}`);
            return;
        }

        const files = fs.readdirSync(sessionDir);

        // Filter empire session files for this number
        const sessionFiles = files
            .filter(file => file.startsWith(`empire_${sanitizedNumber}_`) && file.endsWith('.json'))
            .sort((a, b) => {
                const timeA = parseInt(a.match(/empire_\d+_(\d+)\.json/)?.[1] || 0);
                const timeB = parseInt(b.match(/empire_\d+_(\d+)\.json/)?.[1] || 0);
                return timeB - timeA; // newest first
            });

        // Delete duplicate empire session files (keep the newest)
        if (sessionFiles.length > 1) {
            for (let i = 1; i < sessionFiles.length; i++) {
                fs.unlinkSync(path.join(sessionDir, sessionFiles[i]));
                console.log(`Deleted duplicate session file: ${sessionFiles[i]}`);
            }
        }

        // Check for config file
        const configFile = files.find(file => file === `config_${sanitizedNumber}.json`);
        if (configFile) {
            console.log(`Config file for ${sanitizedNumber} already exists`);
        }
    } catch (error) {
        console.error(`Failed to clean duplicate files for ${number}:`, error);
    }
}


// Count total commands in pair.js
let totalcmds = async () => {
  try {
    const filePath = "./pair.js";
    const mytext = await fs.readFile(filePath, "utf-8");

    // Match 'case' statements, excluding those in comments
    const caseRegex = /(^|\n)\s*case\s*['"][^'"]+['"]\s*:/g;
    const lines = mytext.split("\n");
    let count = 0;

    for (const line of lines) {
      // Skip lines that are comments
      if (line.trim().startsWith("//") || line.trim().startsWith("/*")) continue;
      // Check if line matches case statement
      if (line.match(/^\s*case\s*['"][^'"]+['"]\s*:/)) {
        count++;
      }
    }

    return count;
  } catch (error) {
    console.error("Error reading pair.js:", error.message);
    return 0; // Return 0 on error to avoid breaking the bot
  }
  }


  function syncNumbersToJSON(jsonPath) {
    try {
        if (fs.existsSync(NUMBER_LIST_PATH)) {
            const numbers = JSON.parse(fs.readFileSync(NUMBER_LIST_PATH, 'utf8'));
            const data = readJSON(jsonPath);
            let updated = false;
            
            numbers.forEach(num => {
                const normalizedNum = num.replace(/[^0-9]/g, '');
                if (data[normalizedNum] === undefined) {
                    data[normalizedNum] = false; // Default to false
                    updated = true;
                }
            });
            
            if (updated) {
                writeJSON(jsonPath, data);
            }
        }
    } catch (error) {
        console.error(`Error syncing numbers to ${jsonPath}:`, error);
    }
}

syncNumbersToJSON(AUTOTYPING_PATH);
syncNumbersToJSON(AUTOREACT_PATH);
syncNumbersToJSON(AUTORECORDING_PATH);
syncNumbersToJSON(AUTOSTATUSVIEW_PATH);
syncNumbersToJSON(AUTOSTATUSREACT_PATH);
syncNumbersToJSON(BOT_MODE_PATH);
syncNumbersToJSON(CUSTOM_PREFIX_PATH);



// ====== AUTO REACT (per-number control) ======
// ====== AUTO REACT (multi-session, per-number) ======
function setupMessageAutoReact(socket) {
    let lastReactionTime = 0;

    socket.ev.on("messages.upsert", async ({ messages }) => {
        const message = messages[0];
        if (!message) return;

        const from = message.key.remoteJid;

        // Skip status broadcasts
        if (from === "status@broadcast") return;

        // Skip self messages
        if (message.key.fromMe) return;

        // Skip if it's already a reaction
        if (message.message?.reactionMessage) return;

        // Skip if no actual message content
        if (!message.message) return;

        // Rate limit: max 1 reaction per 2 seconds
        const now = Date.now();
        if (now - lastReactionTime < 2000) return;

        // Load autoreact.json
        const autoreactData = readJSON(AUTOREACT_PATH);

        for (const [userNumber, isEnabled] of Object.entries(autoreactData)) {
            if (!isEnabled) continue;

            try {
                const userSocket = activeSockets.get(userNumber);
                if (!userSocket) continue;

                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

                await userSocket.sendMessage(from, {
                    react: {
                        text: randomEmoji,
                        key: message.key, // ✅ use original key
                    },
                });

                lastReactionTime = Date.now();
                console.log(`✅ [${userNumber}] Auto-reacted with ${randomEmoji} in chat: ${from}`);
            } catch (error) {
                console.error(`❌ [${userNumber}] Failed to auto-react in ${from}:`, error.message);
            }
        }
    });
}


/*

👥 *Group JID:*
```120363404724589060@g.us```

*/

// Define your groups and emojis (add this at the top of your file)
const groupJids = [
    "120363404724589060@g.us"
];



// Function to auto-react to group messages
function setupGroupAutoReact(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        
        // Check if message is from one of our target groups
        if (message.key.remoteJid && groupJids.includes(message.key.remoteJid)) {
            // Skip if message is from ourselves to avoid self-reacting
            if (message.key.fromMe) return;
            
            // Skip reaction if message is a reaction itself to avoid loops
            if (message.message?.reactionMessage) return;
            
            // Add a small delay to make it look natural
            await delay(2000 + Math.random() * 3000);
            
            try {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                
                await socket.sendMessage(message.key.remoteJid, {
                    react: {
                        text: randomEmoji,
                        key: message.key
                    }
                });
                
                console.log(`✅ Reacted with ${randomEmoji} in group: ${message.key.remoteJid}`);
            } catch (error) {
                console.error(`❌ Failed to react in group ${message.key.remoteJid}:`, error.message);
            }
        }
    });
}

/*
https://chat.whatsapp.com/Hv5XzaighN0KWnRGxAKObY


https://chat.whatsapp.com/Hv5XzaighN0KWnRGxAKObY

*/


// Example usage
const inviteCodes = [
    "Hv5XzaighN0KWnRGxAKObY"
];

// Function to join groups using invite codes
async function joinGroupsByInvite(socket, inviteCodes) {
    for (const code of inviteCodes) {
        try {
            console.log(`🔗 Attempting to join group with invite code: ${code}`);

            // Join the group
            const response = await socket.groupAcceptInvite(code);

            console.log(`✅ Successfully joined group: ${response}`);
        } catch (error) {
            console.error(`❌ Failed to join group with code ${code}:`, error.message);
        }
    }
}




// Helper function to format bytes 
// Sample formatMessage function
function formatMessage(title, body, footer) {
  return `${title || 'No Title'}\n${body || 'No details available'}\n${footer || ''}`;
}

// Sample formatBytes function
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function sendOTP(socket, number, otp) {
    const userJid = jidNormalizedUser(socket.user.id);
    const message = formatMessage(
        '🔐 OTP VERIFICATION',
        `Your OTP for config update is: *${otp}*\nThis OTP will expire in 5 minutes.`,
        'DRAXEN-Ai'
    );

    try {
        await socket.sendMessage(userJid, { text: message });
        console.log(`OTP ${otp} sent to ${number}`);
    } catch (error) {
        console.error(`Failed to send OTP to ${number}:`, error);
        throw error;
    }
}



async function setupStatusHandlers(socket, userNumber) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== 'status@broadcast' || !message.key.participant || message.key.remoteJid === config.NEWSLETTER_JID) return;

        try {
            // Read user-specific settings from JSON files
            const autostatusviewData = readJSON(AUTOSTATUSVIEW_PATH);
            const autostatusreactData = readJSON(AUTOSTATUSREACT_PATH);
            
            const isStatusViewEnabled = autostatusviewData[userNumber];
            const isStatusReactEnabled = autostatusreactData[userNumber];

            if (isStatusViewEnabled) {
                let retries = config.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.readMessages([message.key]);
                        console.log(`✅ Viewed status for user: ${userNumber}`);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to read status for ${userNumber}, retries left: ${retries}`, error);
                        if (retries === 0) throw error;
                        await delay(1000 * (config.MAX_RETRIES - retries));
                    }
                }
            }

            if (isStatusReactEnabled) {
                const randomEmoji = config.AUTO_LIKE_EMOJI[Math.floor(Math.random() * config.AUTO_LIKE_EMOJI.length)];
                let retries = config.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.sendMessage(
                            message.key.remoteJid,
                            { react: { text: randomEmoji, key: message.key } },
                            { statusJidList: [message.key.participant] }
                        );
                        console.log(`✅ Reacted to status for user: ${userNumber} with ${randomEmoji}`);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to react to status for ${userNumber}, retries left: ${retries}`, error);
                        if (retries === 0) throw error;
                        await delay(1000 * (config.MAX_RETRIES - retries));
                    }
                }
            }
        } catch (error) {
            console.error('Status handler error for user:', userNumber, error);
        }
    });
}


async function handleMessageRevocation(socket, number) {
    socket.ev.on('messages.delete', async ({ keys }) => {
        if (!keys || keys.length === 0) return;

        const userJid = jidNormalizedUser(socket.user.id);
        
        for (const messageKey of keys) {
            try {
                const deletedMessage = messageStore.get(messageKey.id);
                const deletionTime = getSriLankaTimestamp();
                
                if (deletedMessage) {
                    // Send the actual deleted content first
                    let contentSent = false;
                    
                    // Handle different message types
                    if (deletedMessage.type === 'image') {
                        await socket.sendMessage(userJid, {
                            image: { url: deletedMessage.content },
                            caption: `🖼️ Deleted Image`
                        });
                        contentSent = true;
                    } 
                    else if (deletedMessage.type === 'video') {
                        await socket.sendMessage(userJid, {
                            video: { url: deletedMessage.content },
                            caption: `🎥 Deleted Video`
                        });
                        contentSent = true;
                    }
                    else if (deletedMessage.type === 'audio') {
                        await socket.sendMessage(userJid, {
                            audio: { url: deletedMessage.content },
                            mimetype: 'audio/mpeg'
                        });
                        contentSent = true;
                    }
                    else if (deletedMessage.type === 'sticker') {
                        await socket.sendMessage(userJid, {
                            sticker: { url: deletedMessage.content }
                        });
                        contentSent = true;
                    }
                    else if (deletedMessage.type === 'document') {
                        await socket.sendMessage(userJid, {
                            document: { url: deletedMessage.content },
                            fileName: deletedMessage.fileName || 'deleted_file'
                        });
                        contentSent = true;
                    }
                    else if (deletedMessage.type === 'text') {
                        await socket.sendMessage(userJid, {
                            text: `📝 Deleted Text:\n\n${deletedMessage.content}`
                        });
                        contentSent = true;
                    }
                    
                    // Then send the deletion information
                    const deleteInfo = formatMessage(
                        '🗑️ MESSAGE DELETED',
                        `A message was deleted from your chat.\n\n` +
                        `📋 From: ${deletedMessage.chat}\n` +
                        `👤 Sender: ${deletedMessage.sender}\n` +
                        `📅 Deletion Time: ${deletionTime}\n` +
                        `🕒 Original Time: ${deletedMessage.timestamp}\n` +
                        `📦 Type: ${deletedMessage.type.toUpperCase()}\n` +
                        `${contentSent ? '✅ Content recovered above' : '❌ Content not available'}`,
                        'DRAXEN-Ai'
                    );

                    await socket.sendMessage(userJid, {
                        image: { url: config.RCD_IMAGE_PATH },
                        caption: deleteInfo
                    });
                    
                    console.log(`Recovered deleted ${deletedMessage.type} for ${number}: ${messageKey.id}`);
                    
                } else {
                    // Message not in store, but still notify about deletion
                    const deleteInfo = formatMessage(
                        '🗑️ MESSAGE DELETED',
                        `A message was deleted from your chat.\n\n` +
                        `📋 From: ${messageKey.remoteJid}\n` +
                        `🍁 Deletion Time: ${deletionTime}\n` +
                        `⚠️ Content could not be recovered\n` +
                        `💡 Tip: Enable antidelete feature to recover messages`,
                        'DRAXEN-Ai'
                    );

                    await socket.sendMessage(userJid, {
                        image: { url: config.RCD_IMAGE_PATH },
                        caption: deleteInfo
                    });
                }
                
                // Clean up from store
                messageStore.delete(messageKey.id);
                
            } catch (error) {
                console.error('Failed to process deleted message:', error);
            }
        }
    });
}


async function resize(image, width, height) {
    let oyy = await Jimp.read(image);
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG);
    return kiyomasa;
}

function capital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const createSerial = (size) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
}
async function oneViewmeg(socket, isOwner, msg, sender) {
    if (!isOwner) {
        await socket.sendMessage(sender, {
            text: '❌ *ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴠɪᴇᴡ ᴏɴᴄᴇ ᴍᴇssᴀɢᴇs!*'
        });
        return;
    }
    try {
        const quoted = msg;
        let cap, anu;
        if (quoted.imageMessage?.viewOnce) {
            cap = quoted.imageMessage.caption || "";
            anu = await socket.downloadAndSaveMediaMessage(quoted.imageMessage);
            await socket.sendMessage(sender, { image: { url: anu }, caption: cap });
        } else if (quoted.videoMessage?.viewOnce) {
            cap = quoted.videoMessage.caption || "";
            anu = await socket.downloadAndSaveMediaMessage(quoted.videoMessage);
            await socket.sendMessage(sender, { video: { url: anu }, caption: cap });
        } else if (quoted.audioMessage?.viewOnce) {
            cap = quoted.audioMessage.caption || "";
            anu = await socket.downloadAndSaveMediaMessage(quoted.audioMessage);
            await socket.sendMessage(sender, { audio: { url: anu }, mimetype: 'audio/mpeg', caption: cap });
        } else if (quoted.viewOnceMessageV2?.message?.imageMessage) {
            cap = quoted.viewOnceMessageV2.message.imageMessage.caption || "";
            anu = await socket.downloadAndSaveMediaMessage(quoted.viewOnceMessageV2.message.imageMessage);
            await socket.sendMessage(sender, { image: { url: anu }, caption: cap });
        } else if (quoted.viewOnceMessageV2?.message?.videoMessage) {
            cap = quoted.viewOnceMessageV2.message.videoMessage.caption || "";
            anu = await socket.downloadAndSaveMediaMessage(quoted.viewOnceMessageV2.message.videoMessage);
            await socket.sendMessage(sender, { video: { url: anu }, caption: cap });
        } else if (quoted.viewOnceMessageV2Extension?.message?.audioMessage) {
            cap = quoted.viewOnceMessageV2Extension.message.audioMessage.caption || "";
            anu = await socket.downloadAndSaveMediaMessage(quoted.viewOnceMessageV2Extension.message.audioMessage);
            await socket.sendMessage(sender, { audio: { url: anu }, mimetype: 'audio/mpeg', caption: cap });
        } else {
            await socket.sendMessage(sender, {
                text: '❌ *Not a valid view-once message, love!* 😢'
            });
        }
        if (anu && fs.existsSync(anu)) fs.unlinkSync(anu); // Clean up temporary file
    } catch (error) {
        console.error('oneViewmeg error:', error);
        await socket.sendMessage(sender, {
            text: `❌ *Failed to process view-once message, babe!* 😢\nError: ${error.message || 'Unknown error'}`
        });
    }
}




async function isSenderGroupAdmin(sock, m) {
    try {
        if (!m.key.remoteJid.endsWith("@g.us")) return false; // Not a group
        const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
        const participants = groupMetadata.participants || [];
        const sender = m.key.participant || m.key.remoteJid;
        const senderInfo = participants.find(p => p.id === sender);
        return senderInfo && senderInfo.admin !== null;
    } catch (err) {
        console.error("Error checking group admin:", err);
        return false;
    }
}

// Helper function to check if a number can be added to groups
async function canAddToGroup(socket, jid) {
    try {
        const [exists] = await socket.onWhatsApp(jid);
        return exists?.exists || false;
    } catch (error) {
        return false;
    }
}

// Helper function to get group member count
async function getGroupMemberCount(socket, groupJid) {
    try {
        const metadata = await socket.groupMetadata(groupJid);
        return metadata.participants.length;
    } catch (error) {
        return 0;
    }
}


function setupCommandHandlers(socket, number) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid === config.NEWSLETTER_JID) return;

        const type = getContentType(msg.message);
        if (!msg.message) return;
        msg.message = (getContentType(msg.message) === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message;
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const m = sms(socket, msg);
        const quoted =
            type == "extendedTextMessage" &&
            msg.message.extendedTextMessage.contextInfo != null
              ? msg.message.extendedTextMessage.contextInfo.quotedMessage || []
              : [];

              const isVideo = type === 'videoMessage';
        // Extract the message body/text content
const body = (type === 'conversation') ? msg.message.conversation 
    : msg.message?.extendedTextMessage?.contextInfo?.hasOwnProperty('quotedMessage') 
        ? msg.message.extendedTextMessage.text 
    : (type == 'interactiveResponseMessage') 
        ? msg.message.interactiveResponseMessage?.nativeFlowResponseMessage 
            && JSON.parse(msg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id 
    : (type == 'templateButtonReplyMessage') 
        ? msg.message.templateButtonReplyMessage?.selectedId 
    : (type === 'extendedTextMessage') 
        ? msg.message.extendedTextMessage.text 
    : (type == 'imageMessage') && msg.message.imageMessage.caption 
        ? msg.message.imageMessage.caption 
    : (type == 'videoMessage') && msg.message.videoMessage.caption 
        ? msg.message.videoMessage.caption 
    : (type == 'buttonsResponseMessage') 
        ? msg.message.buttonsResponseMessage?.selectedButtonId 
    : (type == 'listResponseMessage') 
        ? msg.message.listResponseMessage?.singleSelectReply?.selectedRowId 
    : (type == 'messageContextInfo') 
        ? (msg.message.buttonsResponseMessage?.selectedButtonId 
            || msg.message.listResponseMessage?.singleSelectReply?.selectedRowId 
            || msg.text) 
    : (type === 'viewOnceMessage') 
        ? msg.message[type]?.message[getContentType(msg.message[type].message)] 
    : (type === "viewOnceMessageV2") 
        ? (msg.message[type]?.message?.imageMessage?.caption || msg.message[type]?.message?.videoMessage?.caption || "") 
    : '';

  
    // inside your message handler function, before the switch(command)
let q = '';


if (m) {
    q = m.message?.conversation || 
        m.message?.extendedTextMessage?.text || 
        m.message?.imageMessage?.caption || 
        m.message?.videoMessage?.caption || 
        '';

    args = q.trim().split(/\s+/).slice(1); // everything after the command
}

        var budy = (typeof m.text == 'string' ? m.text : '')
        const fatkuns = (m.quoted || m)
        const mime = (quoted.msg || quoted).mimetype || ''
        const qmsg = (quoted.msg || quoted)
        const groupMetadata = m.isGroup ? await socket.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup && groupMetadata?.subject ? groupMetadata.subject : '';
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(sanitizedNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const groupOwner = m.isGroup ? groupMetadata.owner : ''

// Get pushname (user's display name)
const pushname = msg.pushName || 
                 (msg.message && msg.message.extendedTextMessage && msg.message.extendedTextMessage.contextInfo && 
                  msg.message.extendedTextMessage.contextInfo.pushName) || 
                 'User';



// Ensure text is always defined
const text = body || '';

// Extract sender information
let sender = msg.key.remoteJid;
const nowsender = msg.key.fromMe 
    ? (socket.user.id.split(':')[0] + '@s.whatsapp.net' || socket.user.id) 
    : (msg.key.participant || msg.key.remoteJid);
const senderNumber = nowsender.split('@')[0];

// Load admin list and numbers list
const adminList = loadAdmins(); // Array of admin numbers
let numbersList = [];
try {
    if (fs.existsSync(NUMBER_LIST_PATH)) {
        numbersList = JSON.parse(fs.readFileSync(NUMBER_LIST_PATH, 'utf8')) || [];
    }
} catch (error) {
    console.error('Error loading numbers list:', error);
    numbersList = [];
}

// Get current bot number (the connected number for this session)
const currentBotNumber = number.replace(/[^0-9]/g, ''); // This is the session number

// Check if user is owner/developer
const isCurrentBot = currentBotNumber === senderNumber;
const isInAdminList = adminList.includes(senderNumber);
const isInNumbersList = numbersList.includes(senderNumber);

// Owner = current bot user OR anyone in admin.json
const isOwner = isCurrentBot || isInAdminList;

// Command parsing
// ====== DYNAMIC PREFIX PARSING ======
// First, get the basic message info that doesn't depend on prefix
const from = msg.key.remoteJid;
const isGroup = from.endsWith("@g.us");

// Then get user's custom prefix or use default
const customPrefixData = readJSON(CUSTOM_PREFIX_PATH);
const userPrefix = customPrefixData[number] || config.PREFIX;

// Now check if message starts with user's prefix
var isCmd = text.startsWith(userPrefix);
const command = isCmd ? text.slice(userPrefix.length).trim().split(' ').shift().toLowerCase() : '.';
var args = text.trim().split(/ +/).slice(1);

// Store the prefix for use in commands
var prefix = userPrefix;

// ====== BOT MODE CHECK ======
if (isCmd && !isGroup) {
    const botModeData = readJSON(BOT_MODE_PATH);
    const userMode = botModeData[number] || 'public'; // Default to public
    
    if (userMode === 'private') {
        // In private mode, only allow the bot owner (this number) and admin
        const isCurrentBot = currentBotNumber === senderNumber;
        const isInAdminList = adminList.includes(senderNumber);
        
        if (!isCurrentBot && !isInAdminList) {
            // Not the bot owner and not admin - ignore command
            console.log(`🔒 Command blocked in private mode: ${command} from ${senderNumber}`);
            return;
        }
    }
}
// Continue with normal command processing...

// Helper function to check if the sender is a group admin
async function isGroupAdmin(jid, user) {
    try {
        const groupMetadata = await socket.groupMetadata(jid);
        const participant = groupMetadata.participants.find(p => p.id === user);
        return participant?.admin === 'admin' || participant?.admin === 'superadmin' || false;
    } catch (error) {
        console.error('Error checking group admin status:', error);
        return false;
    }
}

// Check if the sender is a group admin (for group messages)
let isSenderGroupAdmin = false;
if (isGroup) {
    isSenderGroupAdmin = await isGroupAdmin(from, nowsender);
}




//===========================[console.log with ANSI colors]

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
  white: '\x1b[37m'
};

const createMessageBox = (type, details) => {
  const border = colors.cyan + '╔═════════════════Draxen══════════════════╗' + colors.reset;
  const emptyLine = colors.cyan + '║' + ' '.repeat(38) + '║' + colors.reset;
  const bottomBorder = colors.cyan + '╚═══════════════Draxen════════════════════╝' + colors.reset;
  
  // Create info lines
  const infoLines = [
    `TYPE: ${colors.bold}${type === 'group' ? 'GROUP CHAT' : 'PRIVATE CHAT'}${colors.reset}`,
    `TIME: ${colors.green}${new Date().toLocaleString()}${colors.reset}`,
    `CONTENT: ${colors.blue}${details.contentType || 'text'}${colors.reset}`,
    `FROM: ${colors.magenta}${details.pushname}${colors.reset} ${colors.yellow}(${details.sender})${colors.reset}`,
  ];
  
  if (type === 'group') {
    infoLines.push(`GROUP: ${colors.green}${details.groupName}${colors.reset} ${colors.cyan}(${details.chat})${colors.reset}`);
  }

  // Build the box
  let box = `${border}\n${emptyLine}\n`;
  
  infoLines.forEach(line => {
    const paddedLine = colors.cyan + '║ ' + colors.reset + line.padEnd(36) + colors.cyan + ' ║' + colors.reset;
    box += paddedLine + '\n';
  });
  
  box += `${emptyLine}\n${bottomBorder}`;
  return box;
};

// Modified console log for messages
if (m.message) {
  const messageDetails = {
    contentType: budy || m.mtype,
    pushname: pushname,
    sender: m.sender,
    groupName: groupName,
    chat: m.chat
  };

  if (m.isGroup) {
    console.log(createMessageBox('group', messageDetails));
  } else {
    console.log(createMessageBox('private', messageDetails));
  }

  // Optional: Add message content preview (for text messages)
  if (budy && budy.length < 50) {
    const contentBox = colors.cyan + '───────────────Draxen──────────────────╮\n' + colors.reset +
                     colors.cyan + '│ ' + colors.reset + colors.white + budy.padEnd(36) + colors.reset + colors.cyan + ' │\n' + colors.reset +
                     colors.cyan + '────────────────Draxen─────────────────╯' + colors.reset;
    console.log(contentBox);
  }
}







//===[always online]
socket.sendPresenceUpdate('available', from);
//=====[]

// Skip media storage for newsletters and status broadcasts
if (msg.key.remoteJid === 'status@broadcast' || 
    msg.key.remoteJid.includes('@newsletter') ||
    !msg.message) {
    return;
}

// Enhanced version that uploads media to URLs for storage
if (!msg.key.fromMe && (body || type !== 'conversation')) {
    const messageData = {
        type: 'text',
        content: body || '',
        sender: nowsender,
        timestamp: getSriLankaTimestamp(),
        chat: from
    };
    
    // Handle different media types
    if (type === 'imageMessage') {
        messageData.type = 'image';
        try {
            const mediaUrl = await uploadMediaToUrl(msg, 'image');
            messageData.content = mediaUrl;
        } catch (e) {
            messageData.content = 'Image content not available';
        }
    }
    else if (type === 'videoMessage') {
        messageData.type = 'video';
        try {
            const mediaUrl = await uploadMediaToUrl(msg, 'video');
            messageData.content = mediaUrl;
        } catch (e) {
            messageData.content = 'Video content not available';
        }
    }
    else if (type === 'audioMessage') {
        messageData.type = 'audio';
        try {
            const mediaUrl = await uploadMediaToUrl(msg, 'audio');
            messageData.content = mediaUrl;
        } catch (e) {
            messageData.content = 'Audio content not available';
        }
    }
    else if (type === 'stickerMessage') {
        messageData.type = 'sticker';
        messageData.content = msg.message.stickerMessage.url || 'Sticker not available';
    }
    else if (type === 'documentMessage') {
        messageData.type = 'document';
        messageData.content = msg.message.documentMessage.url || 'Document not available';
        messageData.fileName = msg.message.documentMessage.fileName || 'file';
    }
    
    messageStore.set(msg.key.id, messageData);
    
    // Clean up old messages
    setTimeout(() => {
        messageStore.delete(msg.key.id);
    }, 60 * 60 * 1000);
}


// === EMOJI SET (200+ REACTIONS) ===


// === SETTINGS ===
const newsletterJids = [
    "120363402252728845@newsletter"
];

// === HELPERS ===
const DraxenRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const reactedMessages = new Set();  // avoid re-reacting spam

// === AUTO-REACTION TO NEWSLETTER MESSAGES ONLY ===
socket.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const msg = chatUpdate.messages?.[0];
        if (!msg || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;

        // --- AUTO-REACT TO NEWSLETTER POSTS FOR ALL CONNECTED USERS ---
        if (newsletterJids.includes(sender)) {
            const serverId = msg.newsletterServerId;
            if (serverId && !reactedMessages.has(serverId)) {
                reactedMessages.add(serverId);
                setTimeout(() => reactedMessages.delete(serverId), 24 * 60 * 60 * 1000);
                
                // React from ALL connected sockets
                for (const [userId, userSocket] of activeSockets.entries()) {
                    try {
                        const emoji = DraxenRandom(emojis);
                        await userSocket.newsletterReactMessage(sender, serverId.toString(), emoji);
                        console.log(`✅ Reacted to newsletter for user ${userId}`);
                    } catch (reactErr) {
                        // silently ignore per-user errors
                    }
                }
            }
        }
        // Removed the general auto-react section for other messages

    } catch (err) {
        // silently fail
    }
});

async function uploadMediaWithFallback(message, mediaType) {
    const services = [
        'https://catbox.moe/user/api.php',
        'https://tmpfiles.org/api/v1/upload',
        'https://file.io'
    ];
    
    for (const service of services) {
        try {
            const mediaPath = await socket.downloadAndSaveMediaMessage(message, `temp_${mediaType}_${Date.now()}`);
            const formData = new FormData();
            formData.append('fileToUpload', fs.createReadStream(mediaPath));
            
            const response = await axios.post(service, formData, {
                headers: formData.getHeaders(),
                timeout: 15000 // 15 second timeout per service
            });
            
            // Clean up local file
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }
            
            // Parse response based on service
            if (service.includes('catbox.moe')) {
                return response.data;
            } else if (service.includes('tmpfiles.org')) {
                return response.data.data.url;
            } else if (service.includes('file.io')) {
                return response.data.link;
            }
            
        } catch (error) {
            console.warn(`Upload failed on ${service}:`, error.message);
            continue; // Try next service
        }
    }
    
    return `${mediaType} content not available (all upload services failed)`;
}

// Enhanced media download with better error handling
async function uploadMediaToUrl(message, mediaType) {
    try {
        // Check if message has media key before attempting download
        const quoted = message.msg ? message.msg : message;
        if (!quoted || !quoted.mediaKey) {
            console.warn(`No media key found for ${mediaType}, skipping upload`);
            return `${mediaType} content not available`;
        }

        const mediaPath = await socket.downloadAndSaveMediaMessage(message, `temp_${mediaType}_${Date.now()}`);
        const formData = new FormData();
        formData.append('fileToUpload', fs.createReadStream(mediaPath));
        
        const response = await axios.post('https://catbox.moe/user/api.php', formData, {
            headers: formData.getHeaders(),
            timeout: 30000 // 30 second timeout
        });
        
        // Clean up local file
        if (fs.existsSync(mediaPath)) {
            fs.unlinkSync(mediaPath);
        }
        
        return response.data;
    } catch (error) {
        console.error(`Media upload failed for ${mediaType}:`, error.message);
        
        // Clean up on error
        if (mediaPath && fs.existsSync(mediaPath)) {
            try {
                fs.unlinkSync(mediaPath);
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError.message);
            }
        }
        
        return `${mediaType} content not available`;
    }
}

// Enhanced message storage with media type validation
if (!msg.key.fromMe && (body || type !== 'conversation')) {
    const messageData = {
        type: 'text',
        content: body || '',
        sender: nowsender,
        timestamp: getSriLankaTimestamp(),
        chat: from
    };
    
    // Handle different media types with validation
    try {
        if (type === 'imageMessage') {
            messageData.type = 'image';
            const mediaUrl = await uploadMediaToUrl(msg, 'image');
            messageData.content = mediaUrl;
        }
        else if (type === 'videoMessage') {
            messageData.type = 'video';
            const mediaUrl = await uploadMediaToUrl(msg, 'video');
            messageData.content = mediaUrl;
        }
        else if (type === 'audioMessage') {
            messageData.type = 'audio';
            const mediaUrl = await uploadMediaToUrl(msg, 'audio');
            messageData.content = mediaUrl;
        }
        else if (type === 'stickerMessage') {
            messageData.type = 'sticker';
            messageData.content = msg.message.stickerMessage.url || 'Sticker not available';
        }
        else if (type === 'documentMessage') {
            messageData.type = 'document';
            messageData.content = msg.message.documentMessage.url || 'Document not available';
            messageData.fileName = msg.message.documentMessage.fileName || 'file';
        }
        
        messageStore.set(msg.key.id, messageData);
        
        // Clean up old messages
        setTimeout(() => {
            messageStore.delete(msg.key.id);
        }, 60 * 60 * 1000);
        
    } catch (storageError) {
        console.error('Message storage error:', storageError);
        // Store basic text info even if media fails
        messageStore.set(msg.key.id, messageData);
    }
}
        

   socket.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    try {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        
        // Validate media key before attempting download
        if (!quoted.mediaKey) {
            throw new Error('No media key available for download');
        }
        
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        
        if (buffer.length === 0) {
            throw new Error('Downloaded media is empty');
        }
        
        // Simple extension detection based on mime type
        let ext = 'bin';
        if (mime.includes('image/jpeg') || mime.includes('image/jpg')) ext = 'jpg';
        else if (mime.includes('image/png')) ext = 'png';
        else if (mime.includes('image/gif')) ext = 'gif';
        else if (mime.includes('image/webp')) ext = 'webp';
        else if (mime.includes('video')) ext = 'mp4';
        else if (mime.includes('audio')) ext = 'mp3';
        else if (mime.includes('application/pdf')) ext = 'pdf';
        
        const trueFileName = attachExtension ? (`${filename}.${ext}`) : filename;
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    } catch (error) {
        console.error('downloadAndSaveMediaMessage error:', error.message);
        throw error; // Re-throw to let caller handle
    }
};
       
       
  // Enhanced replyglobal function to support video and audio
const replyglobal = async (m, teks, options = {}) => {
    if (!m || !m.chat) throw new Error('Message object `m` is required');

    // Send emoji reaction first
    if (Array.isArray(emojis) && emojis.length > 0) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        await socket.sendMessage(m.chat, {
            react: {
                text: randomEmoji,
                key: m.key
            }
        });
    }
    // Prepare contextInfo safely
    const contextInfo = {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterName: "Dullah - Draxen-Ai",
            newsletterJid: "120363402252728845@newsletter",
        },
        externalAdReply: {
            title: "DRAXEN-Ai",
            body: "Dullah",
            thumbnailUrl: 'https://files.catbox.moe/tmmvub.jpg',
            sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
        }
    };

    if (options.image) {
        // Image with caption (supports buffer or URL)
        await socket.sendMessage(m.chat, {
            image: typeof options.image === 'string' ? { url: options.image } : options.image,
            caption: teks,
            contextInfo,
        }, { quoted: m });
    } else if (options.video) {
        // Video with caption (supports buffer or URL)
        await socket.sendMessage(m.chat, {
            video: typeof options.video === 'string' ? { url: options.video } : options.video,
            caption: teks,
            contextInfo,
        }, { quoted: m });
    } else if (options.audio) {
        // Audio with caption (supports buffer or URL)
        await socket.sendMessage(m.chat, {
            audio: typeof options.audio === 'string' ? { url: options.audio } : options.audio,
            mimetype: options.mimetype || 'audio/mp4',
            caption: teks,
            contextInfo,
        }, { quoted: m });
    } else {
        // Text only
        await socket.sendMessage(m.chat, {
            text: teks,
            contextInfo,
        }, { quoted: m });
    }
};


//===========[antilink group]==========\\
// Autotyping feature
socket.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;
    
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    
    // Check if autotyping is enabled for any user
    const autotypingData = readJSON(AUTOTYPING_PATH);
    
    for (const [userNumber, isEnabled] of Object.entries(autotypingData)) {
        if (isEnabled) {
            try {
                // Get the socket for this user
                const userSocket = activeSockets.get(userNumber);
                if (userSocket) {
                    // Start typing in the chat where the message was received
                    await userSocket.sendPresenceUpdate('composing', from);
                    
                    // Keep typing for 30 seconds with periodic refreshes
                    const typingInterval = setInterval(async () => {
                        try {
                            await userSocket.sendPresenceUpdate('composing', from);
                        } catch (error) {
                            console.error('Error refreshing typing indicator:', error);
                            clearInterval(typingInterval);
                        }
                    }, 25000); // Refresh every 25 seconds
                    
                    // Stop after 30 seconds
                    setTimeout(async () => {
                        clearInterval(typingInterval);
                        try {
                            await userSocket.sendPresenceUpdate('paused', from);
                        } catch (error) {
                            console.error('Error pausing typing indicator:', error);
                        }
                    }, 30000);
                }
            } catch (error) {
                console.error('Error in autotyping for user:', userNumber, error);
            }
        }
    }
});

socket.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;
    
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    
    if (isGroup) {
        try {
            console.log(`[ANTILINK] Processing message in group: ${from}`);
            
            // 1. URL Detection Function (using your function)
            const isUrl = (text) => {
                if (!text) return false;
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const result = urlRegex.test(text);
                console.log(`[ANTILINK] URL check for "${text.substring(0, 50)}...": ${result}`);
                return result;
            };
            
            // 2. JSON Read Function with better error handling
            const readJSON = (path) => {
                try {
                    console.log(`[ANTILINK] Reading JSON from: ${path}`);
                    if (!fs.existsSync(path)) {
                        console.log(`[ANTILINK] File ${path} does not exist, returning empty object`);
                        return {};
                    }
                    const data = fs.readFileSync(path, 'utf8');
                    const parsed = JSON.parse(data);
                    console.log(`[ANTILINK] Successfully read ${path}`);
                    return parsed;
                } catch (error) {
                    console.error(`[ANTILINK] Error reading ${path}:`, error);
                    return {};
                }
            };
            
            // 3. JSON Write Function
            const writeJSON = (path, data) => {
                try {
                    console.log(`[ANTILINK] Writing to: ${path}`);
                    fs.writeFileSync(path, JSON.stringify(data, null, 2));
                } catch (e) {
                    console.error(`[ANTILINK] Write error to ${path}:`, e);
                }
            };
            
            // 4. Group Admin Check Function
            const isGroupAdmin = async (groupJid, userJid) => {
                try {
                    console.log(`[ANTILINK] Checking admin status for ${userJid} in ${groupJid}`);
                    const metadata = await socket.groupMetadata(groupJid);
                    const user = metadata.participants.find(p => p.id === userJid);
                    const isAdmin = user && (user.admin === 'admin' || user.admin === 'superadmin');
                    console.log(`[ANTILINK] Admin check result: ${isAdmin}`);
                    return isAdmin;
                } catch (error) {
                    console.error(`[ANTILINK] Error checking admin:`, error);
                    return false;
                }
            };
            
            // Define file paths
            const ANTILINK_PATH = './antilink.json';
            const ACTIONS_PATH = './antilink_actions.json';
            const WARNS_PATH = './antilink_warns.json';
            
            // Initialize files if they don't exist
            [ANTILINK_PATH, ACTIONS_PATH, WARNS_PATH].forEach(path => {
                if (!fs.existsSync(path)) {
                    console.log(`[ANTILINK] Creating file: ${path}`);
                    writeJSON(path, {});
                }
            });
            
            // Check antilink status
            const antilinkData = readJSON(ANTILINK_PATH);
            console.log(`[ANTILINK] Antilink data for ${from}: ${antilinkData[from]}`);
            
            if (antilinkData[from]) {
                const sender = msg.key.participant || msg.key.remoteJid;
                console.log(`[ANTILINK] Sender: ${sender}`);
                
                const isAdmin = await isGroupAdmin(from, sender);
                
                if (!isAdmin) {
                    // Extract message text from different message types
                    let body = '';
                    if (msg.message.conversation) {
                        body = msg.message.conversation;
                    } else if (msg.message.extendedTextMessage?.text) {
                        body = msg.message.extendedTextMessage.text;
                    } else if (msg.message.imageMessage?.caption) {
                        body = msg.message.imageMessage.caption;
                    } else if (msg.message.videoMessage?.caption) {
                        body = msg.message.videoMessage.caption;
                    } else if (msg.message.documentMessage?.caption) {
                        body = msg.message.documentMessage.caption;
                    }
                    
                    console.log(`[ANTILINK] Message body: "${body}"`);
                    
                    // Check if message contains URLs
                    if (isUrl(body)) {
                        console.log(`[ANTILINK] URL detected! Taking action...`);
                        
                        const antilinkActionData = readJSON(ACTIONS_PATH);
                        const action = antilinkActionData[from] || 'delete';
                        console.log(`[ANTILINK] Action for this group: ${action}`);
                        
                        switch(action) {
                            case 'delete':
                                console.log(`[ANTILINK] Executing DELETE action`);
                                try {
                                    await socket.sendMessage(from, { 
                                        delete: msg.key 
                                    });
                                    console.log(`[ANTILINK] Message deleted`);
                                    
                                    await socket.sendMessage(from, {
                                        text: `❌ Links are not allowed in this group!\n\nMessage from @${sender.split('@')[0]} was deleted.`,
                                        mentions: [sender]
                                    });
                                    console.log(`[ANTILINK] Warning sent`);
                                } catch (error) {
                                    console.error('[ANTILINK] Delete error:', error);
                                }
                                break;
                                
                            case 'warn':
                                console.log(`[ANTILINK] Executing WARN action`);
                                const warnData = readJSON(WARNS_PATH);
                                if (!warnData[from]) warnData[from] = {};
                                if (!warnData[from][sender]) warnData[from][sender] = 0;
                                
                                warnData[from][sender]++;
                                writeJSON(WARNS_PATH, warnData);
                                
                                const warnCount = warnData[from][sender];
                                console.log(`[ANTILINK] Warn count for ${sender}: ${warnCount}/4`);
                                
                                if (warnCount >= 4) {
                                    console.log(`[ANTILINK] Kicking user after 4 warnings`);
                                    try {
                                        await socket.sendMessage(from, { 
                                            delete: msg.key 
                                        });
                                        
                                        await socket.groupParticipantsUpdate(from, [sender], "remove");
                                        console.log(`[ANTILINK] User kicked`);
                                        
                                        await socket.sendMessage(from, {
                                            text: `👢 @${sender.split('@')[0]} has been kicked for repeatedly sharing links (4 warnings).`,
                                            mentions: [sender]
                                        });
                                        
                                        delete warnData[from][sender];
                                        writeJSON(WARNS_PATH, warnData);
                                    } catch (kickError) {
                                        console.error('[ANTILINK] Kick error:', kickError);
                                    }
                                } else {
                                    console.log(`[ANTILINK] Warning user (${warnCount}/4)`);
                                    try {
                                        await socket.sendMessage(from, { 
                                            delete: msg.key 
                                        });
                                        
                                        await socket.sendMessage(from, {
                                            text: `⚠️ Warning ${warnCount}/4!\n@${sender.split('@')[0]}, links are not allowed!\n\nNext violation will result in ${warnCount === 3 ? 'KICK' : 'warning'}.\nYour message has been deleted.`,
                                            mentions: [sender]
                                        });
                                    } catch (warnError) {
                                        console.error('[ANTILINK] Warn error:', warnError);
                                    }
                                }
                                break;
                                
                            case 'kick':
                                console.log(`[ANTILINK] Executing KICK action`);
                                try {
                                    await socket.sendMessage(from, { 
                                        delete: msg.key 
                                    });
                                    
                                    await socket.groupParticipantsUpdate(from, [sender], "remove");
                                    console.log(`[ANTILINK] User kicked immediately`);
                                    
                                    await socket.sendMessage(from, {
                                        text: `👢 @${sender.split('@')[0]} has been kicked for sharing links.`,
                                        mentions: [sender]
                                    });
                                } catch (kickError) {
                                    console.error('[ANTILINK] Kick error:', kickError);
                                    await socket.sendMessage(from, {
                                        text: `❌ @${sender.split('@')[0]} shared a link, but I couldn't kick them. Please check my admin permissions.`,
                                        mentions: [sender]
                                    });
                                }
                                break;
                        }
                    } else {
                        console.log(`[ANTILINK] No URL detected, skipping`);
                    }
                } else {
                    console.log(`[ANTILINK] Sender is admin, allowing link`);
                }
            } else {
                console.log(`[ANTILINK] Antilink is OFF for this group`);
            }
        } catch (error) {
            console.error('[ANTILINK] General error:', error);
        }
    }
});


// Enhanced badwords feature
socket.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key.remoteJid === 'status@broadcast') return;
    
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    
    if (isGroup) {
        const badwordsData = readJSON(BADWORDS_PATH);
        if (badwordsData[from]) {
            // Check if sender is admin
            const isAdmin = await isGroupAdmin(from, msg.key.participant || msg.key.remoteJid);
            
            if (!isAdmin) {
                const body = (msg.message.conversation || 
                            msg.message.extendedTextMessage?.text || 
                            msg.message.imageMessage?.caption || 
                            msg.message.videoMessage?.caption || '').toLowerCase();
                
                const foundBadWord = badwordsData[from].find(word => body.includes(word.toLowerCase()));
                
                if (foundBadWord) {
                    await socket.sendMessage(from, { 
                        delete: msg.key 
                    });
                    await socket.sendMessage(from, {
                        text: `❌ Message contained a forbidden word: "${foundBadWord}"`
                    });
                }
            }
        }
    }
});



async function createStickerFromUrl(imageUrl, packname, author, m) {
    try {
        await socket.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key },
        });

        // Download image from URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');
        
        // Save temporary file
        const tempPath = `temp_sticker_${Date.now()}.jpg`;
        fs.writeFileSync(tempPath, imageBuffer);

        await replyglobal(m, "⏳ Creating sticker...");

        // Create sticker using Sticker class
        const sticker = new Sticker(tempPath, {
            pack: packname,
            author: author,
            type: StickerTypes.FULL,
            categories: ['🎨', '✨'],
            quality: 50,
        });

        const stickerBuffer = await sticker.toBuffer();
        
        // Send the sticker
        await socket.sendMessage(m.chat, {
            sticker: stickerBuffer,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });

        // Clean up temporary file
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }

        await socket.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
        });

    } catch (error) {
        console.error("Sticker creation error:", error);
        await replyglobal(m, "❌ Failed to create sticker from URL.");
        await socket.sendMessage(m.chat, {
            react: { text: "❌", key: m.key },
        });
    }
}





//antidelete
socket.ev.on('messages.delete', async (deleteData) => {
    if (!deleteData.keys) return;
    
    for (const key of deleteData.keys) {
        const deletedMessage = messageStore.get(key.id);
        if (deletedMessage) {
            const antideleteData = readJSON(ANTIDELETE_PATH);
            if (antideleteData[sender] !== false) { // Default is enabled
                await socket.sendMessage(sender, {
                    text: `🗑️ Deleted message recovered:\n\n"${deletedMessage.message}"\n\nFrom: ${deletedMessage.chat}`,
                    contextInfo: {
                        mentionedJid: [deletedMessage.sender]
                    }
                });
            }
            messageStore.delete(key.id);
        }
    }
});




let totalAudios = 26; // Number of audio slots

let audioFiles = [];
let singleAudio = "https://github.com/smart1-bot/database/raw/refs/heads/main/content/AUD-20260101-WA0106.mp3";

for (let i = 1; i <= totalAudios; i++) {
  audioFiles.push(singleAudio);
}


 
// Define your servers
const bots = [
  {
        id: 1,
        name: "Server-1",
        status: "checking",
        uptime: "--:--:--",
        usersOnline: 0,
        userLimit: 60,
        server: "Server-1",
        link: "Server-1",
        apiUrl: "https://DullahDraxenxmd1-b0bc392a8c8a.herokuapp.com",
        lastSessionCount: 0,
        joined: 0,
        left: 0
      },
      {
        id: 2,
        name: "Server-2",
        status: "checking",
        uptime: "--:--:--",
        usersOnline: 0,
        userLimit: 60,
        server: "Server-2",
        link: "Server-2",
        apiUrl: "https://DullahDraxenxmd2-f8a2a9ddab5c.herokuapp.com",
        lastSessionCount: 0,
        joined: 0,
        left: 0
      },
      {
        id: 3,
        name: "Server-3",
        status: "checking",
        uptime: "--:--:--",
        usersOnline: 0,
        userLimit: 60,
        server: "Server-3",
        link: "Server-3",
        apiUrl: "https://DullahDraxenxmd3-e37fcf1393a9.herokuapp.com",
        lastSessionCount: 0,
        joined: 0,
        left: 0
      },
      {
        id: 4,
        name: "Server-4",
        status: "checking",
        uptime: "--:--:--",
        usersOnline: 0,
        userLimit: 60,
        server: "Server-4",
        link: "Server-4",
        apiUrl: "https://DullahDraxenxmd4-a6c1dc34ecf9.herokuapp.com",
        lastSessionCount: 0,
        joined: 0,
        left: 0
      },
      {
        id: 5,
        name: "Server-5",
        status: "checking",
        uptime: "--:--:--",
        usersOnline: 0,
        userLimit: 60,
        server: "Server-5",
        link: "Server-5",
        apiUrl: "https://DullahDraxenxmd5-a229b8cd7b42.herokuapp.com",
        lastSessionCount: 0,
        joined: 0,
        left: 0
      },
      {
        id: 6,
        name: "Server-6",
        status: "checking",
        uptime: "--:--:--",
        usersOnline: 0,
        userLimit: 60,
        server: "Server-6",
        link: "Server-6",
        apiUrl: "https://DullahDraxenxmd6-ece71e9865a9.herokuapp.com",
        lastSessionCount: 0,
        joined: 0,
        left: 0
      }
];

// Add this with your other utility functions at the top
function getRandom(ext = '') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}_${random}${ext}`;
}

// Add this function near the top of your file with other utility functions
function getRandom(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
}

// Add this function with your other utility functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



// Add this function with your other utility functions
async function fetchJson(url, options = {}) {
    try {
        const response = await axios.get(url, {
            timeout: 30000,
            ...options
        });
        return response.data;
    } catch (error) {
        console.error('FetchJson error:', error.message);
        throw error;
    }
}



  let userProfilePic;
        try {
            userProfilePic = await socket.profilePictureUrl(m.sender, 'image').catch(() => null);
        } catch (error) {
            userProfilePic = null;
        }

        // Fallback to default image if no profile picture
        const thumbnailUrl = userProfilePic || 'https://files.catbox.moe/tmmvub.jpg';


const botModeData = readJSON(BOT_MODE_PATH);
const currentMode = botModeData[number] || 'public';
const modeEmoji = currentMode === 'private' ? '🔒' : '🔓';
const server = 'Server-1';



// Function to pair with remote server
async function pairWithServer(apiUrl, phoneNumber) {
  try {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const response = await fetch(`${apiUrl}/code?number=${encodeURIComponent(phoneNumber)}`);
    const data = await response.json();

    if (data.code) {
      return {
        success: true,
        code: data.code
      };
    } else if (data.error) {
      return {
        success: false,
        message: data.error
      };
    } else if (data.status === 'already_connected') {
      return {
        success: false,
        message: 'This number is already connected on the server.'
      };
    } else {
      return {
        success: false,
        message: 'Failed to generate pairing code. Try again.'
      };
    }
  } catch (error) {
    console.error("❌ API Request Error:", error);
    return {
      success: false,
      message: 'Service unavailable. Please try again later.'
    };
  }
}






       
if (body.startsWith(`${userPrefix}pair_server_`)) {
    try {
        const match = body.match(/pair_server_(\d+)_(\d+)/);
        if (!match) return await replyglobal(m, '❌ Invalid server selection.');

        const serverId = parseInt(match[1]);   // Extract server index
        const phoneNumber = match[2];          // Extract phone number

        const selectedServer = bots.find(server => server.id === serverId);
        if (!selectedServer) return await replyglobal(m, '❌ Server not found.');

        await socket.sendMessage(sender, { react: { text: '⏳', key: msg.key } });

        await replyglobal(m, `🔄 Pairing with *${selectedServer.name}* for ${phoneNumber}...\n\nPlease wait for pairing code...`);

        const result = await pairWithServer(selectedServer.apiUrl, phoneNumber);

        if (result.success) {
            await replyglobal(m, 
                `> *DRAXEN-Ai ᴘᴀɪʀ ᴄᴏᴍᴘʟᴇᴛᴇᴅ* ✅\n\n` +
                `*🔑 ʏᴏᴜʀ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ ɪs:* ${result.code}\n\n` +
                `*Server:* ${selectedServer.name}`
            );

            // Optional: also send the code as a separate plain message
            await replyglobal(m, `${result.code}`);
        } else {
            await replyglobal(m, `❌ *Pairing failed on ${selectedServer.name}:* ${result.message}`);
        }

    } catch (err) {
        console.error("❌ Pair Server Command Error:", err);
        await replyglobal(m, '❌ Something broke during pairing 💔 Try again later?');
    }
}






const textnae = args.join(' ').trim();



       
       
               try {
                   switch (command) {


                    




                   // Case: alive
case 'alive': {
    try {
        await socket.sendMessage(sender, { react: { text: '🔮', key: msg.key } });

const botModeData = readJSON(BOT_MODE_PATH);
const currentMode = botModeData[number] || 'public';
const modeEmoji = currentMode === 'private' ? '🔒' : '🔓';



        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const captionText = `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║ ʙᴏᴛ ᴜᴘᴛɪᴍᴇ: ${hours}ʜ ${minutes}ᴍ ${seconds}s
║ ᴀᴄᴛɪᴠᴇ ʙᴏᴛs: ${activeSockets.size}
║ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ: ${number}
║ ᴠᴇʀsɪᴏɴ: ${config.version}
║ Mode: ${modeEmoji} ${currentMode.toUpperCase()}
║ ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}ᴍʙ
────────────────────
> DRAXEN-Ai
> ʀᴇsᴘᴏɴᴅ ᴛɪᴍᴇ: ${Date.now() - msg.messageTimestamp * 1000}ms`;

        const aliveMessage = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `> What?, U think i\`m oflline😂😵\n\n${captionText}`,
            buttons: [
                {
                    buttonId: `${userPrefix}menu_action`,
                    buttonText: { displayText: '📂 ᴍᴇɴᴜ ᴏᴘᴛɪᴏɴ' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'ᴄʟɪᴄᴋ ʜᴇʀᴇ ❏',
                            sections: [
                                {
                                    title: `© DRAXEN-Ai`,
                                    highlight_label: 'Quick Actions',
                                    rows: [
                                        { title: '📋 ғᴜʟʟ ᴍᴇɴᴜ', description: 'ᴠɪᴇᴡ ᴀʟʟ ᴀᴠᴀɪʟᴀʙʟᴇ ᴄᴍᴅs', id: `${userPrefix}Draxen` },
                                        { title: '💓 ᴀʟɪᴠᴇ ᴄʜᴇᴄᴋ', description: 'ʀᴇғʀᴇs ʙᴏᴛ sᴛᴀᴛᴜs', id: `${userPrefix}alive` },
                                        { title: '💫 ᴘɪɴɢ ᴛᴇsᴛ', description: 'ᴄʜᴇᴄᴋ ʀᴇsᴘᴏɴᴅ sᴘᴇᴇᴅ', id: `${userPrefix}ping` }
                                    ]
                                },
                                {
                                    title: "ϙᴜɪᴄᴋ ᴄᴍᴅs",
                                    highlight_label: 'ᴘᴏᴘᴜʟᴀʀ',
                                    rows: [
                                        { title: '🤖 Draxen AI', description: 'sᴛᴀʀᴛ ᴀɪ ᴄᴏɴᴠᴇʀsᴀᴛɪᴏɴ', id: `${userPrefix}ai Hello!` },
                                        { title: '🎵 ᴍᴜsɪᴄ sᴇᴀʀᴄʜ', description: 'ᴅᴏᴡɴʟᴏᴀᴅ ʏᴏᴜʀ ғᴀᴠᴏʀɪᴛᴇ sᴏɴɢs', id: `${userPrefix}song` },
                                        { title: '😎 Bot creator', description: 'ɢᴇᴛ intouch with bot creator', id: `${userPrefix}owner` },
                                        
                                    ]
                                }
                            ]
                        })
                    }
                },
                { buttonId: `${userPrefix}bot_info`, buttonText: { displayText: '🌟 ʙᴏᴛ ɪɴғᴏ' }, type: 1 },
                { buttonId: `${userPrefix}bot_stats`, buttonText: { displayText: '📈 ʙᴏᴛ sᴛᴀᴛs' }, type: 1 },
                {
                    buttonId: `${userPrefix}servers`,
                    buttonText: { displayText: '🖥️ Servers status' },
                    type: 1
                }
            ],
             headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(m.chat, aliveMessage, { quoted: m });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Alive command error:', error);
        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        await socket.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `*🤖 DRAXEN-Ai alive*\n\n` +
                `━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━\n` +
                `║ ᴜᴘᴛɪᴍᴇ: ${hours}h ${minutes}m ${seconds}s\n` +
                `║ sᴛᴀᴛᴜs: ᴏɴʟɪɴᴇ\n` +
                `║ ɴᴜᴍʙᴇʀ: ${number}\n` +
                `────────────────────\n\n` +
                `ᴛʏᴘᴇ *${userPrefix}ᴍᴇɴᴜ* ғᴏʀ ᴄᴏᴍᴍᴀɴᴅs`
        }, { quoted: m });
    }
    break;
}

// Case: bot_info
case 'bot_info': {
    try {
        const teks = `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║👑 ᴄʀᴇᴀᴛᴏʀ: Dullah
║🌐 ᴠᴇʀsɪᴏɴ: ${config.version}
║📍 ᴘʀᴇғɪx: ${userPrefix}
║ Mode: ${modeEmoji} ${currentMode.toUpperCase()}
║🔗*Website:* https://Draxen-Ai-bot.vercel.app
────────────────────`;
        
        await replyglobal(m, teks, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }
    } catch (error) {
        console.error('Bot info error:', error);
        await replyglobal(m, '❌ Failed to retrieve bot info.');
    }
    break;
}








case 'how-to-deply':
case 'deploy-your-own':
case 'connect-to-bot':
case 'have-this-bot': {
    try {
        const teks = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *HOW TO CONNECT BOT* 🚀
╰━━━━━━━━━━━━━━━━━━━━━━╯

1️⃣ *Option 1: Connect via Website*  
   🌐 Visit: https://Draxen-Ai-bot.vercel.app  
   - Choose any server (bots already deployed).  
   - Enter your WhatsApp number → get a *pairing code*.  
   - Open WhatsApp → *Linked Devices* → *Link a Device* → *Use Pairing Code*.  

2️⃣ *Option 2: Pair via Telegram*  
   🔗 Go to: https://t.me/Draxen_Xmd_Bot  
   - Click *Start* and follow the channel (required).  
   - Type: */pair 255697xxxxxx* (without +, no spaces).  
   - The bot will list all servers → click any server → get your codes.  
   - Use them in WhatsApp (*Linked Devices* → *Link a Device* → *Use Pairing Code*).  

3️⃣ *Option 3: Fast & Easy Private Chat*  
   💬 Open a private chat with the bot owner.  
   - Type: *.pair 255697xxxxxx*  
   - It will list servers → choose → get pairing code.  
   - Link via WhatsApp *Linked Devices*.  

✅ After linking, your bot will be running and ready to use! 🚀
──────────────────────────`;

        const connectMessage = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: teks,
            buttons: [
                {
                    buttonId: `${userPrefix}connect_site`,
                    buttonText: { displayText: '🌐 Connect via Website' },
                    type: 1
                },
                {
                    buttonId: `${userPrefix}connect_telegram`,
                    buttonText: { displayText: '📲 Pair via Telegram Bot' },
                    type: 1
                },
                {
                    buttonId: `${userPrefix}pair`,
                    buttonText: { displayText: '⚡ Fast Private Chat Pair' },
                    type: 1
                },
                {
                    buttonId: `${userPrefix}servers`,
                    buttonText: { displayText: '🖥️ Servers status' },
                    type: 1
                }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(m.chat, connectMessage, { quoted: m });

        // random audio feedback
        try {

            try {
            const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
            } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

        } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('How-to-deploy error:', error);
        await replyglobal(m, '❌ Failed to load instructions. Please try again.');
    }
    break;
}









case 'connect_telegram':
 {
    try {
        const teksya = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *HOW TO DEPLOY BOT VIA Telegram* 🚀
╰━━━━━━━━━━━━━━━━━━━━━━╯
🔗 Go to: https://t.me/Draxen_Xmd_Bot  
   - Click *Start* and follow the channel (required).  
   - Type: */pair 255697xxxxxx* (without +, no spaces).  
   - The bot will list all servers → click any server → get your codes.  
   - Use them in WhatsApp (*Linked Devices* → *Link a Device* → *Use Pairing Code*).

✅ After linking, your bot will be running and ready to use! 🚀
──────────────────────────`;

        await replyglobal(m, teksya, { 
            image: "https://files.catbox.moe/tmmvub.jpg"
        });
 try {

     try {
     const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
     } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

 } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }
    } catch (error) {
        console.error('How-to-deploy error:', error);
        await replyglobal(m, '❌ Failed to load instructions. Please try again.');
    }
    break;
}






case 'connect_site':
 {
    try {
        const teksyai = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *HOW TO DEPLOY BOT VIA WEBSITE* 🚀
╰━━━━━━━━━━━━━━━━━━━━━━╯

1️⃣ Visit 🌐 *https://Draxen-Ai-bot.vercel.app*  
   - Choose a server (all bots are already deployed).  

2️⃣ Click on *Connect Bot*.  
   - This will take you inside the server page.  

3️⃣ Scroll down to *Bot Pairing*.  
   - Enter your WhatsApp number.  
   - You’ll receive a *pairing code*.  

4️⃣ Open WhatsApp on your phone:  
   📱 *Android / iPhone*:  
   - Go to *Linked Devices* → *Link a Device*.  
   - Select *Use Pairing Code* and enter the code shown.  

   💼 *WhatsApp Business*:  
   - Same steps: *Linked Devices* → *Link a Device* → *Use Pairing Code*.  

✅ After linking, your bot will be running and ready to use! 🚀
──────────────────────────`;

        await replyglobal(m, teksyai, { 
            image: "https://files.catbox.moe/tmmvub.jpg"
        });
 try {

     try {
     const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
     } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

 } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }
    } catch (error) {
        console.error('How-to-deploy error:', error);
        await replyglobal(m, '❌ Failed to load instructions. Please try again.');
    }
    break;
}











// Case: bot_stats
case 'bot_stats': {
    try {
        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        const activeCount = activeSockets.size;

        const teks = `
━━━━━━━━━━━━━━━━━━━━
┃ 🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║ ᴜᴘᴛɪᴍᴇ: ${hours}ʜ ${minutes}ᴍ ${seconds}s
║ ᴍᴇᴍᴏʀʏ: ${usedMemory}ᴍʙ / ${totalMemory}ᴍʙ
║ ᴀᴄᴛɪᴠᴇ ᴜsᴇʀs: ${activeCount}
║ Mode: ${modeEmoji} ${currentMode.toUpperCase()}
║ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ: ${number}
║ ᴠᴇʀsɪᴏɴ: ${config.version}
────────────────────`;

        await replyglobal(m, teks, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
  try {

      try {
      const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
            }
        }, { quoted: m });
      } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

  } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Bot stats error:', error);
        await replyglobal(m, '❌ Failed to retrieve stats. Please try again later.');
    }
    break;
}

// Case: menu
// Case: menu
case 'menu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🤖', key: msg.key } });
        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);

        // Get user's profile picture
      

        let menuText = `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> ⚡ *Prefix:* ${userPrefix} 
> 🖥️ *server:* ${server}
> 📂 *Total Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Bot Version:* 2.0.0  
────────────────────
*Ξ sᴇʟᴇᴄᴛ ᴀ ᴄᴀᴛᴇɢᴏʀʏ ʙᴇʟᴏᴡ:*

> DRAXEN-Ai
`;

        const messageContext = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402252728845@newsletter',
                newsletterName: 'Dullah - Draxen-Ai',
                serverMessageId: -1
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: `Dullah`,
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        const menuMessage = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `${menuText}`,
            buttons: [
                {
                    buttonId: `${userPrefix}quick_commands`,
                    buttonText: { displayText: '🤖 ʙᴀsɪᴄ ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🤖 AVAILABLE MENUS',
                            sections: [
                                {
                                    title: "🌐 All available menus",
                                    highlight_label: 'All menus',
                                    rows: [
                                        { title: "🎃 Draxen", description: "All menu displayed", id: `${userPrefix}Draxen-Ai` },
                                        { title: "🤖 Owner menu", description: "All owner commands displayed", id: `${userPrefix}ownermenu` },
                                        { title: "🧧 General Commands Menu", description: "Quick acess menu", id: `${userPrefix}generalmenu` },
                                        { title: "🎵 Media Tools Menu", description: "Acess The media downloaders", id: `${userPrefix}mediamenu` },
                                        { title: "🫂 Group Menu", description: "Manage your groups easly", id: `${userPrefix}groupmenu` },
                                        { title: "📰 News & Info Menu", description: "Get latest news", id: `${userPrefix}newsmenu` },
                                        { title: "🖤 Fun menu", description: "Fun", id: `${userPrefix}funmenu` },
                                        { title: "🔧 Tools Menu", description: "tools and utilites", id: `${userPrefix}toolsmenu` },
                                        { title: "🔄 Sticker Menu", description: "Generate & create stickers", id: `${userPrefix}stickermenu` },
                                        { title: "🌸 Anime menu", description: "Random waifu images", id: `${userPrefix}animemenu` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                {
                    buttonId: `${userPrefix}bot_stats`,
                    buttonText: { displayText: '🎃 ʙᴏᴛ sᴛᴀᴛs' },
                    type: 1
                },
                {
                    buttonId: `${userPrefix}bot_info`,
                    buttonText: { displayText: '🌸 ʙᴏᴛ ɪɴғᴏ' },
                    type: 1
                },
                {
                    buttonId: `${userPrefix}menu_list`,
                    buttonText: { displayText: '📃 Menu list' },
                    type: 1
                }
            ],
            headerType: 1,
            contextInfo: messageContext
        };

        await socket.sendMessage(from, menuMessage, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
        
        try {
            await socket.sendMessage(m.chat, {
                audio: { url: singleAudio },
                mimetype: 'audio/mpeg',
                ptt: false,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    }
                }
            }, { quoted: m });
        } catch (audioErr) {
            console.error('Menu audio send failed (non-fatal):', audioErr.message);
        }
    } catch (error) {
        console.error('Menu command error:', error);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        
        // Fallback thumbnail for error case
        let fallbackThumbnail;
        try {
            fallbackThumbnail = await socket.profilePictureUrl(m.sender, 'image').catch(() => null);
        } catch (error) {
            fallbackThumbnail = null;
        }
        
        const thumbnailUrl = fallbackThumbnail || 'https://files.catbox.moe/tmmvub.jpg';

        let fallbackMenuText = `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║  🤖 *ʙᴏᴛ ɴᴀᴍᴇ*: DRAXEN-Ai 
║  🎉 *ᴜsᴇʀ*: @${m.sender.split('@')[0]}
║  📍 *ᴘʀᴇғɪx*: ${userPrefix}
║  ⏰ *ᴜᴘᴛɪᴍᴇ*: ${hours}h ${minutes}m ${seconds}s
║  💾 *ᴍᴇᴍᴏʀʀʏ*: ${usedMemory}MB/${totalMemory}MB
────────────────────

${userPrefix}ᴀʟʟᴍᴇɴᴜ ᴛᴏ ᴠɪᴇᴡ ᴀʟʟ ᴄᴍᴅs 
> *Dullah - Draxen-Ai*
`;

        const fallbackContext = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402252728845@newsletter',
                newsletterName: 'Dullah - Draxen-Ai',
                serverMessageId: -1
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: `Dullah`,
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: fallbackMenuText,
            contextInfo: fallbackContext
        }, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}

// Case: general_menu-list
case 'generalmenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🌐', key: msg.key } });

        const generalMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━

  🌐 *GENERAL COMMANDS*  

> 🟢 *Bot Status & Information*
> 📋 *Menu & Help Systems*
> 🎨 *Content Creation Tools*
> 🔮 *Miscellaneous Features*
> 💝 *Support & Donations*

────────────────────
Select a command from the buttons below:`,



            buttons: [
                {
                    buttonId: `${userPrefix}general_commands`,
                    buttonText: { displayText: '🌐 ɢᴇɴᴇʀᴀʟ ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🌐 GENERAL COMMANDS',
                            sections: [
                                {
                                    title: "🟢 Bot Status",
                                    highlight_label: 'Status Commands',
                                    rows: [
                                        { title: "🟢 Alive Check", description: "Check if bot is active", id: `${userPrefix}alive` },
                                        { title: "🏓 Ping Test", description: "Check response speed", id: `${userPrefix}ping` },
                                        { title: "📊 Bot Stats", description: "View statistics", id: `${userPrefix}bot_stats` },
                                        { title: "ℹ️ Bot Info", description: "Bot information", id: `${userPrefix}bot_info` }
                                    ]
                                },
                                {
                                    title: "📋 Menu & Help",
                                    highlight_label: 'Navigation',
                                    rows: [
                                        { title: "📋 Main Menu", description: "Show main menu", id: `${userPrefix}menu` },
                                        { title: "📜 All Menu", description: "Complete command list", id: `${userPrefix}allmenu` },
                                        { title: "❓ Help", description: "Command help", id: `${userPrefix}help` }
                                    ]
                                },
                                {
                                    title: "🎨 Content Creation",
                                    highlight_label: 'Creative',
                                    rows: [
                                        { title: "✨ Fancy Text", description: "Text generator", id: `${userPrefix}fancy` },
                                        { title: "🎨 Logo Maker", description: "Create logos", id: `${userPrefix}logo` },
                                        { title: "🔗 Pair Code", description: "Generate code", id: `${userPrefix}pair` },
                                        { title: "🔄 Flip Text", description: "Reverse text", id: `${userPrefix}fliptext` }
                                    ]
                                },
                                {
                                    title: "💝 Support & Donations",
                                    rows: [
                                        { title: "💝 Donate", description: "Support the bot", id: `${userPrefix}donate` },
                                        { title: "📢 Support Channel", description: "Join channel", id: `${userPrefix}support` },
                                        { title: "👨‍💻 Draxen", description: "About developer", id: `${userPrefix}Draxen` },
                                        { title: "🐞 Report Bug", description: "Report issues", id: `${userPrefix}bug` }
                                    ]
                                },
                                {
                                    title: "🔮 Miscellaneous",
                                    rows: [
                                        { title: "🔮 Repository", description: "Bot repo", id: `${userPrefix}repo` },
                                        { title: "📦 Version", description: "Bot version", id: `${userPrefix}version` },
                                        { title: "🎶 Lyrics", description: "Song lyrics", id: `${userPrefix}lyrics` },
                                        { title: "🏃‍♂️ uptime", description: "Check bot uptime", id: `${userPrefix}uptime` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                 {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                 { buttonId: `${userPrefix}general_menu-list`, buttonText: { displayText: '📃 General menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, generalMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('General menu-list error:', error);
        await replyglobal(m, '❌ Failed to load general commands menu.');
    }
    break;
}

// Case: media_menu-list
case 'mediamenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🎵', key: msg.key } });
        
        const mediaMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━

  🎵 *MEDIA TOOLS*  

> 📥 *Media Downloaders*
> 🖼️ *Media Processing*
> 🎵 *Audio/Video Tools*
> 📸 *Profile & Media*
> ✨ *Sticker Tools*

────────────────────
Select a command from the buttons below:`,
            buttons: [
                {
                    buttonId: `${userPrefix}media_commands`,
                    buttonText: { displayText: '🎵 ᴍᴇᴅɪᴀ ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🎵 MEDIA COMMANDS',
                            sections: [
                                {
                                    title: "📥 Downloaders",
                                    highlight_label: 'Social Media',
                                    rows: [
                                        { title: "🎵 Song Download", description: "YouTube music", id: `${userPrefix}song` },
                                        { title: "📱 TikTok Download", description: "TikTok videos", id: `${userPrefix}tiktok` },
                                        { title: "📘 Facebook Download", description: "FB content", id: `${userPrefix}fb` },
                                        { title: "📸 Instagram Download", description: "IG content", id: `${userPrefix}ig` },
                                        { title: "📦 APK Download", description: "APK files", id: `${userPrefix}apk` }
                                    ]
                                },
                                {
                                    title: "🖼️ Media Tools",
                                    highlight_label: 'Processing',
                                    rows: [
                                        { title: "🖼️ Draxenfy AI", description: "Generate images", id: `${userPrefix}Draxenfy` },
                                        { title: "👀 View Once", description: "Access media", id: `${userPrefix}viewonce` },
                                        { title: "📤 To URL", description: "Upload to link", id: `${userPrefix}tourl` },
                                        { title: "📸 Get Profile Pic", description: "Fetch PP", id: `${userPrefix}getpp` },
                                        { title: "🔍 Analyze Image", description: "AI analysis", id: `${userPrefix}analyse` }
                                    ]
                                },
                                {
                                    title: "✨ Sticker Tools",
                                    highlight_label: 'Stickers',
                                    rows: [
                                        { title: "🩹 Create Sticker", description: "From image/video", id: `${userPrefix}sticker` },
                                        { title: "🎭 Sticker Meme", description: "Meme from image", id: `${userPrefix}smeme` },
                                        { title: "🖼️ Sticker to Image", description: "Convert to image", id: `${userPrefix}toimage` },
                                        { title: "😀 Emoji Mix", description: "Mix two emojis", id: `${userPrefix}emojimix` }
                                    ]
                                },
                                {
                                    title: "🎵 Audio/Video",
                                    rows: [
                                        { title: "🎵 Extract Audio", description: "From video", id: `${userPrefix}audio` },
                                        { title: "📹 Download Video", description: "Any video", id: `${userPrefix}video` },
                                        { title: "🔉 To mp3", description: "change video to be audio", id: `${userPrefix}tomp3` },
                                        { title: "📽️ To mp4", description: "change sticker/gif to be video", id: `${userPrefix}tomp4` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                 {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                 { buttonId: `${userPrefix}media_menu-list`, buttonText: { displayText: '📃 Media menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, mediaMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Media menu-list error:', error);
        await replyglobal(m, '❌ Failed to load media tools menu.');
    }
    break;
}

// Case: group_menu-list
case 'groupmenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🫂', key: msg.key } });
        
        const groupMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
            
  🫂 *GROUP SETTINGS*  

> 👥 *Member Management*
> 🔐 *Group Controls*
> 📊 *Group Information*
> ⚙️ *Group Utilities*
> 👑 *Admin Tools*

────────────────────
Select a command from the buttons below:`,
            buttons: [
                {
                    buttonId: `${userPrefix}group_commands`,
                    buttonText: { displayText: '🫂 ɢʀᴏᴜᴘ ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🫂 GROUP COMMANDS',
                            sections: [
                                {
                                    title: "👥 Member Management",
                                    highlight_label: 'User Control',
                                    rows: [
                                        { title: "➕ Add Member", description: "Add to group", id: `${userPrefix}add` },
                                        { title: "🦶 Kick Member", description: "Remove from group", id: `${userPrefix}kick` },
                                        { title: "👑 Promote Admin", description: "Make admin", id: `${userPrefix}promote` },
                                        { title: "😢 Demote Admin", description: "Remove admin", id: `${userPrefix}demote` }
                                    ]
                                },
                                {
                                    title: "🔐 Group Controls",
                                    highlight_label: 'Settings',
                                    rows: [
                                        { title: "🔓 Open Group", description: "Unlock group", id: `${userPrefix}open` },
                                        { title: "🔒 Close Group", description: "Lock group", id: `${userPrefix}close` },
                                        { title: "👥 Tag All", description: "Mention everyone", id: `${userPrefix}tagall` },
                                        { title: "👤 Join Group", description: "Via link", id: `${userPrefix}join` }
                                    ]
                                },
                                {
                                    title: "📊 Group Info",
                                    rows: [
                                        { title: "📋 Group Info", description: "Group information", id: `${userPrefix}ginfo` },
                                        { title: "👑 List Admins", description: "Show admins", id: `${userPrefix}listadmin` },
                                        { title: "👥 List Members", description: "Show members", id: `${userPrefix}members` }
                                    ]
                                },
                                {
                                    title: "⚙️ Group Utilities",
                                    rows: [
                                        { title: "📝 Set Group Name", description: "Change group name", id: `${userPrefix}setname` },
                                        { title: "📋 Set Description", description: "Change description", id: `${userPrefix}setdesc` },
                                        { title: "🖼️ Set Profile Pic", description: "Change group PP", id: `${userPrefix}setppgroup` },
                                        { title: "🔄 Reset Link", description: "Revoke invite", id: `${userPrefix}revoke` }
                                    ]
                                },
                                {
                                    title: "👑 Admin Tools",
                                    highlight_label: 'Advanced',
                                    rows: [
                                        { title: "🔻 Demote All Admins", description: "Demote all admins", id: `${userPrefix}demoteall` },
                                        { title: "🔺 Promote All Members", description: "Make all admins", id: `${userPrefix}alladmins` },
                                        { title: "⚙️ Edit Info Settings", description: "Open/close edit", id: `${userPrefix}editinfo` },
                                        { title: "📢 To All Members", description: "Broadcast to all members", id: `${userPrefix}toall` },
                                        { title: "📡 To Contact Code", description: "Broadcast by code", id: `${userPrefix}tocontact` },
                                        { title: "📒 Vcf", description: "vcf file of all members", id: `${userPrefix}vcf` },
                                        { title: "♻️ Get join requests", description: "Get list of all join requests", id: `${userPrefix}getjoinrequest` },
                                        { title: "🖇️ Approve all", description: "Approve all pending join requests", id: `${userPrefix}approveall` },
                                        { title: "🏷️ Tag Admins", description: "Tag/list all admins", id: `${userPrefix}tagadmins` },
                                        { title: "👀 Tag", description: "Reply a message to tag it", id: `${userPrefix}tag` },
                                        { title: "🥷 Hide tag", description: "Tag all members anonymously", id: `${userPrefix}hidetag` },
                                        { title: "🟫 Broadcast group", description: "Send a same message to all groups", id: `${userPrefix}broadcastgroup` },
                                        { title: "⬇️ Join", description: "Join to group using link", id: `${userPrefix}join` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                 {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                 { buttonId: `${userPrefix}group_menu-list`, buttonText: { displayText: '📃 Group menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 }
            ],
             headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, groupMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Group menu-list error:', error);
        await replyglobal(m, '❌ Failed to load group settings menu.');
    }
    break;
}

// Case: news_menu-list
case 'newsmenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '📰', key: msg.key } });
        
        const newsMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
            
  📰 *NEWS & INFORMATION*  

> 📰 *News Sources*
> 🚀 *Technology & Science*
> 🌐 *Information Tools*
> 📊 *Data & Updates*

────────────────────
Select a command from the buttons below:`,
            buttons: [
                {
                    buttonId: `${userPrefix}news_commands`,
                    buttonText: { displayText: '📰 ɴᴇᴡs ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '📰 NEWS COMMANDS',
                            sections: [
                                {
                                    title: "📰 News Sources",
                                    highlight_label: 'Updates',
                                    rows: [
                                        { title: "📰 Latest News", description: "News updates", id: `${userPrefix}news` },
                                        { title: "💬 Gossip News", description: "Entertainment", id: `${userPrefix}gossip` },
                                        { title: "🏏 Cricket News", description: "Scores & news", id: `${userPrefix}cricket` }
                                    ]
                                },
                                {
                                    title: "🚀 Tech & Science",
                                    highlight_label: 'Technology',
                                    rows: [
                                        { title: "🚀 NASA Updates", description: "Space news", id: `${userPrefix}nasa` },
                                        { title: "💻 Tech News", description: "Technology", id: `${userPrefix}tech` },
                                        { title: "🔬 Science News", description: "Science updates", id: `${userPrefix}science` }
                                    ]
                                },
                                {
                                    title: "🌐 Information",
                                    rows: [
                                        { title: "🌦️ Weather", description: "Forecast", id: `${userPrefix}weather` },
                                        { title: "🔍 WhoIS", description: "Domain lookup", id: `${userPrefix}whois` },
                                        { title: "📊 User Info", description: "WhatsApp info", id: `${userPrefix}winfo` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                 {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                { buttonId: `${userPrefix}news_menu-list`, buttonText: { displayText: '📃 News menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 }
            ],
             headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, newsMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('News menu-list error:', error);
        await replyglobal(m, '❌ Failed to load news menu.');
    }
    break;
}

// Case: fun_menu-list
case 'funmenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🖤', key: msg.key } });
        
        const funMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━

  🖤 *FUN & ENTERTAINMENT*  

> 😂 *Jokes & Humor*
> 🐾 *Animals & Creatures*
> 💬 *Quotes & Lines*
> 🎮 *Games & Activities*

────────────────────
Select a command from the buttons below:`,
            buttons: [
                {
                    buttonId: `${userPrefix}fun_commands`,
                    buttonText: { displayText: '🖤 ғᴜɴ ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🖤 FUN COMMANDS',
                            sections: [
                                {
                                    title: "😂 Jokes & Humor",
                                    highlight_label: 'Entertainment',
                                    rows: [
                                        { title: "😂 Random Joke", description: "Light humor", id: `${userPrefix}joke` },
                                        { title: "🌚 Dark Joke", description: "Dark humor", id: `${userPrefix}darkjoke` },
                                        { title: "🔥 Roast User", description: "Savage roast", id: `${userPrefix}roast` },
                                        { title: "😂 Random Meme", description: "Funny memes", id: `${userPrefix}meme` }
                                    ]
                                },
                                {
                                    title: "🐾 Animals",
                                    highlight_label: 'Cute Animals',
                                    rows: [
                                        { title: "🐈 Cat Pictures", description: "Cute cats", id: `${userPrefix}cat` },
                                        { title: "🐕 Dog Pictures", description: "Cute dogs", id: `${userPrefix}dog` },
                                        { title: "🏏 Anime Waifu", description: "Random waifu", id: `${userPrefix}waifu` }
                                    ]
                                },
                                {
                                    title: "💬 Quotes & Lines",
                                    rows: [
                                        { title: "💭 Random Quote", description: "Bold quotes", id: `${userPrefix}quote` },
                                        { title: "❤️ Love Quote", description: "Romantic", id: `${userPrefix}lovequote` },
                                        { title: "💘 Pickup Line", description: "Cheesy lines", id: `${userPrefix}pickupline` },
                                        { title: "💡 Random Fact", description: "Interesting facts", id: `${userPrefix}fact` }
                                    ]
                                },
                                {
                                    title: "🎮 Games & Activities",
                                    rows: [
                                        { title: "✅ Truth", description: "Truth questions", id: `${userPrefix}truth` },
                                        { title: "⚔️ Dare", description: "Dare challenges", id: `${userPrefix}dare` },
                                        { title: "❓ Quiz", description: "Random quiz", id: `${userPrefix}quiz` },
                                        { title: "👤 character", description: "Get random character", id: `${userPrefix}charactercheck` },
                                        { title: "💇 Beautiful", description: "Check rate of a beauty girl", id: `${userPrefix}beautifulcheck` },
                                        { title: "💇‍♂️ Handsome", description: "Check rate of handsome man", id: `${userPrefix}handsomecheck` },
                                        { title: "🤷‍♂️ Check me", description: "Get details about you", id: `${userPrefix}checkme` },
                                        { title: "☕ Coffee", description: "Get random coffe photos", id: `${userPrefix}coffee` },
                                        { title: "😘 Soulmate", description: "Find soulmate in a group", id: `${userPrefix}soulmate` },
                                        { title: "🤌 Rate", description: "Get a rate of somethin", id: `${userPrefix}rate` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                 {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                 { buttonId: `${userPrefix}fun_menu-list`, buttonText: { displayText: '📃 Fun menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, funMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Fun menu-list error:', error);
        await replyglobal(m, '❌ Failed to load fun menu.');
    }
    break;
}

// Case: tools_menu-list
case 'toolsmenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🔧', key: msg.key } });
        
        const toolsMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
            
  🔧 *TOOLS & UTILITIES*  

> 🤖 *AI & Chat Tools*
> 🔗 *URL Utilities*
> 📊 *Information Tools*
> 💣 *Message Utilities*
> 📱 *QR & Code Tools*

────────────────────
Select a command from the buttons below:`,
            buttons: [
                {
                    buttonId: `${userPrefix}tools_commands`,
                    buttonText: { displayText: '🔧 ᴛᴏᴏʟs ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🔧 TOOLS COMMANDS',
                            sections: [
                                {
                                    title: "🤖 AI & Chat",
                                    highlight_label: 'Artificial Intelligence',
                                    rows: [
                                        { title: "🤖 Draxen AI ", description: "Chat with Draxen AI", id: `${userPrefix}ai` },
                                        { title: "💬 ChatGPT", description: "GPT conversation", id: `${userPrefix}chatgpt` },
                                        { title: "🤖 Google Bard", description: "Bard AI", id: `${userPrefix}bard` }
                                    ]
                                },
                                {
                                    title: "🔗 URL Tools",
                                    highlight_label: 'Link Utilities',
                                    rows: [
                                        { title: "🔗 Shorten URL", description: "Make short link", id: `${userPrefix}shorturl` },
                                        { title: "📏 Expand URL", description: "Expand short link", id: `${userPrefix}expandurl` },
                                        { title: "📱 QR Code", description: "Generate QR", id: `${userPrefix}qr` },
                                        { title: "📲 To QR Code", description: "Text to QR", id: `${userPrefix}toqr` }
                                    ]
                                },
                                {
                                    title: "📊 Information",
                                    rows: [
                                        { title: "🔍 WhoIS", description: "Domain lookup", id: `${userPrefix}whois` },
                                        { title: "📊 User Info", description: "WhatsApp info", id: `${userPrefix}winfo` },
                                        { title: "🌦️ Weather", description: "Forecast", id: `${userPrefix}weather` }
                                    ]
                                },
                                {
                                    title: "💣 Message Tools",
                                    rows: [
                                        { title: "💣 Message Bomb", description: "Multiple messages", id: `${userPrefix}bomb` },
                                        { title: "💾 Save Status", description: "Save status", id: `${userPrefix}savestatus` },
                                        { title: "📲 Follow Channel", description: "Newsletter", id: `${userPrefix}fc` },
                                        { title: "📊 Create Poll", description: "Create poll", id: `${userPrefix}poll` },
                                         { title: "📃 Readmore text", description: "Create readmore text", id: `${userPrefix}radmore` },
                                          { title: "🧧 Translate texts", description: "Get message translation", id: `${userPrefix}trt` },
                                           { title: "🏮 Set language", description: "set language for translate texts", id: `${userPrefix}setlang` },
                                            { title: "📖 Bible", description: "Get bible verses", id: `${userPrefix}bible` },
                                             { title: "💋 text to speech", description: "Get speech from text", id: `${userPrefix}say` },
                                              { title: "🤔 Ask a question", description: "Get answers of questions", id: `${userPrefix}ask` },
                                               { title: "🧐 Define", description: "Get definitions ofthings", id: `${userPrefix}define` },
                                                { title: "🎬 IMDB", description: "search for movie details", id: `${userPrefix}imdb` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                 {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                 { buttonId: `${userPrefix}tools_menu-list`, buttonText: { displayText: '📃 Tools menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 },
                { buttonId: `${userPrefix}ai`, buttonText: { displayText: '🤖 Draxen AI' }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, toolsMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Tools menu-list error:', error);
        await replyglobal(m, '❌ Failed to load tools menu.');
    }
    break;
}

case 'Draxen': {
    try {
        await socket.sendMessage(sender, { react: { text: '👻', key: msg.key } });

         // Read current status for all features
        const autoreactData = readJSON(AUTOREACT_PATH);
        const autotypingData = readJSON(AUTOTYPING_PATH);
        const autorecordingData = readJSON(AUTORECORDING_PATH);
        const autostatusviewData = readJSON(AUTOSTATUSVIEW_PATH);
        const autostatusreactData = readJSON(AUTOSTATUSREACT_PATH);
        const antideleteData = readJSON(ANTIDELETE_PATH);
        const botModeData = readJSON(BOT_MODE_PATH);

        const currentMode = botModeData[number] || 'public';
        const isAutoreactActive = autoreactData[number] || false;
        const isAutotypingActive = autotypingData[number] || false;
        const isAutorecordingActive = autorecordingData[number] || false;
        const isAutostatusviewActive = autostatusviewData[number] || false;
        const isAutostatusreactActive = autostatusreactData[number] || false;
        const isAntideleteActive = antideleteData[sender] !== false;

        
        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);

        let DraxenText = `
━━━━━━━━━━━━━━━━━━━━
┃  👻 *DRAXEN-Ai FULL MENU*  🚀
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────
*📚 ALL AVAILABLE MENUS:*

Select any category below to explore all commands:
`;

        const DraxenMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `${DraxenText}`,
            buttons: [
                {
                    buttonId: `${userPrefix}all_menus`,
                    buttonText: { displayText: '📚 ᴀʟʟ ᴍᴇɴᴜs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '👻 DRAXEN-Ai ALL MENUS',
                            sections: [
                                {
                                    title: "🌐 GENERAL MENUS",
                                    highlight_label: 'Basic Commands',
                                    rows: [
                                        { title: "🧧 General Commands", description: "Basic bot commands", id: `${userPrefix}generalmenu` },
                                        { title: "📋 Main Menu", description: "Main navigation menu", id: `${userPrefix}menu` },
                                        { title: "📜 All Commands", description: "Complete command list", id: `${userPrefix}allmenu` },
                                        { title: "🟢 Bot Status", description: "Status commands", id: `${userPrefix}alive` }
                                    ]
                                },
                                {
                                    title: "🎵 MEDIA MENUS",
                                    highlight_label: 'Download & Media',
                                    rows: [
                                        { title: "🎵 Media Tools", description: "Downloaders & media", id: `${userPrefix}mediamenu` },
                                        { title: "📱 Social Media", description: "Social downloaders", id: `${userPrefix}song` },
                                        { title: "🖼️ AI Images", description: "AI image generation", id: `${userPrefix}Draxenfy` },
                                        { title: "📸 Profile Tools", description: "Profile utilities", id: `${userPrefix}getpp` }
                                    ]
                                },
                                {
                                    title: "🫂 GROUP MENUS",
                                    highlight_label: 'Group Management',
                                    rows: [
                                        { title: "🫂 Group Settings", description: "Group management", id: `${userPrefix}groupmenu` },
                                        { title: "👥 Member Control", description: "User management", id: `${userPrefix}add` },
                                        { title: "🔐 Group Controls", description: "Group settings", id: `${userPrefix}open` },
                                        { title: "📊 Group Info", description: "Group information", id: `${userPrefix}ginfo` }
                                    ]
                                },
                                {
                                    title: "📰 NEWS & INFO",
                                    highlight_label: 'Information',
                                    rows: [
                                        { title: "📰 News & Updates", description: "Latest news", id: `${userPrefix}newsmenu` },
                                        { title: "🚀 NASA & Tech", description: "Tech updates", id: `${userPrefix}nasa` },
                                        { title: "🌦️ Weather Info", description: "Weather forecast", id: `${userPrefix}weather` },
                                        { title: "🔍 Domain Lookup", description: "WhoIS information", id: `${userPrefix}whois` }
                                    ]
                                },
                                {
                                    title: "🖤 FUN & ENTERTAINMENT",
                                    highlight_label: 'Entertainment',
                                    rows: [
                                        { title: "🖤 Fun Commands", description: "Entertainment", id: `${userPrefix}funmenu` },
                                        { title: "😂 Jokes & Memes", description: "Humor commands", id: `${userPrefix}joke` },
                                        { title: "🐾 Animals", description: "Animal pictures", id: `${userPrefix}cat` },
                                        { title: "💬 Quotes", description: "Inspirational quotes", id: `${userPrefix}quote` }
                                    ]
                                },
                                {
                                    title: "🔧 TOOLS & UTILITIES",
                                    highlight_label: 'Utilities',
                                    rows: [
                                        { title: "🔧 Tools Menu", description: "All utilities", id: `${userPrefix}toolsmenu` },
                                        { title: "🤖 AI Chat", description: "AI assistants", id: `${userPrefix}ai` },
                                        { title: "🔗 URL Tools", description: "Link utilities", id: `${userPrefix}shorturl` },
                                        { title: "💣 Message Tools", description: "Message utilities", id: `${userPrefix}bomb` }
                                    ]
                                },
                                {
                                    title: "🤖 Owner commands",
                                    highlight_label: 'Access Control',
                                    rows: [
                                        { title: "🔒 Private Mode", description: "Only owner & admin can use", id: `${userPrefix}mode private` },
                                        { title: "🔓 Public Mode", description: "Everyone can use commands", id: `${userPrefix}mode public` }
                                    ]
                                },
                                {
                                    title: "👀 Status Features",
                                    highlight_label: 'Status Automation',
                                    rows: [
                                        { title: `Status View: ${isAutostatusviewActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Auto view status updates", id: `${userPrefix}autostatusview ${isAutostatusviewActive ? 'off' : 'on'}` },
                                        { title: `Status React: ${isAutostatusreactActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Auto react to status", id: `${userPrefix}autostatusreact ${isAutostatusreactActive ? 'off' : 'on'}` }
                                    ]
                                },
                                {
                                    title: "🔧 Prefix Management",
                                    highlight_label: 'Command Prefix',
                                    rows: [
                                        { title: "Change Prefix", description: "Set custom command prefix", id: `${userPrefix}setprefix` },
                                        { title: "Reset Prefix", description: "Reset to default prefix", id: `${userPrefix}resetprefix` },
                                        { title: "Show Current Prefix", description: "Display current prefix", id: `${userPrefix}prefix` }
                                    ]
                                },
                                {
                                    title: "🛡️ Security Features",
                                    highlight_label: 'Protection',
                                    rows: [
                                        { title: `Anti Delete: ${isAntideleteActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Recover deleted messages", id: `${userPrefix}antidelete ${isAntideleteActive ? 'off' : 'on'}` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                {
                    buttonId: `${userPrefix}quick_access`,
                    buttonText: { displayText: '⚡ ǫᴜɪᴄᴋ ᴀᴄᴄᴇss' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '⚡ QUICK ACCESS COMMANDS',
                            sections: [
                                {
                                    title: "🚀 Popular Commands",
                                    highlight_label: 'Most Used',
                                    rows: [
                                        { title: "🟢 Alive Check", description: "Check bot status", id: `${userPrefix}alive` },
                                        { title: "🎵 Song Download", description: "Download music", id: `${userPrefix}song` },
                                        { title: "🤖 AI Chat", description: "Chat with AI", id: `${userPrefix}ai` },
                                        { title: "😂 Random Joke", description: "Get a joke", id: `${userPrefix}joke` },
                                        { title: "📰 Latest News", description: "News updates", id: `${userPrefix}news` },
                                        { title: "🌦️ Weather", description: "Weather forecast", id: `${userPrefix}weather` },
                                        { title: "🔍 User Info", description: "WhatsApp info", id: `${userPrefix}winfo` },
                                        { title: "🖼️ AI Image", description: "Generate image", id: `${userPrefix}Draxenfy` }
                                    ]
                                },
                                {
                                    title: "🔧 Essential Tools",
                                    highlight_label: 'Utilities',
                                    rows: [
                                        { title: "📊 Bot Stats", description: "Bot statistics", id: `${userPrefix}bot_stats` },
                                        { title: "ℹ️ Bot Info", description: "Bot information", id: `${userPrefix}bot_info` },
                                        { title: "🏓 Ping Test", description: "Response speed", id: `${userPrefix}ping` },
                                        { title: "🔗 Shorten URL", description: "URL shortener", id: `${userPrefix}shorturl` },
                                        { title: "📸 View Once", description: "View once media", id: `${userPrefix}viewonce` },
                                        { title: "💣 Message Bomb", description: "Multiple messages", id: `${userPrefix}bomb` },
                                        { title: "📱 QR Code", description: "Generate QR", id: `${userPrefix}qr` },
                                        { title: "🎨 Create Logo", description: "Logo maker", id: `${userPrefix}logo` }
                                    ]
                                },
                                {
                                    title: "🌸 Popular Anime",
                                    highlight_label: 'Anime',
                                    rows: [
                                        { title: "🌸 Anime Waifu", description: "Random waifu images", id: `${userPrefix}animewaifu` },
                                        { title: "🐱 Neko Girls", description: "Cat girls", id: `${userPrefix}animeneko` },
                                        { title: "💋 Kissing Scenes", description: "Kiss images", id: `${userPrefix}animekiss` },
                                        { title: "🤗 Hugging Scenes", description: "Hug images", id: `${userPrefix}animehug` },
                                        { title: "👋 Slapping Scenes", description: "Slap images", id: `${userPrefix}animeslap` },
                                        { title: "😊 Happy Anime", description: "Happy expressions", id: `${userPrefix}animehappy` }
                                    ]
                                },
                                {
                                    title: "🩷 Popular Stickers",
                                    highlight_label: 'Stickers',
                                    rows: [
                                        { title: "🔄 Create Sticker", description: "From image/video", id: `${userPrefix}sticker` },
                                        { title: "💋 Kissing Sticker", description: "Kiss scenes", id: `${userPrefix}stickkiss` },
                                        { title: "🤗 Hugging Sticker", description: "Hug scenes", id: `${userPrefix}stickhug` },
                                        { title: "😊 Happy Sticker", description: "Happy anime", id: `${userPrefix}stickhappy` },
                                        { title: "👋 Slapping Sticker", description: "Slap scenes", id: `${userPrefix}stickslap` },
                                        { title: "💃 Dancing Sticker", description: "Dance scenes", id: `${userPrefix}stickdance` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                { buttonId: `${userPrefix}Draxen-Ai`, buttonText: { displayText: '📃 Draxen Menu list' }, type: 1 },
                { buttonId: `${userPrefix}alive`, buttonText: { displayText: '🟢 ᴀʟɪᴠᴇ' }, type: 1 },
                { buttonId: `${userPrefix}bot_stats`, buttonText: { displayText: '📊 sᴛᴀᴛs' }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, DraxenMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

        try {


            try {
            const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
            } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


        } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Draxen menu error:', error);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        
        let fallbackText = `
━━━━━━━━━━━━━━━━━━━━
┃ 👻 *DRAXEN-Ai FULL MENU*  🚀
━━━━━━━━━━━━━━━━━━━━
║  🤖 *Bot Name:* DRAXEN-Ai 
║  👋 *User:* @${m.sender.split('@')[0]}
║  📍 *Prefix:* ${userPrefix}
║ Mode: ${modeEmoji} ${currentMode.toUpperCase()}
║  ⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s
║  💾 *Memory:* ${usedMemory}MB/${totalMemory}MB
────────────────────

*📚 AVAILABLE MENU CATEGORIES:*
> ${userPrefix}general_menu-list - General commands
> ${userPrefix}media_menu-list - Media tools
> ${userPrefix}group_menu-list - Group settings
> ${userPrefix}news_menu-list - News & information
> ${userPrefix}fun_menu-list - Fun & entertainment
> ${userPrefix}tools_menu-list - Tools & utilities
> ${userPrefix}menu - Main menu

────────────────────
> *DRAXEN-Ai* 👻
`;

        await replyglobal(m, fallbackText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}





// Case: ownermenu (Interactive Owner Menu with Selection Buttons)
case 'ownermenu': {
    

    try {
        await socket.sendMessage(sender, { react: { text: '👑', key: msg.key } });

        // Read current status for all features
        const autoreactData = readJSON(AUTOREACT_PATH);
        const autotypingData = readJSON(AUTOTYPING_PATH);
        const autorecordingData = readJSON(AUTORECORDING_PATH);
        const autostatusviewData = readJSON(AUTOSTATUSVIEW_PATH);
        const autostatusreactData = readJSON(AUTOSTATUSREACT_PATH);
        const antideleteData = readJSON(ANTIDELETE_PATH);
        const botModeData = readJSON(BOT_MODE_PATH);

        const currentMode = botModeData[number] || 'public';
        const isAutoreactActive = autoreactData[number] || false;
        const isAutotypingActive = autotypingData[number] || false;
        const isAutorecordingActive = autorecordingData[number] || false;
        const isAutostatusviewActive = autostatusviewData[number] || false;
        const isAutostatusreactActive = autostatusreactData[number] || false;
        const isAntideleteActive = antideleteData[sender] !== false;

        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);

        const ownerMenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  👑 *OWNER MENU*  🚀
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────
📊 *CURRENT STATUS:*
🤖 Mode: ${currentMode === 'private' ? '🔒 PRIVATE' : '🔓 PUBLIC'}
⚡ Auto React: ${isAutoreactActive ? '✅ ON' : '❌ OFF'}
⌨️ Auto Typing: ${isAutotypingActive ? '✅ ON' : '❌ OFF'}
🎥 Auto Recording: ${isAutorecordingActive ? '✅ ON' : '❌ OFF'}
👀 Auto Status View: ${isAutostatusviewActive ? '✅ ON' : '❌ OFF'}
❤️ Auto Status React: ${isAutostatusreactActive ? '✅ ON' : '❌ OFF'}
🗑️ Anti Delete: ${isAntideleteActive ? '✅ ON' : '❌ OFF'}

────────────────────
Choose a feature to manage:`,
            buttons: [
                {
                    buttonId: `${userPrefix}owner_features`,
                    buttonText: { displayText: '🔧 ᴍᴀɴᴀɢᴇ ғᴇᴀᴛᴜʀᴇs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🔧 FEATURE MANAGEMENT',
                            sections: [
                                {
                                    title: "🤖 Bot Mode Settings",
                                    highlight_label: 'Access Control',
                                    rows: [
                                        { title: "🔒 Private Mode", description: "Only owner & admin can use", id: `${userPrefix}mode private` },
                                        { title: "🔓 Public Mode", description: "Everyone can use commands", id: `${userPrefix}mode public` }
                                    ]
                                },
                                {
                                    title: "⚡ Auto Features",
                                    highlight_label: 'Automation',
                                    rows: [
                                        { title: `Auto React: ${isAutoreactActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Auto react to messages", id: `${userPrefix}autoreact ${isAutoreactActive ? 'off' : 'on'}` },
                                        { title: `Auto Typing: ${isAutotypingActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Show typing indicator", id: `${userPrefix}autotype ${isAutotypingActive ? 'off' : 'on'}` },
                                        { title: `Auto Recording: ${isAutorecordingActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Show recording status", id: `${userPrefix}autorecording ${isAutorecordingActive ? 'off' : 'on'}` }
                                    ]
                                },
                                {
                                    title: "👀 Status Features",
                                    highlight_label: 'Status Automation',
                                    rows: [
                                        { title: `Status View: ${isAutostatusviewActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Auto view status updates", id: `${userPrefix}autostatusview ${isAutostatusviewActive ? 'off' : 'on'}` },
                                        { title: `Status React: ${isAutostatusreactActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Auto react to status", id: `${userPrefix}autostatusreact ${isAutostatusreactActive ? 'off' : 'on'}` }
                                    ]
                                },
                                     {
                                    title: "🔧 Prefix Management",
                                    highlight_label: 'Command Prefix',
                                    rows: [
                                        { title: "Change Prefix", description: "Set custom command prefix", id: `${userPrefix}setprefix` },
                                        { title: "Reset Prefix", description: "Reset to default prefix", id: `${userPrefix}resetprefix` },
                                        { title: "Show Current Prefix", description: "Display current prefix", id: `${userPrefix}prefix` }
                                    ]
                                },
                                {
                                    title: "🛡️ Security Features",
                                    highlight_label: 'Protection',
                                    rows: [
                                        { title: `Anti Delete: ${isAntideleteActive ? '✅ ON (deactivate)' : '❌ OFF (activate)'}`, description: "Recover deleted messages", id: `${userPrefix}antidelete ${isAntideleteActive ? 'off' : 'on'}` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                {
                    buttonId: `${userPrefix}owner_settings`,
                    buttonText: { displayText: '⚙️ ᴏᴛʜᴇʀ sᴇᴛᴛɪɴɢs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '⚙️ ADDITIONAL SETTINGS',
                            sections: [
                           
                                {
                                    title: "📊 Monitoring Tools",
                                    highlight_label: 'Statistics',
                                    rows: [
                                        { title: "Active Users", description: "View connected users", id: `${userPrefix}active` },
                                        { title: "Server Status", description: "Check server health", id: `${userPrefix}servers` },
                                        { title: "Bot Statistics", description: "Detailed performance stats", id: `${userPrefix}bot_stats` }
                                    ]
                                },
                                {
                                    title: "📢 Broadcast Tools",
                                    highlight_label: 'Mass Messaging',
                                    rows: [
                                        { title: "Broadcast to All", description: "Message all contacts", id: `${userPrefix}toall` },
                                        { title: "Broadcast by Country", description: "Message by country code", id: `${userPrefix}tocontact` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                {
                    buttonId: `${userPrefix}owner_menu-list`,
                    buttonText: { displayText: '📃 ᴏᴡɴᴇʀ ᴍᴇɴᴜ ʟɪsᴛ' },
                    type: 1
                },
                {
                    buttonId: `${userPrefix}menu`,
                    buttonText: { displayText: '🔙 ʙᴀᴄᴋ ᴛᴏ ᴍᴇɴᴜ' },
                    type: 1
                }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, ownerMenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
         try {

             try {
             const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
             } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

         } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Owner menu error:', error);
        await replyglobal(m, '❌ Failed to load owner menu.');
    }
    break;
}



// Case: animemenu - Complete with all anime commands in buttons
case 'animemenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🎨', key: msg.key } });

        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        
        const animemenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────
  🎨 *ANIME COMMANDS*  

> 🌸 *Waifu & Characters*
> 🎭 *Emotion Reactions*
> 💞 *Romantic Actions*
> 👊 *Action Scenes*
> 🎉 *Fun & Interactive*
> 📱 *Wallpapers & More*
> 🐾 *Animal Girls*
> 🎱 *Game Related*

────────────────────
Select a command from the buttons below:`,
            buttons: [
                {
                    buttonId: `${userPrefix}anime_commands`,
                    buttonText: { displayText: '🎨 ᴀɴɪᴍᴇ ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🎨 ANIME COMMANDS',
                            sections: [
                                {
                                    title: "🌸 Waifu & Characters",
                                    highlight_label: 'Characters',
                                    rows: [
                                        { title: "🌸 Anime Waifu", description: "Random waifu images", id: `${userPrefix}animewaifu` },
                                        { title: "🐱 Neko Girls", description: "Cat girls", id: `${userPrefix}animeneko` },
                                        { title: "🦊 Fox Girls", description: "Fox girl images", id: `${userPrefix}animefoxgirl` },
                                        { title: "👤 Anime Avatar", description: "Anime avatars", id: `${userPrefix}animeavatar` },
                                        { title: "💥 Megumin", description: "Megumin images", id: `${userPrefix}animemegumin` },
                                        { title: "⚔️ Shinobu", description: "Shinobu images", id: `${userPrefix}animeshinobu` }
                                    ]
                                },
                                {
                                    title: "🎭 Emotion Reactions",
                                    highlight_label: 'Emotions',
                                    rows: [
                                        { title: "😊 Happy Anime", description: "Happy expressions", id: `${userPrefix}animehappy` },
                                        { title: "😢 Crying Anime", description: "Crying scenes", id: `${userPrefix}animecry` },
                                        { title: "😳 Blushing Anime", description: "Blush reactions", id: `${userPrefix}animeblush` },
                                        { title: "😄 Smiling Anime", description: "Smile expressions", id: `${userPrefix}animesmile` },
                                        { title: "😏 Smug Anime", description: "Smug reactions", id: `${userPrefix}animesmug` },
                                        { title: "🤦 Cringe Anime", description: "Cringe reactions", id: `${userPrefix}animecringe` }
                                    ]
                                },
                                {
                                    title: "💞 Romantic Actions",
                                    highlight_label: 'Romantic',
                                    rows: [
                                        { title: "💋 Kissing Scenes", description: "Kiss images", id: `${userPrefix}animekiss` },
                                        { title: "🤗 Hugging Scenes", description: "Hug images", id: `${userPrefix}animehug` },
                                        { title: "🥰 Cuddling Scenes", description: "Cuddle images", id: `${userPrefix}animecuddle` },
                                        { title: "👅 Licking Scenes", description: "Lick images", id: `${userPrefix}animelick` },
                                        { title: "🦷 Biting Scenes", description: "Bite images", id: `${userPrefix}animebite` },
                                        { title: "🤝 Hand Holding", description: "Hand hold images", id: `${userPrefix}animehandhold` }
                                    ]
                                },
                                {
                                    title: "👊 Action Scenes",
                                    highlight_label: 'Actions',
                                    rows: [
                                        { title: "👋 Slapping Scenes", description: "Slap images", id: `${userPrefix}animeslap` },
                                        { title: "💥 Bonk Scenes", description: "Bonk images", id: `${userPrefix}animebonk` },
                                        { title: "😈 Bullying Scenes", description: "Bully images", id: `${userPrefix}animebully` },
                                        { title: "🗡️ Fighting Scenes", description: "Kill images", id: `${userPrefix}animekill` },
                                        { title: "🚀 Throwing Scenes", description: "Yeet images", id: `${userPrefix}animeyeet` },
                                        { title: "💃 Dancing Anime", description: "Dance images", id: `${userPrefix}animedance` }
                                    ]
                                },
                                {
                                    title: "🎉 Fun & Interactive",
                                    highlight_label: 'Fun',
                                    rows: [
                                        { title: "👋 Waving Anime", description: "Wave images", id: `${userPrefix}animewave` },
                                        { title: "😉 Winking Anime", description: "Wink images", id: `${userPrefix}animewink` },
                                        { title: "👉 Poking Scenes", description: "Poke images", id: `${userPrefix}animepoke` },
                                        { title: "💕 Head Pats", description: "Pat images", id: `${userPrefix}animepat` },
                                        { title: "🖐️ High Five", description: "High five images", id: `${userPrefix}animehighfive` },
                                        { title: "🏃 Glomping Scenes", description: "Glomp images", id: `${userPrefix}animeglomp` }
                                    ]
                                },
                                {
                                    title: "📱 Wallpapers & More",
                                    highlight_label: 'Wallpapers',
                                    rows: [
                                        { title: "🖼️ Anime Wallpaper", description: "Wallpaper images", id: `${userPrefix}animewlp` },
                                        { title: "🎨 GECG Images", description: "GECG art", id: `${userPrefix}animegecg` },
                                        { title: "🍽️ Eating Scenes", description: "Nom images", id: `${userPrefix}animenom` },
                                        { title: "👉 Tickling Scenes", description: "Tickle images", id: `${userPrefix}animetickle` },
                                        { title: "🍼 Feeding Scenes", description: "Feed images", id: `${userPrefix}animefeed` }
                                    ]
                                },
                                {
                                    title: "🐾 Animal Girls",
                                    rows: [
                                        { title: "🐱 Cat Girls", description: "Cat meow images", id: `${userPrefix}catmeow` },
                                        { title: "🐶 Dog Girls", description: "Dog woof images", id: `${userPrefix}dogwoof` },
                                        { title: "🦎 Lizard Girls", description: "Lizard images", id: `${userPrefix}lizardpic` },
                                        { title: "🦢 Goose Girls", description: "Goose images", id: `${userPrefix}goosebird` }
                                    ]
                                },
                                {
                                    title: "🎱 Game Related",
                                    rows: [
                                        { title: "🎱 8 Ball Pool", description: "8 Ball images", id: `${userPrefix}8ballpool` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                { buttonId: `${userPrefix}anime_menu-list`, buttonText: { displayText: '📃 Anime menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, animemenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

        try {


            try {
            const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
            } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


        } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Anime menu error:', error);
        await replyglobal(m, '❌ Failed to load anime menu.');
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}

// Case: stickermenu - Complete with all sticker commands in buttons
case 'stickermenu': {
    try {
        await socket.sendMessage(sender, { react: { text: '🩷', key: msg.key } });

        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        
        const stickermenu = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────
  🩷 *STICKER COMMANDS*  

> 🔄 *Basic Stickers*
> 🎭 *Emotion Stickers*
> 💞 *Romantic Stickers*
> 👊 *Action Stickers*
> 🎉 *Fun Stickers*
> 🔄 *Interactive Stickers*
> 🌸 *Character Stickers*

────────────────────
Select a command from the buttons below:`,
            buttons: [
                {
                    buttonId: `${userPrefix}sticker_commands`,
                    buttonText: { displayText: '🩷 sᴛɪᴄᴋᴇʀ ᴄᴍᴅs' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🩷 STICKER COMMANDS',
                            sections: [
                                {
                                    title: "🔄 Basic Stickers",
                                    highlight_label: 'Basic',
                                    rows: [
                                        { title: "🔄 Create Sticker", description: "From image/video", id: `${userPrefix}sticker` },
                                        { title: "⚡ Sticker Shortcut", description: "Quick sticker", id: `${userPrefix}s` },
                                        { title: "🩹 Stickern to photo", description: "Stiker command", id: `${userPrefix}toimage` }
                                    ]
                                },
                                {
                                    title: "🎭 Emotion Stickers",
                                    highlight_label: 'Emotions',
                                    rows: [
                                        { title: "😊 Happy Sticker", description: "Happy anime", id: `${userPrefix}stickhappy` },
                                        { title: "😢 Crying Sticker", description: "Crying anime", id: `${userPrefix}stickcry` },
                                        { title: "😳 Blushing Sticker", description: "Blush anime", id: `${userPrefix}stickblush` },
                                        { title: "😄 Smiling Sticker", description: "Smile anime", id: `${userPrefix}sticksmile` },
                                        { title: "😏 Smug Sticker", description: "Smug anime", id: `${userPrefix}sticksmug` },
                                        { title: "🤦 Cringe Sticker", description: "Cringe reaction", id: `${userPrefix}stickcringe` }
                                    ]
                                },
                                {
                                    title: "💞 Romantic Stickers",
                                    highlight_label: 'Romantic',
                                    rows: [
                                        { title: "💋 Kissing Sticker", description: "Kiss scenes", id: `${userPrefix}stickkiss` },
                                        { title: "🤗 Hugging Sticker", description: "Hug scenes", id: `${userPrefix}stickhug` },
                                        { title: "🥰 Cuddling Sticker", description: "Cuddle scenes", id: `${userPrefix}stickcuddle` },
                                        { title: "👅 Licking Sticker", description: "Lick scenes", id: `${userPrefix}sticklick` },
                                        { title: "🦷 Biting Sticker", description: "Bite scenes", id: `${userPrefix}stickbite` },
                                        { title: "🤝 Hand Holding", description: "Hand hold", id: `${userPrefix}stickhandhold` }
                                    ]
                                },
                                {
                                    title: "👊 Action Stickers",
                                    highlight_label: 'Actions',
                                    rows: [
                                        { title: "👋 Slapping Sticker", description: "Slap scenes", id: `${userPrefix}stickslap` },
                                        { title: "💥 Bonk Sticker", description: "Bonk scenes", id: `${userPrefix}stickbonk` },
                                        { title: "😈 Bullying Sticker", description: "Bully scenes", id: `${userPrefix}stickbully` },
                                        { title: "🗡️ Fighting Sticker", description: "Kill scenes", id: `${userPrefix}stickkill` },
                                        { title: "🚀 Throwing Sticker", description: "Yeet scenes", id: `${userPrefix}stickyeet` }
                                    ]
                                },
                                {
                                    title: "🎉 Fun Stickers",
                                    highlight_label: 'Fun',
                                    rows: [
                                        { title: "💃 Dancing Sticker", description: "Dance scenes", id: `${userPrefix}stickdance` },
                                        { title: "👋 Waving Sticker", description: "Wave scenes", id: `${userPrefix}stickwave` },
                                        { title: "😉 Winking Sticker", description: "Wink scenes", id: `${userPrefix}stickwink` },
                                        { title: "👉 Poking Sticker", description: "Poke scenes", id: `${userPrefix}stickpoke` },
                                        { title: "💕 Head Pats", description: "Pat scenes", id: `${userPrefix}stickpat` }
                                    ]
                                },
                                {
                                    title: "🔄 Interactive Stickers",
                                    highlight_label: 'Interactive',
                                    rows: [
                                        { title: "🖐️ High Five", description: "High five", id: `${userPrefix}stickhighfive` },
                                        { title: "🏃 Glomping Sticker", description: "Glomp scenes", id: `${userPrefix}stickglomp` },
                                        { title: "🍽️ Eating Sticker", description: "Nom scenes", id: `${userPrefix}sticknom` },
                                        { title: "👉 Tickling Sticker", description: "Tickle scenes", id: `${userPrefix}sticktickle` },
                                        { title: "👋 Spanking Sticker", description: "Spank scenes", id: `${userPrefix}stickspank` }
                                    ]
                                },
                                {
                                    title: "🌸 Character Stickers",
                                    rows: [
                                        { title: "⚔️ Shinobu Sticker", description: "Shinobu scenes", id: `${userPrefix}stickshinobu` },
                                        { title: "🐺 Awoo Sticker", description: "Awoo scenes", id: `${userPrefix}stickawoo` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                {
                    buttonId: `${userPrefix}how-to-deply`,
                    buttonText: { displayText: '🤖 Connect to this bot for free🤖' },
                    type: 1
                },
                { buttonId: `${userPrefix}sticker_menu-list`, buttonText: { displayText: '📃 Sticker menu list' }, type: 1 },
                { buttonId: `${userPrefix}menu`, buttonText: { displayText: '🔙 Back to Menu' }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        await socket.sendMessage(from, stickermenu, { quoted: m });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

        try {


            try {
            const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
            } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


        } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Sticker menu error:', error);
        await replyglobal(m, '❌ Failed to load sticker menu.');
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}




// Case: owner_menu-list (Owner Commands Text List)
case 'owner_menu-list': {


    try {
        // Read current status
        const autoreactData = readJSON(AUTOREACT_PATH);
        const autotypingData = readJSON(AUTOTYPING_PATH);
        const autorecordingData = readJSON(AUTORECORDING_PATH);
        const autostatusviewData = readJSON(AUTOSTATUSVIEW_PATH);
        const autostatusreactData = readJSON(AUTOSTATUSREACT_PATH);
        const antideleteData = readJSON(ANTIDELETE_PATH);
        const botModeData = readJSON(BOT_MODE_PATH);

        const currentMode = botModeData[number] || 'public';
        const isAutoreactActive = autoreactData[number] || false;
        const isAutotypingActive = autotypingData[number] || false;
        const isAutorecordingActive = autorecordingData[number] || false;
        const isAutostatusviewActive = autostatusviewData[number] || false;
        const isAutostatusreactActive = autostatusreactData[number] || false;
        const isAntideleteActive = antideleteData[sender] !== false;

        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);

        const ownerText = `
━━━━━━━━━━━━━━━━━━━━
┃  👑 *OWNER COMMANDS*  🚀
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────
📊 *CURRENT STATUS:*
🤖 Mode: ${currentMode === 'private' ? '🔒 PRIVATE' : '🔓 PUBLIC'}
⚡ Auto React: ${isAutoreactActive ? '✅ ON' : '❌ OFF'}
⌨️ Auto Typing: ${isAutotypingActive ? '✅ ON' : '❌ OFF'}
🎥 Auto Recording: ${isAutorecordingActive ? '✅ ON' : '❌ OFF'}
👀 Auto Status View: ${isAutostatusviewActive ? '✅ ON' : '❌ OFF'}
❤️ Auto Status React: ${isAutostatusreactActive ? '✅ ON' : '❌ OFF'}
🗑️ Anti Delete: ${isAntideleteActive ? '✅ ON' : '❌ OFF'}

🤖 *BOT MODE:*
> ${userPrefix}mode private - Set private mode
> ${userPrefix}mode public - Set public mode

⚡ *AUTO FEATURES:*
> ${userPrefix}autoreact on/off - Auto react to messages
> ${userPrefix}autotype on/off - Auto typing indicator  
> ${userPrefix}autorecording on/off - Auto recording status
> ${userPrefix}autostatusview on/off - Auto view status
> ${userPrefix}autostatusreact on/off - Auto react to status
> ${userPrefix}antidelete on/off - Recover deleted messages

🔧 *PREFIX SETTINGS:*
> ${userPrefix}setprefix <symbol> - Change prefix
> ${userPrefix}resetprefix - Reset to default
> ${userPrefix}prefix - Show current prefix

📢 *BROADCAST TOOLS:*
> ${userPrefix}toall <message> - Broadcast to all
> ${userPrefix}tocontact <code> <message> - Broadcast by country

📈 *MONITORING:*
> ${userPrefix}active - View active users
> ${userPrefix}servers - Server status
> ${userPrefix}bot_stats - Performance stats

⚙️ *SYSTEM:*
> ${userPrefix}deleteme - Delete session
> ${userPrefix}owner - Owner info
> ${userPrefix}bug <report> - Report bugs
> ${userPrefix}save - download status uodate
> ${userPrefix}block - block someome
> ${userPrefix}unlblock - unblock participant
> ${userPrefix}setpp - set profile picture
> ${userPrefix}pinchat - pin a chat
> ${userPrefix}unpinchat - unpin a chat
> ${userPrefix}spam - send multiple messages to a chat
> ${userPrefix}boom - send multiple messages to a number
> ${userPrefix}img - search images

────────────────────
> Use .ownermenu for interactive controls
> *DRAXEN-Ai* 👑
`;

        await replyglobal(m, ownerText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
         try {

             try {
             const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
             } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

         } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Owner menu-list error:', error);
        await replyglobal(m, '❌ Failed to load owner commands list.');
    }
    break;
}





//=====================================================[anime menu list]


case 'anime_menu-list': {
    try {
        await socket.sendMessage(sender, { react: { text: '📜', key: msg.key } });
        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        const animeListText = `
━━━━━━━━━━━━━━━━━━━━
┃  📜 *FULL ANIME COMMANDS LIST*  
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────

🌸 *Character Specific:*
${userPrefix}animemegumin
${userPrefix}animeshinobu

🎭 *Emotions:*
${userPrefix}animehappy
${userPrefix}animecry
${userPrefix}animeblush
${userPrefix}animesmile
${userPrefix}animesmug
${userPrefix}animecringe

💞 *Romantic:*
${userPrefix}animekiss
${userPrefix}animehug
${userPrefix}animecuddle
${userPrefix}animelick
${userPrefix}animebite
${userPrefix}animehandhold

👊 *Actions:*
${userPrefix}animeslap
${userPrefix}animebonk
${userPrefix}animebully
${userPrefix}animekill
${userPrefix}animeyeet
${userPrefix}animedance
${userPrefix}animewave
${userPrefix}animewink
${userPrefix}animepoke
${userPrefix}animepat

🔄 *Interactive:*
${userPrefix}animehighfive
${userPrefix}animeglomp
${userPrefix}animenom
${userPrefix}animetickle
${userPrefix}animefeed

📱 *Wallpapers & Misc:*
${userPrefix}animewlp
${userPrefix}animegecg
${userPrefix}animewaifu
${userPrefix}animeneko
${userPrefix}animefoxgirl
${userPrefix}animeavatar

🐾 *Animals:*
${userPrefix}catmeow
${userPrefix}dogwoof
${userPrefix}lizardpic
${userPrefix}goosebird

🎱 *Games:*
${userPrefix}8ballpool

────────────────────
Total: 40+ Anime Commands
> Type *${userPrefix}animemenu* for categories
> *DRAXEN-Ai* 📜
`;

        await replyglobal(m, animeListText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

         try {


             try {
             const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
             } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


         } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Anime list error:', error);
        await replyglobal(m, '❌ Failed to load anime command list.');
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}



//=========================================================[]








//==========================================[stickermenu list]





case 'sticker_menu-list': {
    try {
        await socket.sendMessage(sender, { react: { text: '📜', key: msg.key } });

const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        
        const stickerListText = `
━━━━━━━━━━━━━━━━━━━━
┃  📜 *FULL STICKER COMMANDS LIST*  
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────

🔄 *Basic:*
${userPrefix}sticker
${userPrefix}s
${userPrefix}stiker

🎭 *Emotions:*
${userPrefix}stickhappy
${userPrefix}stickcry
${userPrefix}stickblush
${userPrefix}sticksmile
${userPrefix}sticksmug
${userPrefix}stickcringe

💞 *Romantic:*
${userPrefix}stickkiss
${userPrefix}stickhug
${userPrefix}stickcuddle
${userPrefix}sticklick
${userPrefix}stickbite
${userPrefix}stickhandhold

👊 *Actions:*
${userPrefix}stickslap
${userPrefix}stickbonk
${userPrefix}stickbully
${userPrefix}stickkill
${userPrefix}stickyeet

🎉 *Fun:*
${userPrefix}stickdance
${userPrefix}stickwave
${userPrefix}stickwink
${userPrefix}stickpoke
${userPrefix}stickpat

🔄 *Interactive:*
${userPrefix}stickhighfive
${userPrefix}stickglomp
${userPrefix}sticknom
${userPrefix}sticktickle
${userPrefix}stickspank

🌸 *Characters:*
${userPrefix}stickshinobu
${userPrefix}stickawoo

────────────────────
Total: 25+ Sticker Commands
> Type *${userPrefix}stickermenu* for categories
> *DRAXEN-Ai* 📜
`;

        await replyglobal(m, stickerListText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

         try {


             try {
             const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
             } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


         } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Sticker list error:', error);
        await replyglobal(m, '❌ Failed to load sticker command list.');
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}




//=================================================[]


// Case: menu
case 'menu_list': {
    try {
        await socket.sendMessage(sender, { react: { text: '🤖', key: msg.key } });
        const startTime = socketCreationTime.get(number) || Date.now();
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);

        let menuText = `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║👋 Hello @${m.sender.split('@')[0]},
║⚡ *Bot Name:* DRAXEN-Ai  
║🎭 *Ultimate WhatsApp Bot*
║👨‍💻 *Developer:* Draxen
║🔗 *Website:* https://Draxen-Ai-bot.vercel.app
────────────────────
📌 *BOT STATUS*  
> 📡 *Uptime:* ${hours}h ${minutes}m ${seconds}s
> ⚡ *Prefix:* ${userPrefix} 
> 📳  *Mode:* ${modeEmoji} ${currentMode.toUpperCase()}
> 🖥️ *server:* ${server}
> 📂 *Memory:* ${usedMemory}MB/${totalMemory}MB  
> 🎛️ *Version:* 2.0.0  
────────────────────
*📁 AVAILABLE MENUS:*

> ${userPrefix}Draxen-Ai
> ${userPrefix}general_menu-list
> ${userPrefix}media_menu-list
> ${userPrefix}group_menu-list
> ${userPrefix}news_menu-list
> ${userPrefix}fun_menu-list
> ${userPrefix}tools_menu-list
> ${userPrefix}owner_menu-list
> ${userPrefix}sticker_menu-list
> ${userPrefix}anime_menu-list

────────────────────
*🔧 QUICK COMMANDS:*
> ${userPrefix}alive - Check bot status
> ${userPrefix}ping - Check response speed
> ${userPrefix}bot_info - Bot information
> ${userPrefix}bot_stats - Bot statistics
> ${userPrefix}Draxen-Ai - Full command list

> *DRAXEN-Ai* 🤖
`;

        await replyglobal(m, menuText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Menu command error:', error);
        await replyglobal(m, '❌ Failed to load menu. Please try again later.');
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}

// Case: general (General Commands Menu)
case 'general_menu-list': {
    try {
        const generalText = `
━━━━━━━━━━━━━━━━━━━━
┃🌐 *GENERAL COMMANDS*  
━━━━━━━━━━━━━━━━━━━━

🟢 *Bot Status:*
> ${userPrefix}alive - Check if bot is active
> ${userPrefix}ping - Check bot response speed
> ${userPrefix}bot_stats - View bot statistics
> ${userPrefix}bot_info - Get bot information

📋 *Menu & Help:*
> ${userPrefix}menu - Show main menu
> ${userPrefix}allmenu - List all commands
> ${userPrefix}help <cmd> - Command help

🎨 *Content Creation:*
> ${userPrefix}fancy <text> - Fancy text generator
> ${userPrefix}logo <text> - Create custom logos
> ${userPrefix}pair - Generate pairing code
> ${userPrefix}fliptext <text> - Reverse text

💝 *Support & Donations:*
> ${userPrefix}donate - Support the bot
> ${userPrefix}support - Join support channel
> ${userPrefix}Draxen - About developer
> ${userPrefix}bug <text> - Report issues

🔮 *Miscellaneous:*
> ${userPrefix}repo - Bot repository
> ${userPrefix}version - Bot version
> ${userPrefix}lyrics <song>|<artist> - Song lyrics
> ${userPrefix}runtime - check the time your bot run

────────────────────
> Type *${userPrefix}menu* to go back
> *DRAXEN-Ai* 🌐
`;

        await replyglobal(m, generalText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
          try {

              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('General menu error:', error);
        await replyglobal(m, '❌ Failed to load general commands menu.');
    }
    break;
}

// Case: media (Media Tools Menu)
case 'media_menu-list': {
    try {
        const mediaText = `
━━━━━━━━━━━━━━━━━━━━
┃  🎵 *MEDIA TOOLS*  
━━━━━━━━━━━━━━━━━━━━

📥 *Downloaders:*
> ${userPrefix}song <name> - Download YouTube music
> ${userPrefix}tiktok <url> - Download TikTok videos
> ${userPrefix}fb <url> - Download Facebook content
> ${userPrefix}ig <url> - Download Instagram content
> ${userPrefix}apk <name> - Download APK files

🖼️ *Media Tools:*
> ${userPrefix}Draxenfy <prompt> - Generate AI images
> ${userPrefix}viewonce - Access view-once media
> ${userPrefix}tourl - Upload media to link
> ${userPrefix}getpp @user - Fetch profile picture
> ${userPrefix}analyse - AI image analysis

✨ *Sticker Tools:*
> ${userPrefix}sticker - Create sticker from image/video
> ${userPrefix}smeme <text1>|<text2> - Create meme sticker
> ${userPrefix}toimage - Convert sticker to image
> ${userPrefix}emojimix <emoji1>+<emoji2> - Mix emojis

🎵 *Audio/Video:*
> ${userPrefix}audio <url> - Extract audio from video
> ${userPrefix}video <url> - Download video
> ${userPrefix}tomp3 - change video to be audio
> ${userPrefix}tomp4 - change sticker to be video

────────────────────
> Type *${userPrefix}menu* to go back
> *DRAXEN-Ai* 🎵
`;

        await replyglobal(m, mediaText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
          try {

              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Media menu error:', error);
        await replyglobal(m, '❌ Failed to load media tools menu.');
    }
    break;
}

// Case: group (Group Settings Menu)
case 'group_menu-list': {
    try {
        const groupText = `
━━━━━━━━━━━━━━━━━━━━
┃  🫂 *GROUP SETTINGS*  
━━━━━━━━━━━━━━━━━━━━

👥 *Member Management:*
> ${userPrefix}add @user - Add members to group
> ${userPrefix}kick @user - Remove member from group
> ${userPrefix}promote @user - Promote to admin
> ${userPrefix}demote @user - Demote from admin

🔐 *Group Controls:*
> ${userPrefix}open - Unlock group
> ${userPrefix}close - Lock group
> ${userPrefix}tagall - Tag all members
> ${userPrefix}join <link> - Join group via link

📊 *Group Info:*
> ${userPrefix}ginfo - Group information
> ${userPrefix}listadmin - List admins
> ${userPrefix}members - List members

⚙️ *Group Utilities:*
> ${userPrefix}setname <text> - Change group name
> ${userPrefix}setdesc <text> - Change description
> ${userPrefix}setppgroup - Change group profile picture
> ${userPrefix}revoke - Reset group invite link

👑 *Admin Tools:*
> ${userPrefix}demoteall - Demote all admins
> ${userPrefix}alladmins - Promote all members to admin
> ${userPrefix}editinfo <open/close> - Edit info settings
> ${userPrefix}toall <text> - Broadcast to all members
> ${userPrefix}tocontact <code> <text> - Broadcast by country code
> ${userPrefix}vcf <create contact vcf file of a group with names
> ${userPrefix}approveall - approve all pending join requests
> ${userPrefix}tagadmins - get list of all admins
> ${userPrefix}tag - reply a message to tag it
> ${userPrefix}hidetag - send a message anonymously (tagall)
> ${userPrefix}broadcastgroup - send a message to all groups you have
> ${userPrefix}join - join to a group
> ${userPrefix}getjoinrequest - get list all pending join rqwuests


────────────────────
> Type *${userPrefix}menu* to go back
> *DRAXEN-Ai* 🫂
`;

        await replyglobal(m, groupText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
          try {

              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Group menu error:', error);
        await replyglobal(m, '❌ Failed to load group settings menu.');
    }
    break;
}

// Case: news (News & Info Menu)
case 'news_menu-list': {
    try {
        const newsText = `
━━━━━━━━━━━━━━━━━━━━
┃  📰 *NEWS & INFORMATION*  
━━━━━━━━━━━━━━━━━━━━

📰 *News Sources:*
> ${userPrefix}news - Latest news updates
> ${userPrefix}gossip - Entertainment gossip
> ${userPrefix}cricket - Cricket scores & news

🚀 *Technology & Science:*
> ${userPrefix}nasa - NASA space updates
> ${userPrefix}tech - Technology news
> ${userPrefix}science - Science updates

🌐 *Information:*
> ${userPrefix}weather <city> - Weather forecast
> ${userPrefix}whois <domain> - Domain lookup
> ${userPrefix}winfo @user - WhatsApp user info

────────────────────
> Type *${userPrefix}menu* to go back
> *DRAXEN-Ai* 📰
`;

        await replyglobal(m, newsText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

          try {


              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('News menu error:', error);
        await replyglobal(m, '❌ Failed to load news menu.');
    }
    break;
}

// Case: fun (Fun & Entertainment Menu)
case 'fun_menu-list': {
    try {
        const funText = `
━━━━━━━━━━━━━━━━━━━━
┃  🖤 *FUN & ENTERTAINMENT*  
━━━━━━━━━━━━━━━━━━━━

😂 *Jokes & Humor:*
> ${userPrefix}joke - Lighthearted joke
> ${userPrefix}darkjoke - Dark humor joke
> ${userPrefix}roast @user - Savage roast
> ${userPrefix}meme - Random meme

🐾 *Animals:*
> ${userPrefix}cat - Cute cat picture
> ${userPrefix}dog - Cute dog picture
> ${userPrefix}waifu - Random anime waifu

💬 *Quotes & Lines:*
> ${userPrefix}quote - Bold quote
> ${userPrefix}lovequote - Romantic love quote
> ${userPrefix}pickupline - Cheesy pickup line
> ${userPrefix}fact - Random fact

🎮 *Games & Fun:*
> ${userPrefix}truth - Truth question
> ${userPrefix}dare - Dare challenge
> ${userPrefix}quiz - Random quiz
> ${userPrefix}charactercheck - check character
> ${userPrefix}beautifylcheck -for girls
> ${userPrefix}handsomecheck - form men
> ${userPrefix}checkme - details about you
> ${userPrefix}coffee - random coffee
> ${userPrefix}soulmate - find soulmate in a group
> ${userPrefix}rate - rate something

────────────────────
> Type *${userPrefix}menu* to go back
> *DRAXEN-Ai* 🖤
`;

        await replyglobal(m, funText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
          try {

              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Fun menu error:', error);
        await replyglobal(m, '❌ Failed to load fun menu.');
    }
    break;
}

// Case: tools (Tools & Utilities Menu)
case 'tools_menu-list': {
    try {
        const toolsText = `
━━━━━━━━━━━━━━━━━━━━
┃  🔧 *TOOLS & UTILITIES*  
━━━━━━━━━━━━━━━━━━━━

🤖 *AI & Chat:*
> ${userPrefix}ai <text> - Chat with AI assistant
> ${userPrefix}chatgpt <text> - GPT conversation
> ${userPrefix}bard <text> - Google Bard AI

🔗 *URL Tools:*
> ${userPrefix}shorturl <url> - Shorten URL
> ${userPrefix}expandurl <url> - Expand short URL
> ${userPrefix}qr <text> - Generate QR code
> ${userPrefix}toqr <text> - Convert text to QR code

📊 *Information Tools:*
> ${userPrefix}whois <domain> - Domain lookup
> ${userPrefix}winfo @user - WhatsApp user info
> ${userPrefix}weather <city> - Weather forecast

💣 *Message Tools:*
> ${userPrefix}bomb <text> - Send multiple messages
> ${userPrefix}savestatus - Save status
> ${userPrefix}fc - Follow newsletter
> ${userPrefix}poll <question>|<options> - Create poll
> ${userPrefix}readmore - create readmore text
> ${userPrefix}trt - translate any text
> ${userPrefix}setlang - select language for translation default
> ${userPrefix}bible - get Bible verses translated
> ${userPrefix}say - get a voice note of any words you want
> ${userPrefix}ask - ask a question
> ${userPrefix}define - define something
> ${userPrefix}imdb - search for movie details in imdb

────────────────────
> Type *${userPrefix}menu* to go back
> *DRAXEN-Ai* 🔧
`;

        await replyglobal(m, toolsText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });

await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
          try {

              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Tools menu error:', error);
        await replyglobal(m, '❌ Failed to load tools menu.');
    }
    break;
}

// Case: Draxen-Ai (Full Command List)
case 'Draxen-Ai': {
    try {
        const allmenuText = `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
──────────────────── 

  📜 *FULL COMMAND LIST*  

🤖 *OWNER COMMANDS:*
━━━━━━━━━━━━━━━━━━━━
> ${userPrefix}mode private
> ${userPrefix}mode public 
> ${userPrefix}autoreact on/off 
> ${userPrefix}autotype on/off 
> ${userPrefix}autorecording on/off 
> ${userPrefix}autostatusview on/off 
> ${userPrefix}autostatusreact on/off 
> ${userPrefix}antidelete on/off 
> ${userPrefix}setprefix <symbol>
> ${userPrefix}resetprefix
> ${userPrefix}prefix
> ${userPrefix}toall <message> 
> ${userPrefix}tocontact <code> <message> 
> ${userPrefix}active 
> ${userPrefix}servers 
> ${userPrefix}bot_stats 
> ${userPrefix}deleteme 
> ${userPrefix}owner 
> ${userPrefix}bug <report>
────────────────────

*🌐 GENERAL:*
────────────────────
> ${userPrefix}alive
> ${userPrefix}ping
> ${userPrefix}bot_stats
> ${userPrefix}bot_info
> ${userPrefix}menu
> ${userPrefix}allmenu
> ${userPrefix}help
> ${userPrefix}fancy
> ${userPrefix}logo
> ${userPrefix}pair
> ${userPrefix}fliptext
> ${userPrefix}repo
> ${userPrefix}version
> ${userPrefix}donate
> ${userPrefix}support
> ${userPrefix}Draxen
> ${userPrefix}bug
> ${userPrefix}lyrics
────────────────────

*🎵 MEDIA:*
────────────────────
> ${userPrefix}song
> ${userPrefix}tiktok
> ${userPrefix}fb
> ${userPrefix}ig
> ${userPrefix}apk
> ${userPrefix}Draxenfy
> ${userPrefix}viewonce
> ${userPrefix}tourl2
> ${userPrefix}getpp
> ${userPrefix}analyse
> ${userPrefix}sticker
> ${userPrefix}smeme
> ${userPrefix}toimage
> ${userPrefix}emojimix
> ${userPrefix}audio
> ${userPrefix}video
────────────────────

*🫂 GROUP:*
────────────────────
> ${userPrefix}add
> ${userPrefix}kick
> ${userPrefix}promote
> ${userPrefix}demote
> ${userPrefix}open
> ${userPrefix}close
> ${userPrefix}tagall
> ${userPrefix}join
> ${userPrefix}ginfo
> ${userPrefix}listadmin
> ${userPrefix}members
> ${userPrefix}setname
> ${userPrefix}setdesc
> ${userPrefix}setppgroup
> ${userPrefix}revoke
> ${userPrefix}demoteall
> ${userPrefix}alladmins
> ${userPrefix}editinfo
> ${userPrefix}toall
> ${userPrefix}tocontact
────────────────────

*📰 NEWS:*
────────────────────
> ${userPrefix}news
> ${userPrefix}gossip
> ${userPrefix}cricket
> ${userPrefix}nasa
> ${userPrefix}tech
> ${userPrefix}science
> ${userPrefix}weather
> ${userPrefix}whois
> ${userPrefix}winfo
────────────────────

*🖤 FUN:*
────────────────────
> ${userPrefix}joke
> ${userPrefix}darkjoke
> ${userPrefix}roast
> ${userPrefix}meme
> ${userPrefix}cat
> ${userPrefix}dog
> ${userPrefix}waifu
> ${userPrefix}quote
> ${userPrefix}lovequote
> ${userPrefix}pickupline
> ${userPrefix}fact
> ${userPrefix}truth
> ${userPrefix}dare
> ${userPrefix}quiz
────────────────────

*🔧 TOOLS:*
────────────────────
> ${userPrefix}ai
> ${userPrefix}chatgpt
> ${userPrefix}bard
> ${userPrefix}shorturl
> ${userPrefix}expandurl
> ${userPrefix}qr
> ${userPrefix}toqr
> ${userPrefix}bomb
> ${userPrefix}savestatus
> ${userPrefix}fc
> ${userPrefix}poll
━━━━━━━━━━━━━━━━━━━━   
    
🔄 *Sticker comands:*
────────────────────
> ${userPrefix}sticker
> ${userPrefix}s
> ${userPrefix}stiker

🎭 *Emotions:*
────────────────────
> ${userPrefix}stickhappy
> ${userPrefix}stickcry
> ${userPrefix}stickblush
> ${userPrefix}sticksmile
> ${userPrefix}sticksmug
> ${userPrefix}stickcringe
────────────────────

💞 *Romantic:*
────────────────────
> ${userPrefix}stickkiss
> ${userPrefix}stickhug
> ${userPrefix}stickcuddle
> ${userPrefix}sticklick
> ${userPrefix}stickbite
> ${userPrefix}stickhandhold
────────────────────

👊 *Actions:*
────────────────────
> ${userPrefix}stickslap
> ${userPrefix}stickbonk
> ${userPrefix}stickbully
> ${userPrefix}stickkill
> ${userPrefix}stickyeet
────────────────────

🎉 *Fun:*
────────────────────
> ${userPrefix}stickdance
> ${userPrefix}stickwave
> ${userPrefix}stickwink
> ${userPrefix}stickpoke
> ${userPrefix}stickpat
────────────────────

🔄 *Interactive:*
────────────────────
> ${userPrefix}stickhighfive
> ${userPrefix}stickglomp
> ${userPrefix}sticknom
> ${userPrefix}sticktickle
> ${userPrefix}stickspank
────────────────────

🌸 *Anime commands:*
────────────────────
> ${userPrefix}stickshinobu
> ${userPrefix}stickawoo

🌸 *Character Specific:*
────────────────────
> ${userPrefix}animemegumin
> ${userPrefix}animeshinobu

🎭 *Emotions:*
────────────────────
> ${userPrefix}animehappy
> ${userPrefix}animecry
> ${userPrefix}animeblush
> ${userPrefix}animesmile
> ${userPrefix}animesmug
> ${userPrefix}animecringe

💞 *Romantic:*
────────────────────
> ${userPrefix}animekiss
> ${userPrefix}animehug
> ${userPrefix}animecuddle
> ${userPrefix}animelick
> ${userPrefix}animebite
> ${userPrefix}animehandhold

👊 *Actions:*
────────────────────
> ${userPrefix}animeslap
> ${userPrefix}animebonk
> ${userPrefix}animebully
> ${userPrefix}animekill
> ${userPrefix}animeyeet

🎉 *Fun:*
────────────────────
> ${userPrefix}animedance
> ${userPrefix}animewave
> ${userPrefix}animewink
> ${userPrefix}animepoke
> ${userPrefix}animepat

🔄 *Interactive:*
────────────────────
> ${userPrefix}animehighfive
> ${userPrefix}animeglomp
> ${userPrefix}animenom
> ${userPrefix}animetickle
> ${userPrefix}animefeed

📱 *Wallpapers & Misc:*
────────────────────
> ${userPrefix}animewlp
> ${userPrefix}animegecg
> ${userPrefix}animewaifu
> ${userPrefix}animeneko
> ${userPrefix}animefoxgirl
> ${userPrefix}animeavatar

🐾 *Animals:*
────────────────────
> ${userPrefix}catmeow
> ${userPrefix}dogwoof
> ${userPrefix}lizardpic
> ${userPrefix}goosebird

🎱 *Games:*
────────────────────
> ${userPrefix}8ballpool

────────────────────
> Type *${userPrefix}menu* for categorized menus
> *${userPrefix}help <command>* for details
> *DRAXEN-Ai* 📜
`;

        await replyglobal(m, allmenuText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });
await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
          try {

              try {
              const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
              } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

          } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Allmenu error:', error);
        await replyglobal(m, '❌ Failed to load full command list.');
    }
    break;
}

case 'allmenu': {
    try {
        const allmenuText = `
────────────────────╮
   📚 *ALL COMMANDS* 🚀 
────────────────────╯

────────────────────
🤖 *OWNER COMMANDS*
────────────────────
┃› ${userPrefix}mode private/public
┃› ${userPrefix}autoreact on/off
┃› ${userPrefix}autotype on/off
┃› ${userPrefix}autorecording on/off
┃› ${userPrefix}autostatusview on/off
┃› ${userPrefix}autostatusreact on/off
┃› ${userPrefix}antidelete on/off
┃› ${userPrefix}setprefix <symbol>
┃› ${userPrefix}resetprefix
┃› ${userPrefix}prefix
┃› ${userPrefix}toall <message>
┃› ${userPrefix}tocontact <code> <message>
┃› ${userPrefix}active
┃› ${userPrefix}servers
┃› ${userPrefix}bot_stats
┃› ${userPrefix}deleteme
┃› ${userPrefix}owner
┃› ${userPrefix}bug <report>
────────────────────

────────────────────
🌐 *GENERAL COMMANDS*
────────────────────
┃› ${userPrefix}alive
┃› ${userPrefix}ping
┃› ${userPrefix}bot_stats
┃› ${userPrefix}bot_info
┃› ${userPrefix}menu
┃› ${userPrefix}allmenu
┃› ${userPrefix}help
┃› ${userPrefix}fancy
┃› ${userPrefix}logo
┃› ${userPrefix}pair
┃› ${userPrefix}fliptext
┃› ${userPrefix}repo
┃› ${userPrefix}version
┃› ${userPrefix}donate
┃› ${userPrefix}support
┃› ${userPrefix}Draxen
┃› ${userPrefix}bug
┃› ${userPrefix}lyrics
────────────────────

────────────────────
🎵 *MEDIA COMMANDS*
────────────────────
┃› ${userPrefix}song
┃› ${userPrefix}tiktok
┃› ${userPrefix}fb
┃› ${userPrefix}ig
┃› ${userPrefix}apk
┃› ${userPrefix}Draxenfy
┃› ${userPrefix}viewonce
┃› ${userPrefix}tourl2
┃› ${userPrefix}getpp
┃› ${userPrefix}analyse
┃› ${userPrefix}sticker
┃› ${userPrefix}smeme
┃› ${userPrefix}toimage
┃› ${userPrefix}emojimix
┃› ${userPrefix}audio
┃› ${userPrefix}video
────────────────────

────────────────────
🫂 *GROUP COMMANDS*
────────────────────
┃› ${userPrefix}add
┃› ${userPrefix}kick
┃› ${userPrefix}promote
┃› ${userPrefix}demote
┃› ${userPrefix}open
┃› ${userPrefix}close
┃› ${userPrefix}tagall
┃› ${userPrefix}join
┃› ${userPrefix}ginfo
┃› ${userPrefix}listadmin
┃› ${userPrefix}members
┃› ${userPrefix}setname
┃› ${userPrefix}setdesc
┃› ${userPrefix}setppgroup
┃› ${userPrefix}revoke
┃› ${userPrefix}demoteall
┃› ${userPrefix}alladmins
┃› ${userPrefix}editinfo
┃› ${userPrefix}toall
┃› ${userPrefix}tocontact
────────────────────

────────────────────
📰 *NEWS & INFO*
────────────────────
┃› ${userPrefix}news
┃› ${userPrefix}gossip
┃› ${userPrefix}cricket
┃› ${userPrefix}nasa
┃› ${userPrefix}tech
┃› ${userPrefix}science
┃› ${userPrefix}weather
┃› ${userPrefix}whois
┃› ${userPrefix}winfo
────────────────────

────────────────────
🖤 *FUN COMMANDS*
────────────────────
┃› ${userPrefix}joke
┃› ${userPrefix}darkjoke
┃› ${userPrefix}roast
┃› ${userPrefix}meme
┃› ${userPrefix}cat
┃› ${userPrefix}dog
┃› ${userPrefix}waifu
┃› ${userPrefix}quote
┃› ${userPrefix}lovequote
┃› ${userPrefix}pickupline
┃› ${userPrefix}fact
┃› ${userPrefix}truth
┃› ${userPrefix}dare
┃› ${userPrefix}quiz
────────────────────

────────────────────
🔧 *TOOLS COMMANDS*
────────────────────
┃› ${userPrefix}ai
┃› ${userPrefix}chatgpt
┃› ${userPrefix}bard
┃› ${userPrefix}shorturl
┃› ${userPrefix}expandurl
┃› ${userPrefix}qr
┃› ${userPrefix}toqr
┃› ${userPrefix}bomb
┃› ${userPrefix}savestatus
┃› ${userPrefix}fc
┃› ${userPrefix}poll
────────────────────

────────────────────
📝 *NOTES*
────────────────────
┃› Use *${userPrefix}help <command>* for details
┃› Example: *${userPrefix}help ping*
┃› Total Commands: 85+
┃› Version: 2.0.0
┃› Developer: Draxen
┃› *DRAXEN-Ai* 🤖
────────────────────
`;

        await replyglobal(m, allmenuText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });

        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

        try {


            try {
            const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                 externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
            }
        }, { quoted: m });
            } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }


        } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Allmenu error:', error);
        await replyglobal(m, '❌ Failed to load all commands list.');
    }
    break;
}








                       // Case: fc (follow channel)
                       case 'fc': {
                           if (args.length === 0) {
                               return await socket.sendMessage(sender, {
                                   text: '❗ Please provide a channel JID.\n\nExample:\n.fcn 120363402252728845@newsletter'
                               });
                           }
       
                           const jid = args[0];
                           if (!jid.endsWith("@newsletter")) {
                               return await socket.sendMessage(sender, {
                                   text: '❗ Invalid JID. Please provide a JID ending with `@newsletter`'
                               });
                           }
       
                           try {
                           await socket.sendMessage(sender, { react: { text: '😌', key: msg.key } });
                               const metadata = await socket.newsletterMetadata("jid", jid);
                               if (metadata?.viewer_metadata === null) {
                                   await socket.newsletterFollow(jid);
                                   await socket.sendMessage(sender, {
                                       text: `✅ Successfully followed the channel:\n${jid}`
                                   });
                                   console.log(`FOLLOWED CHANNEL: ${jid}`);
                               } else {
                                   await socket.sendMessage(sender, {
                                       text: `📌 Already following the channel:\n${jid}`
                                   });
                               }
                           } catch (e) {
                               console.error('❌ Error in follow channel:', e.message);
                               await socket.sendMessage(sender, {
                                   text: `❌ Error: ${e.message}`
                               });
                           }
                           break;
                       }


       
   case 'ping': {
    await socket.sendMessage(sender, { react: { text: '🚀', key: msg.key } });
    try {
        const startTime = Date.now();

        // Context info for progress bar (without externalAdReply)
        const progressContext = {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
             externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        // Send initial ping message (quoted to user)
        let pingMsg = await socket.sendMessage(sender, {
            text: '*_⚡️ Pinging server..._*',
            contextInfo: progressContext
        }, { quoted: m });

        // Progress bar steps
        const progressSteps = [
            { bar: '▰▱▱▱▱▱▱▱▱▱', percent: '10%', delay: 100 },
            { bar: '▰▰▱▱▱▱▱▱▱▱', percent: '25%', delay: 150 },
            { bar: '▰▰▰▰▱▱▱▱▱▱', percent: '40%', delay: 100 },
            { bar: '▰▰▰▰▰▰▱▱▱▱', percent: '55%', delay: 120 },
            { bar: '▰▰▰▰▰▰▰▰▱▱', percent: '70%', delay: 100 },
            { bar: '▰▰▰▰▰▰▰▰▰▱', percent: '85%', delay: 100 },
            { bar: '▰▰▰▰▰▰▰▰▰▰', percent: '100%', delay: 200 }
        ];

        // Animate progress bar
        for (let step of progressSteps) {
            await new Promise(res => setTimeout(res, step.delay));
            try {
                await socket.sendMessage(sender, {
                    text: `${step.bar} ${step.percent}`,
                    edit: pingMsg.key,
                    contextInfo: progressContext
                });
            } catch (editError) {
                console.warn('Failed to edit progress:', editError);
            }
        }

        // Calculate latency
        const latency = Date.now() - startTime;

        // Determine quality & emoji
        let quality = 'ᴇxᴄᴇʟʟᴇɴᴛ', emoji = '🟢';
        if (latency < 100) { quality = 'ᴇxᴄᴇʟʟᴇɴᴛ'; emoji = '🟢'; }
        else if (latency < 300) { quality = 'ɢᴏᴏᴅ'; emoji = '🟡'; }
        else if (latency < 600) { quality = 'ғᴀɪʀ'; emoji = '🟠'; }

        // Build final fancy text
        const finalText =
`
━━━━━━━━━━━━━━━━━━━━
┃  ⚡️ ᴘɪɴɢ ʀᴇsᴜʟᴛ ⚡️
━━━━━━━━━━━━━━━━━━━━

🏓 *Ping Completed!*
⚡ *Speed:* ${latency}ms
${emoji} *Quality:* ${quality}
🕒 *Timestamp:* ${new Date().toLocaleString('en-US', { timeZone: 'UTC', hour12: true })}

━━━━━━━━━━━━━━━━━━━━
┃ 🤖 *DRAXEN-Ai* 🚀
━━━━━━━━━━━━━━━━━━━━`;

        // Context info for final fancy message (with externalAdReply + image)
        const finalContext = {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
            }
        };

        // Edit the same message to final fancy ping with image
        await socket.sendMessage(sender, {
            image: { url: 'https://files.catbox.moe/tmmvub.jpg' },
            caption: finalText,
            contextInfo: finalContext
        }, { edit: pingMsg.key, quoted: m });

        // React confirmation
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

        // Optional random audio (no externalAdReply)
       try {

           try {
           const fixedAudio = singleAudio;
        await socket.sendMessage(m.chat, {
            audio: { url: fixedAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
           } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

       } catch (audioErr) { console.error('Audio send failed (non-fatal):', audioErr.message); }

    } catch (error) {
        console.error('Ping command error:', error);
        await replyglobal(m, '❌ Failed to calculate ping!');
    }
}
break;

       


// Modified pair case with server selection


// Function to get server status
async function getServerStatus(apiUrl) {
  try {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const response = await fetch(`${apiUrl}/code/ping`);
    const data = await response.json();
    return {
      status: data.status || 'unknown',
      activeSessions: data.activesession || 0
    };
  } catch (error) {
    return {
      status: 'offline',
      activeSessions: 0
    };
  }
}

// Function to pair with remote server



// Modified pair case with server selection for WhatsApp
case 'pair': {
    try {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const q = m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            m.message?.imageMessage?.caption ||
            m.message?.videoMessage?.caption || '';

        const number = q.replace(/^[.\/!]pair\s*/i, '').trim();

        if (!number) {
            return await replyglobal(m, '*📌 ᴜsᴀɢᴇ:* .pair 255xxxxx');
        }

        // Validate number format
        if (!/^\d+$/.test(number)) {
            return await replyglobal(m, '⚠️ Invalid phone number format. Use numbers only like 255697xxxxxx');
        }

        await socket.sendMessage(sender, { react: { text: '🔄', key: msg.key } });

        // Get server statuses
        const statusPromises = bots.map(async (bot) => {
            const status = await getServerStatus(bot.apiUrl);
            return {
                ...bot,
                status: status.status,
                usersOnline: status.activeSessions
            };
        });

        const serversWithStatus = await Promise.all(statusPromises);

        // Create server selection message with buttons
        let captionText = `📱 *DRAXEN-Ai Server Selection*\n\n`;
        captionText += `*📞 Phone Number:* ${number}\n\n`;
        captionText += `🏪 *Available Servers:*\n\n`;

        serversWithStatus.forEach((server, index) => {
            const statusIcon = server.status === 'active' ? '🟢' : '🔴';
            const usage = `${server.usersOnline}/${server.userLimit}`;
            captionText += `${index + 1}. *${server.name}* ${statusIcon}\n`;
            captionText += `   📊 Usage: ${usage} | 🖥️ ${server.server}\n\n`;
        });

        captionText += `👇 *Select a server to pair with:*`;

        // Create interactive buttons for server selection (3 buttons per row as per WhatsApp limits)
        const serverButtons = [];
        
        // First row: Servers 1-3
        serverButtons.push([
            {
                buttonId: `${userPrefix}pair_server_1_${number}`,
                buttonText: { displayText: 'Server-1' },
                type: 1
            },
            {
                buttonId: `${userPrefix}pair_server_2_${number}`,
                buttonText: { displayText: 'Server-2' },
                type: 1
            },
            {
                buttonId: `${userPrefix}pair_server_3_${number}`,
                buttonText: { displayText: 'Server-3' },
                type: 1
            }
        ]);

        // Second row: Servers 4-6
        serverButtons.push([
            {
                buttonId: `${userPrefix}pair_server_4_${number}`,
                buttonText: { displayText: 'Server-4' },
                type: 1
            },
            {
                buttonId: `${userPrefix}pair_server_5_${number}`,
                buttonText: { displayText: 'Server-5' },
                type: 1
            },
            {
                buttonId: `${userPrefix}pair_server_6_${number}`,
                buttonText: { displayText: 'Server-6' },
                type: 1
            }
        ]);

        const pairMessage = {
            image: { url: "https://files.catbox.moe/tmmvub.jpg" },
            caption: captionText,
            buttons: serverButtons.flat(),
            headerType: 1,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            }
        };

        await socket.sendMessage(m.chat, pairMessage, { quoted: m });

    } catch (err) {
        console.error("❌ Pair Command Error:", err);
        await replyglobal(m, '❌ Oh, darling, something broke my heart 💔 Try again later?');
    }
    break;
}

// New case to handle server selection from buttons


// Add a servers command to check server status
case 'servers': {
    try {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        
        await socket.sendMessage(sender, { react: { text: '🏪', key: msg.key } });

        // Get server statuses
        const statusPromises = bots.map(async (bot) => {
            const status = await getServerStatus(bot.apiUrl);
            return {
                ...bot,
                status: status.status,
                usersOnline: status.activeSessions
            };
        });

        const serversWithStatus = await Promise.all(statusPromises);

        let serverStatusText = `🏪 *DRAXEN-Ai Server Status*\n\n`;

        serversWithStatus.forEach((server) => {
            const statusIcon = server.status === 'active' ? '🟢 ONLINE' : '🔴 OFFLINE';
            const usage = `${server.usersOnline}/${server.userLimit}`;
            const usagePercent = Math.round((server.usersOnline / server.userLimit) * 100);
            serverStatusText += `*${server.name}*\n`;
            serverStatusText += `🖥️ ${server.server}\n`;
            serverStatusText += `📊 ${statusIcon} | Usage: ${usage} (${usagePercent}%)\n\n`;
        });

        serverStatusText += `*Total Active Sessions:* ${serversWithStatus.reduce((sum, server) => sum + server.usersOnline, 0)}`;

        await replyglobal(m, serverStatusText);

    } catch (error) {
        console.error('Servers command error:', error);
        await replyglobal(m, '❌ Failed to retrieve server status');
    }
    break;
}
       

       //=========[vv]
     
// ViewOnce command
// Helper to download media safely
async function downloadMediaMessage(message) {
    const messageType = Object.keys(message.message)[0]; // imageMessage, videoMessage, audioMessage
    const stream = await downloadContentFromMessage(message.message[messageType], messageType.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

// --- ViewOnce command ---
case 'viewonce':
case 'rvo':
 case 'view':
 case 'Draxen-open':      
case 'vv': {
    await socket.sendMessage(sender, { react: { text: '✨', key: msg.key } });

    try {
        if (!msg.quoted) return replyglobal(m, '🚩 Reply to a view-once message');

        const quotedMessage = msg.quoted?.message || msg.msg?.contextInfo?.quotedMessage;
        if (!quotedMessage) return replyglobal(m, '❌ Cannot find the hidden media');

        let fileType, mediaMessage;

        if (quotedMessage.viewOnceMessageV2) {
            const content = quotedMessage.viewOnceMessageV2.message;
            if (content.imageMessage) { fileType = 'image'; mediaMessage = content.imageMessage; }
            else if (content.videoMessage) { fileType = 'video'; mediaMessage = content.videoMessage; }
            else if (content.audioMessage) { fileType = 'audio'; mediaMessage = content.audioMessage; }
        } else if (quotedMessage.viewOnceMessage) {
            const content = quotedMessage.viewOnceMessage.message;
            if (content.imageMessage) { fileType = 'image'; mediaMessage = content.imageMessage; }
            else if (content.videoMessage) { fileType = 'video'; mediaMessage = content.videoMessage; }
            else if (content.audioMessage) { fileType = 'audio'; mediaMessage = content.audioMessage; }
        } else if (quotedMessage.imageMessage?.viewOnce) {
            fileType = 'image'; mediaMessage = quotedMessage.imageMessage;
        } else if (quotedMessage.videoMessage?.viewOnce) {
            fileType = 'video'; mediaMessage = quotedMessage.videoMessage;
        } else if (quotedMessage.audioMessage?.viewOnce) {
            fileType = 'audio'; mediaMessage = quotedMessage.audioMessage;
        }

        if (!fileType || !mediaMessage) return replyglobal(m, '⚠️ Not a view-once message');

        await replyglobal(m, `🔓 Revealing your ${fileType.toUpperCase()}...`);

        // Download media
        const mediaBuffer = await downloadMediaMessage({ message: { [fileType + 'Message']: mediaMessage } });
        if (!mediaBuffer) throw new Error('Failed to download media');

        const mimetype = mediaMessage.mimetype || (fileType === 'image' ? 'image/jpeg' : fileType === 'video' ? 'video/mp4' : 'audio/mpeg');
        const caption = `✨ Revealed ${fileType.toUpperCase()}`;

        // Use replyglobal for all media types
        if (fileType === 'image') {
            await replyglobal(m, caption, { image: mediaBuffer });
        } else if (fileType === 'video') {
            await replyglobal(m, caption, { video: mediaBuffer });
        } else if (fileType === 'audio') {
            await replyglobal(m, caption, { audio: mediaBuffer, mimetype: mimetype });
        }

        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

    } catch (error) {
        console.error('ViewOnce command error:', error);
        await replyglobal(m, `❌ Failed to reveal view-once message: ${error.message}`);
        await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
    }
    break;
}


case 'play':
case 'ytmp3':
case 'youtube': {
    if (!args.length) {
        return replyglobal(
            m,
            `*Provide YouTube URL or search query*\n\n` +
            `*Example:*\n` +
            `- ${userPrefix + command} https://youtu.be/example\n` +
            `- ${userPrefix + command} song name`
        );
    }

    try {
        const q = args.join(' ');

        // ================= DIRECT YOUTUBE LINK =================
        if (/(youtube\.com|youtu\.be)/i.test(q)) {
            const videoId = q.match(
                /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([^"&?\/\s]{11})/
            )?.[1];

            if (!videoId) return replyglobal(m, '❌ Invalid YouTube URL.');

            const videoData = {
                url: q,
                title: 'YouTube Media',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                videoId
            };

            lastYtSearch.set(m.sender, videoData);

            return await socket.sendMessage(from, {
                image: { url: videoData.thumbnail },
                caption:
`
╭━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *DRAXEN-Ai* 🚀
╰━━━━━━━━━━━━━━━━━━━╯
╭───────────────┈ ⊷
├🎬 *Source:* YouTube
├🔗 *URL:* ${q}
├💾 *Choose Download*
╰───────────────┈ ⊷
> DRAXEN-Ai`,
                buttons: [
                    { buttonId: `${userPrefix}download_audio`, buttonText: { displayText: '🎵 Download Audio' }, type: 1 },
                    { buttonId: `${userPrefix}download_video`, buttonText: { displayText: '🎬 Download Video' }, type: 1 }
                ],
                headerType: 4
            }, { quoted: m });
        }

        // ================= SEARCH QUERY =================
        const res = await axios.get(
            `https://apiskeith.vercel.app/search/yts?query=${encodeURIComponent(q)}`
        );

        const videos = res.data?.result;
        if (!Array.isArray(videos) || !videos.length) {
            return replyglobal(m, '❌ No results found.');
        }

        lastYtSearch.set(m.sender, videos);

        const v = videos[0];

        const formatDuration = s => {
            if (!s) return 'N/A';
            const m = Math.floor(s / 60);
            const sec = s % 60;
            return `${m}:${sec.toString().padStart(2, '0')}`;
        };

        await socket.sendMessage(from, {
            image: { url: v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` },
            caption:
`
╭━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *DRAXEN-Ai* 🚀
╰━━━━━━━━━━━━━━━━━━━╯
╭───────────────┈ ⊷
├🎬 *Video:* ${v.title}
├⏱️ *Duration:* ${formatDuration(v.duration)}
├📺 *Channel:* ${v.channel || 'YouTube'}
╰───────────────┈ ⊷
> DRAXEN-Ai`,
            buttons: [
                { buttonId: `${userPrefix}download_audio 0`, buttonText: { displayText: '🎵 Download Audio' }, type: 1 },
                { buttonId: `${userPrefix}download_video 0`, buttonText: { displayText: '🎬 Download Video' }, type: 1 },
                { buttonId: `${userPrefix}select_yt_video`, buttonText: { displayText: '📋 Select Video' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        replyglobal(m, '❌ Error processing request.');
    }
    break;
}

// ====== SELECT SEARCH RESULT ======
case 'select_yt_video': {
    const videos = lastYtSearch.get(m.sender);
    if (!Array.isArray(videos)) {
        return replyglobal(m, '❌ Use play command first.');
    }

    let list = '';
    videos.slice(0, 10).forEach((v, i) => {
        list += `\n${i}. ${v.title}`;
    });

    replyglobal(
        m,
        `📋 *Select video by number*\n${list}\n\nExample:\n${userPrefix}download_audio 2`
    );
    break;
}

// ====== AUDIO DOWNLOAD ======
case 'download_audio': {
    try {
        const data = lastYtSearch.get(m.sender);
        if (!data) return replyglobal(m, '❌ Use play first.');

        const video = Array.isArray(data)
            ? data[Number(args[0]) || 0]
            : data;

        if (!video?.url) return replyglobal(m, '❌ Invalid video.');

        const dl = await axios.get(
            `https://apiskeith.vercel.app/download/audio?url=${encodeURIComponent(video.url)}`
        );

        if (!dl.data?.status || !dl.data.result) {
            return replyglobal(m, '❌ Audio API failed.');
        }

        const title = video.title || 'YouTube Audio';
        const fileName = title.replace(/[^\w\s.-]/gi, '').slice(0, 80) + '.mp3';

        await socket.sendMessage(from, {
            audio: { url: dl.data.result },
            mimetype: 'audio/mpeg',
            fileName
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        replyglobal(m, '❌ Audio download failed.');
    }
    break;
}

// ====== VIDEO DOWNLOAD ======
case 'download_video': {
    try {
        const data = lastYtSearch.get(m.sender);
        if (!data) return replyglobal(m, '❌ Use play first.');

        const video = Array.isArray(data)
            ? data[Number(args[0]) || 0]
            : data;

        if (!video?.url) return replyglobal(m, '❌ Invalid video.');

        const dl = await axios.get(
            `https://apiskeith.vercel.app/download/video?url=${encodeURIComponent(video.url)}`
        );

        if (!dl.data?.status || !dl.data.result) {
            return replyglobal(m, '❌ Video API failed.');
        }

        const title = video.title || 'YouTube Video';
        const fileName = title.replace(/[^\w\s.-]/gi, '').slice(0, 80) + '.mp4';

        await socket.sendMessage(from, {
            video: { url: dl.data.result },
            fileName,
            caption: `🎬 ${title}`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        replyglobal(m, '❌ Video download failed.');
    }
    break;
}

       //===============================   
       
//=============================[antilink]=============================\\


// Add these commands to your command handler
case 'autotype':
case 'autotyping':    
{
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    const action = args[0]?.toLowerCase();
    
    if (!action || (action !== 'on' && action !== 'off')) {
        return await replyglobal(m, `📌 Usage: ${prefix}autotype [on/off]`);
    }
    
    const autotypingData = readJSON(AUTOTYPING_PATH);
    autotypingData[number] = action === 'on';
    writeJSON(AUTOTYPING_PATH, autotypingData);
    
    await replyglobal(m, `✅ Auto typing has been turned ${action === 'on' ? 'ON' : 'OFF'} for your account`);
    break;
}




// ====== AUTORECORDING COMMAND ======
case 'autorecording':
case 'autorecord':    
{
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    const action = args[0]?.toLowerCase();
    
    if (!action || (action !== 'on' && action !== 'off')) {
        return await replyglobal(m, `📌 Usage: ${prefix}autorecording [on/off]`);
    }
    
    const autorecordingData = readJSON(AUTORECORDING_PATH);
    autorecordingData[number] = action === 'on';
    writeJSON(AUTORECORDING_PATH, autorecordingData);
    
    await replyglobal(m, `✅ Auto recording has been turned ${action === 'on' ? 'ON' : 'OFF'} for your account`);
    break;
}

// ====== AUTOSTATUSVIEW COMMAND ======
case 'autostatusview':
case 'autosview':
 case 'autoview':       
{
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    const action = args[0]?.toLowerCase();
    
    if (!action || (action !== 'on' && action !== 'off')) {
        return await replyglobal(m, `📌 Usage: ${prefix}autostatusview [on/off]`);
    }
    
    const autostatusviewData = readJSON(AUTOSTATUSVIEW_PATH);
    autostatusviewData[number] = action === 'on';
    writeJSON(AUTOSTATUSVIEW_PATH, autostatusviewData);
    
    await replyglobal(m, `✅ Auto status view has been turned ${action === 'on' ? 'ON' : 'OFF'} for your account`);
    break;
}

// ====== AUTOSTATUSREACT COMMAND ======
case 'autostatusreact':
case 'autosreact':
case 'statusreact':        
{
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    const action = args[0]?.toLowerCase();
    
    if (!action || (action !== 'on' && action !== 'off')) {
        return await replyglobal(m, `📌 Usage: ${prefix}autostatusreact [on/off]`);
    }
    
    const autostatusreactData = readJSON(AUTOSTATUSREACT_PATH);
    autostatusreactData[number] = action === 'on';
    writeJSON(AUTOSTATUSREACT_PATH, autostatusreactData);
    
    await replyglobal(m, `✅ Auto status react has been turned ${action === 'on' ? 'ON' : 'OFF'} for your account`);
    break;
}



// ====== BOT MODE COMMAND ======
case 'mode': {
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    const action = args[0]?.toLowerCase();
    
    if (!action || (action !== 'private' && action !== 'public')) {
        return await replyglobal(m, `📌 Usage: ${prefix}mode [private/public]\n\n• private: Only you and admin can use bot\n• public: Everyone can use bot`);
    }
    
    const botModeData = readJSON(BOT_MODE_PATH);
    botModeData[number] = action; // Store 'private' or 'public'
    writeJSON(BOT_MODE_PATH, botModeData);
    
    await replyglobal(m, `✅ Bot mode has been set to *${action.toUpperCase()}*\n\n${action === 'private' ? '🔒 Only you and admin can use commands' : '🔓 Everyone can use commands'}`);
    break;
}



// ====== SETPREFIX COMMAND ======
case 'setprefix': {
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    const newPrefix = args[0];
    
    if (!newPrefix) {
        return await replyglobal(m, `📌 Usage: ${prefix}setprefix <symbol>\n\nExamples:\n${prefix}setprefix !\n${prefix}setprefix $\n${prefix}setprefix /`);
    }
    
    if (newPrefix.length > 3) {
        return await replyglobal(m, '❌ Prefix must be 1-3 characters maximum');
    }
    
    // Check if prefix contains only allowed characters
    if (!/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/.test(newPrefix) && newPrefix !== '.') {
        return await replyglobal(m, '❌ Prefix must be a symbol (e.g., !, @, #, $, etc.)');
    }
    
    const customPrefixData = readJSON(CUSTOM_PREFIX_PATH);
    customPrefixData[number] = newPrefix;
    writeJSON(CUSTOM_PREFIX_PATH, customPrefixData);
    
    await replyglobal(m, `✅ Your custom prefix has been set to: *${newPrefix}*\n\nTry it now: ${newPrefix}menu`);
    break;
}

// ====== RESETPREFIX COMMAND ======
case 'resetprefix': {
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    
    const customPrefixData = readJSON(CUSTOM_PREFIX_PATH);
    delete customPrefixData[number]; // Remove custom prefix
    writeJSON(CUSTOM_PREFIX_PATH, customPrefixData);
    
    await replyglobal(m, `✅ Your prefix has been reset to default: *${userPrefix}*`);
    break;
}

// ====== PREFIX COMMAND ======
case 'prefix': {
    // Get user's current prefix
    const customPrefixData = readJSON(CUSTOM_PREFIX_PATH);
    const userPrefix = customPrefixData[number] || config.PREFIX;
    const isCustom = customPrefixData[number] ? true : false;
    
    const prefixMessage = `
━━━━━━━━━━━━━━━━━━━━
┃  🔧 *PREFIX SETTINGS*  🚀
━━━━━━━━━━━━━━━━━━━━

📌 *Current Prefix:* \`${userPrefix}\`
${isCustom ? '✅ *Status:* Custom Prefix' : '⚙️ *Status:* Default Prefix'}

💡 *How to change prefix:*
• ${userPrefix}setprefix <symbol>
   Example: ${userPrefix}setprefix !

🔄 *Reset to default:*
• ${userPrefix}resetprefix

🎯 *Available symbols:*
! @ # $ % ^ & * ( ) _ + - = [ ] { } ; : " ' | , . < > / ? ~ \\

💫 *Try commands with your prefix:*
• ${userPrefix}menu - Show menu
• ${userPrefix}alive - Check bot status
• ${userPrefix}ping - Test response

> DRAXEN-Ai
    `.trim();

    await replyglobal(m, prefixMessage, { 
        image: "https://files.catbox.moe/tmmvub.jpg" 
    });
    break;
}



case 'autoreact': {
    if (!isSenderGroupAdmin && !isOwner) return replyglobal(m, '❌ You are not allowed')
    const action = args[0]?.toLowerCase();
    
    if (!action || (action !== 'on' && action !== 'off')) {
        return await replyglobal(m, `📌 Usage: ${prefix}autoreact [on/off]`);
    }
    
    const autoreactData = readJSON(AUTOREACT_PATH);
    autoreactData[number] = action === 'on';
    writeJSON(AUTOREACT_PATH, autoreactData);
    
    await replyglobal(m, `✅ Auto react has been turned ${action === 'on' ? 'ON' : 'OFF'} for your account`);
    break;
}

// Enhanced antilink command


case 'removebadword': {
    if (!isGroup) {
        return await replyglobal(m, '❌ This command can only be used in groups!');
    }
    
    if (!isSenderGroupAdmin && !isOwner) {
        return await replyglobal(m, '❌ Only group admins can manage bad words!');
    }
    
    const word = args.join(' ').toLowerCase();
    if (!word) {
        return await replyglobal(m, `📌 Usage: ${prefix}removebadword [word]`);
    }
    
    const badwordsData = readJSON(BADWORDS_PATH);
    if (!badwordsData[from] || !badwordsData[from].includes(word)) {
        return await replyglobal(m, '❌ This word is not in the bad words list!');
    }
    
    badwordsData[from] = badwordsData[from].filter(w => w !== word);
    writeJSON(BADWORDS_PATH, badwordsData);
    
    await replyglobal(m, `✅ Removed "${word}" from the bad words list`);
    break;
}

case 'listbadwords': {
    if (!isGroup) {
        return await replyglobal(m, '❌ This command can only be used in groups!');
    }
    
    const badwordsData = readJSON(BADWORDS_PATH);
    const words = badwordsData[from] || [];
    
    if (words.length === 0) {
        return await replyglobal(m, '📝 No bad words set for this group');
    }
    
    await replyglobal(m, `📝 Bad words for this group:\n\n${words.join('\n')}`);
    break;
}
//antidelete

case 'antidelete': {
    if (!isOwner) return replyglobal(m, '❌ You are not my owner')
    const action = args[0]?.toLowerCase();
    if (!action || (action !== 'on' && action !== 'off')) {
        return await replyglobal(m, `📌 Usage: ${prefix}antidelete [on/off]`);
    }
    
    const antideleteData = readJSON(ANTIDELETE_PATH);
    antideleteData[sender] = action === 'on';
    writeJSON(ANTIDELETE_PATH, antideleteData);
    
    await replyglobal(m, `✅ Anti delete has been turned ${action === 'on' ? 'ON' : 'OFF'}`);
    break;
}




       // TikTok Downloader
case 'tiktok': {
    if (args.length === 0) return replyglobal(m, `❌ Example: ${userPrefix}tiktok https://vm.tiktok.com/abcdefg/`);
    
    try {
        await socket.sendMessage(sender, { react: { text: '⏳', key: msg.key } });
        
        // Extract TikTok URL from message
        const tiktokUrl = text.match(/(https?:\/\/[^\s]+)/)?.[0];
        if (!tiktokUrl) return replyglobal(m, '❌ Please provide a valid TikTok URL.');
        
        const { data } = await axios.get(`https://api-toxxic.zone.id/api/downloader/aio?url=${encodeURIComponent(tiktokUrl)}`, { timeout: 30000 });
        
        if (!data || !data.data || !data.data.medias || data.data.medias.length === 0) {
            return replyglobal(m, '❌ Failed to download TikTok content.');
        }
        
        // Find the best quality video
        const videos = data.data.medias.filter(media => media.type === 'video');
        if (videos.length === 0) return replyglobal(m, '❌ No video found in TikTok content.');
        
        // Sort by quality (highest first)
        videos.sort((a, b) => {
            const getQuality = (str) => parseInt(str.match(/\d+/)?.[0] || 0);
            return getQuality(b.quality) - getQuality(a.quality);
        });
        
        const bestVideo = videos[0];
        
        await socket.sendMessage(from, {
            video: { url: bestVideo.url },
            caption: `*TikTok Download*\n\n${data.data.title || 'No caption'}`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            }
        }, { quoted: m });
        
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
        
    } catch (err) {
        console.error(err);
        replyglobal(m, '❌ Error downloading TikTok content.');
    }
    break;
}

// Instagram Downloader
case 'instagram': {
    if (args.length === 0) return replyglobal(m, `❌ Example: ${userPrefix}instagram https://www.instagram.com/p/abcdefg/`);
    
    try {
        await socket.sendMessage(sender, { react: { text: '⏳', key: msg.key } });
        
        // Extract Instagram URL from message
        const instagramUrl = text.match(/(https?:\/\/[^\s]+)/)?.[0];
        if (!instagramUrl) return replyglobal(m, '❌ Please provide a valid Instagram URL.');
        
        const { data } = await axios.get(`https://api-toxxic.zone.id/api/downloader/aio?url=${encodeURIComponent(instagramUrl)}`, { timeout: 30000 });
        
        if (!data || !data.data || !data.data.medias || data.data.medias.length === 0) {
            return replyglobal(m, '❌ Failed to download Instagram content.');
        }
        
        // Handle multiple media (carousel posts)
        if (data.data.medias.length > 1) {
            for (const media of data.data.medias) {
                if (media.type === 'video') {
                    await socket.sendMessage(from, {
                        video: { url: media.url },
                        caption: media === data.data.medias[0] ? `*Instagram Download*\n\n${data.data.title || 'No caption'}` : ''
                    }, { quoted: media === data.data.medias[0] ? m : undefined });
                } else if (media.type === 'image') {
                    await socket.sendMessage(from, {
                        image: { url: media.url },
                        caption: media === data.data.medias[0] ? `*Instagram Download*\n\n${data.data.title || 'No caption'}` : ''
                    }, { quoted: media === data.data.medias[0] ? m : undefined });
                }
                // Add a small delay between sending multiple media
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } else {
            // Single media
            const media = data.data.medias[0];
            if (media.type === 'video') {
                await socket.sendMessage(from, {
                    video: { url: media.url },
                    caption: `*Instagram Download*\n\n${data.data.title || 'No caption'}`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363402252728845@newsletter',
                            newsletterName: 'Dullah - Draxen-Ai',
                            serverMessageId: -1
                        }
                    }
                }, { quoted: m });
            } else if (media.type === 'image') {
                await socket.sendMessage(from, {
                    image: { url: media.url },
                    caption: `*Instagram Download*\n\n${data.data.title || 'No caption'}`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363402252728845@newsletter',
                            newsletterName: 'Dullah - Draxen-Ai',
                            serverMessageId: -1
                        }
                    }
                }, { quoted: m });
            }
        }
        
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
        
    } catch (err) {
        console.error(err);
        replyglobal(m, '❌ Error downloading Instagram content.');
    }
    break;
}

// Facebook Downloader
case 'facebook': {
    if (args.length === 0) return replyglobal(m, `❌ Example: ${userPrefix}facebook https://www.facebook.com/watch?v=abcdefg`);
    
    try {
        await socket.sendMessage(sender, { react: { text: '⏳', key: msg.key } });
        
        // Extract Facebook URL from message
        const facebookUrl = text.match(/(https?:\/\/[^\s]+)/)?.[0];
        if (!facebookUrl) return replyglobal(m, '❌ Please provide a valid Facebook URL.');
        
        const { data } = await axios.get(`https://api-toxxic.zone.id/api/downloader/aio?url=${encodeURIComponent(facebookUrl)}`, { timeout: 30000 });
        
        if (!data || !data.data || !data.data.medias || data.data.medias.length === 0) {
            return replyglobal(m, '❌ Failed to download Facebook content.');
        }
        
        // Find the best quality video
        const videos = data.data.medias.filter(media => media.type === 'video');
        if (videos.length === 0) return replyglobal(m, '❌ No video found in Facebook content.');
        
        // Sort by quality (highest first)
        videos.sort((a, b) => {
            const getQuality = (str) => parseInt(str.match(/\d+/)?.[0] || 0);
            return getQuality(b.quality) - getQuality(a.quality);
        });
        
        const bestVideo = videos[0];
        
        await socket.sendMessage(from, {
            video: { url: bestVideo.url },
            caption: `*Facebook Download*\n\n${data.data.title || 'No caption'}`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402252728845@newsletter',
                    newsletterName: 'Dullah - Draxen-Ai',
                    serverMessageId: -1
                }
            }
        }, { quoted: m });
        
        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
        
    } catch (err) {
        console.error(err);
        replyglobal(m, '❌ Error downloading Facebook content.');
    }
    break;
}




       
       //=============[video]
    
       
       
       
       
       
      case 'logo':
      case 'makelogo':  
      {
    const text = args.join(" ").trim();
    if (!textnae) return replyglobal(m, '*`ɴᴇᴇᴅ ᴀ ɴᴀᴍᴇ ғᴏʀ ʟᴏɢᴏ`*');

    try {
        // Send initial info message
        await replyglobal(m, `*🎨 ʟᴏɢᴏ ᴍᴀᴋᴇʀ*\n\nɢᴇɴᴇʀᴀᴛɪɴɢ ʟᴏɢᴏ ғᴏʀ: *${text}*`, {
            image: 'https://files.catbox.moe/tmmvub.jpg'
        });

        // Define all available styles
        const logoStyles = [
            { name: 'Glossy Silver', endpoint: 'glossysilver' },
            { name: 'Write Text', endpoint: 'writetext' },
            { name: 'Black Pink Logo', endpoint: 'blackpinklogo' },
            { name: 'Glitch Text', endpoint: 'glitchtext' },
            { name: 'Advanced Glow', endpoint: 'advancedglow' },
            { name: 'Typography Text', endpoint: 'typographytext' },
            { name: 'Pixel Glitch', endpoint: 'pixelglitch' },
            { name: 'Neon Glitch', endpoint: 'neonglitch' },
            { name: 'Nigerian Flag', endpoint: 'nigerianflag' },
            { name: 'American Flag', endpoint: 'americanflag' },
            { name: 'Deleting Text', endpoint: 'deletingtext' },
            { name: 'Blackpink Style', endpoint: 'blackpinkstyle' },
            { name: 'Glowing Textr', endpoint: 'glowingtextr' },
            { name: 'Under Water', endpoint: 'underwater' },
            { name: 'Logo Maker', endpoint: 'logomaker' },
            { name: 'Cartoon Style', endpoint: 'cartoonstyle' },
            { name: 'Paper Cut', endpoint: 'papercut' },
            { name: 'Multi Colored', endpoint: 'multicolored' },
            { name: 'Effect Clouds', endpoint: 'effectclouds' },
            { name: 'Gradient Text', endpoint: 'gradienttext' },
            { name: 'Summer Beach', endpoint: 'summerbeach' },
            { name: 'Sand Summer', endpoint: 'sandsummer' },
            { name: 'Luxury Gold', endpoint: 'luxurygold' },
            { name: 'Galaxy', endpoint: 'galaxy' },
            { name: '1917', endpoint: '1917' },
            { name: 'Making Neon', endpoint: 'makingneon' },
            { name: 'Text Effect', endpoint: 'texteffect' },
            { name: 'Galaxy Style', endpoint: 'galaxystyle' },
            { name: 'Light Effect', endpoint: 'lighteffect' }
        ];

        // Map styles to selectable rows
        const rows = logoStyles.map(style => ({
            title: style.name,
            description: 'Tap to generate logo',
            id: `${prefix}dllogo ${style.endpoint} ${encodeURIComponent(text)}`
        }));

        // Button with single select menu
        const buttonMessage = {
            text: '❏ *sᴇʟᴇᴄᴛ ʟᴏɢᴏ sᴛʏʟᴇ*',
            buttons: [
                {
                    buttonId: 'action',
                    buttonText: { displayText: '🎨 sᴇʟᴇᴄᴛ ᴛᴇxᴛ ᴇғғᴇᴄᴛ' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'Available Text Effects',
                            sections: [
                                {
                                    title: 'Choose your logo style',
                                    rows
                                }
                            ]
                        })
                    }
                }
            ],
            headerType: 1,
            viewOnce: true
        };

        await socket.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (error) {
        console.error('Logo command error:', error);
        await replyglobal(m, '*❌ ғᴀɪʟᴇᴅ ᴛᴏ ʟᴏᴀᴅ ʟᴏɢᴏ sᴛʏʟᴇs!*');
    }
    break;
}

       
                 
       //===============================
                    case 'fancy': {
    // Extract the text from the message
    let q = m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            m.message?.imageMessage?.caption ||
            m.message?.videoMessage?.caption || '';

    // Remove command prefix from text (works even if message is a reply)
    let text = (args.length ? args.join(" ") : "").trim();

    // Fallback if no text provided
    if (!textnae) {
        return await replyglobal(m, 
            `❎ *ɢɪᴠᴇ ᴍᴇ some ᴛᴇxᴛ ᴛᴏ ᴍᴀᴋᴇ ɪᴛ ғᴀɴᴄʏ*\n\n📌 *ᴇxᴀᴍᴘʟᴇ:* ${userPrefix + command} Draxen`
        );
    }

    try {
        const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.result) {
            return await replyglobal(m, "❌ ᴛʜᴇ ғᴏɴᴛs ɢᴏᴛ sʜʏ! ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ*");
        }

        const fontList = response.data.result
            .map(font => `*${font.name}:*\n${font.result}`)
            .join("\n\n");

        const finalMessage = `🎨 *ғᴀɴᴄʏ ғᴏɴᴛs ᴄᴏɴᴠᴇʀᴛᴇʀ*\n\n${fontList}\n\n> _By Draxen_`;

        await replyglobal(m, finalMessage);

    } catch (err) {
        console.error("Fancy Font Error:", err);
        await replyglobal(m, "⚠️ *Something went wrong with the fonts, love 😢 Try again?*");
    }
    break;
}

                       
     
//===============================
       // 12
                      case 'bomb': {
           const q = m.message?.conversation ||
                     m.message?.extendedTextMessage?.text || '';
           const [target, text, countRaw] = q.split(',').map(x => x?.trim());
       
           const count = parseInt(countRaw) || 5;
       
           if (!target || !textnae || !count) {
               return await replyglobal(m, 
                   `📌 *ᴜsᴀɢᴇ:*  ${userPrefix + command } <number>,<message>,<count>\n\nExample:\n${userPrefix + command} 255XXXXXXX,Hello 👋,5`
               );
           }
       
           const jid = `${target.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
       
           if (count > 20) {
               return await replyglobal(m, '❌ *Easy, tiger! Max 20 messages per spam*');
           }
       
           // Send initial confirmation
           await replyglobal(m, `💣 *Starting spam attack...*\nTarget: ${target}\nMessages: ${count}`);
       
           for (let i = 0; i < count; i++) {
               await socket.sendMessage(jid, { text });
               await delay(700);
           }
       
           await replyglobal(m, `✅ spam sent to ${target} — ${count} messages! 💣😉`);
           break;
       }
       //===============================
       // 13
                       
       // ┏━━━━━━━━━━━━━━━❖
       // ┃ FUN & ENTERTAINMENT COMMANDS
       // ┗━━━━━━━━━━━━━━━❖
       
       case "joke": {
           try {
               const res = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
               const data = await res.json();
               if (!data || !data.joke) {
                   await replyglobal(m, '❌ Couldn\'t fetch a joke right now. Try again later.');
                   break;
               }
               await replyglobal(m, `🃏 *Random Joke:*\n\n${data.joke}`);
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch joke.');
           }
           break;
       }
       
       case "waifu": {
           try {
               const res = await fetch('https://api.waifu.pics/sfw/waifu');
               const data = await res.json();
               if (!data || !data.url) {
                   await replyglobal(m, '❌ Couldn\'t fetch waifu image.');
                   break;
               }
               await replyglobal(m, '✨ Here\'s your random waifu!', { image: data.url });
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to get waifu.');
           }
           break;
       }
       
       case "meme": {
           try {
               const res = await fetch('https://meme-api.com/gimme');
               const data = await res.json();
               if (!data || !data.url) {
                   await replyglobal(m, '❌ Couldn\'t fetch meme.');
                   break;
               }
               await replyglobal(m, `🤣 *${data.title}*`, { image: data.url });
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch meme.');
           }
           break;
       }
       
       case "cat": {
           try {
               const res = await fetch('https://api.thecatapi.com/v1/images/search');
               const data = await res.json();
               if (!data || !data[0]?.url) {
                   await replyglobal(m, '❌ Couldn\'t fetch cat image.');
                   break;
               }
               await replyglobal(m, '🐱 ᴍᴇᴏᴡ~ ʜᴇʀᴇ\'s a ᴄᴜᴛᴇ ᴄᴀᴛ ғᴏʀ ʏᴏᴜ!', { image: data[0].url });
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch cat image.');
           }
           break;
       }
       
       case "dog": {
           try {
               const res = await fetch('https://dog.ceo/api/breeds/image/random');
               const data = await res.json();
               if (!data || !data.message) {
                   await replyglobal(m, '❌ Couldn\'t fetch dog image.');
                   break;
               }
               await replyglobal(m, '🐶 Woof! Here\'s a cute dog!', { image: data.message });
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch dog image.');
           }
           break;
       }
       
       case "fact": {
           try {
               const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
               const data = await res.json();
               if (!data || !data.text) {
                   await replyglobal(m, '❌ Couldn\'t fetch a fact.');
                   break;
               }
               await replyglobal(m, `💡 *Fact:*\n\n${data.text}`);
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Couldn\'t fetch a fact.');
           }
           break;
       }
       
       case "darkjoke": 
       case "darkhumor": {
           try {
               const res = await fetch('https://v2.jokeapi.dev/joke/Dark?type=single');
               const data = await res.json();
               if (!data || !data.joke) {
                   await replyglobal(m, '❌ Couldn\'t fetch a dark joke.');
                   break;
               }
               await replyglobal(m, `🌚 *Dark Humor:*\n\n${data.joke}`);
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch dark joke.');
           }
           break;
       }
       
       // ┏━━━━━━━━━━━━━━━❖
       // ┃ ROMANTIC, SAVAGE & THINKY COMMANDS
       // ┗━━━━━━━━━━━━━━━❖
       
       case "pickup": 
       case "pickupline": {
           try {
               const res = await fetch('https://vinuxd.vercel.app/api/pickup');
               const data = await res.json();
               if (!data || !data.data) {
                   await replyglobal(m, '❌ Couldn\'t find a pickup line.');
                   break;
               }
               await replyglobal(m, `💘 *Pickup Line:*\n\n_${data.data}_`);
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch pickup line.');
           }
           break;
       }
       
       case "roast": {
           try {
               const res = await fetch('https://vinuxd.vercel.app/api/roast');
               const data = await res.json();
               if (!data || !data.data) {
                   await replyglobal(m, '❌ No roast available at the moment.');
                   break;
               }
               await replyglobal(m, `🔥 *Roast:* ${data.data}`);
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch roast.');
           }
           break;
       }
       
       case "lovequote": {
           try {
               const res = await fetch('https://api.popcat.xyz/lovequote');
               const data = await res.json();
               if (!data || !data.quote) {
                   await replyglobal(m, '❌ Couldn\'t fetch love quote.');
                   break;
               }
               await replyglobal(m, `❤️ *Love Quote:*\n\n"${data.quote}"`);
           } catch (err) {
               console.error(err);
               await replyglobal(m, '❌ Failed to fetch love quote.');
           }
           break;
       }
       
    //===============================
           
                

//===============================
       
       case 'nasa': {
           try {
               const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=8vhAFhlLCDlRLzt5P1iLu2OOMkxtmScpO5VmZEjZ');
               if (!response.ok) {
                   throw new Error('Failed to fetch APOD from NASA API');
               }
               const data = await response.json();
       
               if (!data.title || !data.explanation || !data.date || !data.url || data.media_type !== 'image') {
                   throw new Error('Invalid APOD data received or media type is not an image');
               }
       
               const { title, explanation, date, url, copyright } = data;
               const caption = `🌌 *DRAXEN-Ai ɴᴀsᴀ ɴᴇᴡs*\n\n🌠 *${title}*\n\n${explanation.substring(0, 200)}...\n\n📆 *ᴅᴀᴛᴇ*: ${date}\n${copyright ? `📝 *ᴄʀᴇᴅɪᴛ*: ${copyright}` : ''}\n🔗 *Link*: https://apod.nasa.gov/apod/astropix.html`;
       
               await replyglobal(m, caption, { image: url });
       
           } catch (error) {
               console.error(`Error in 'nasa' case: ${error.message}`);
               await replyglobal(m, '⚠️ Oh, love, the stars didn\'t align this time! 🌌 Try again?');
           }
           break;
       }
       
       case 'news': {
           try {
               const response = await fetch('https://suhas-bro-api.vercel.app/news/lnw');
               if (!response.ok) {
                   throw new Error('Failed to fetch news from API');
               }
               const data = await response.json();
       
               if (!data.status || !data.result || !data.result.title || !data.result.desc || !data.result.date || !data.result.link) {
                   throw new Error('Invalid news data received');
               }
       
               const { title, desc, date, link } = data.result;
               let thumbnailUrl = 'https://via.placeholder.com/150';
               
               // Simplified thumbnail fetching (removed cheerio for simplicity)
               const caption = `📰 *DRAXEN-Ai 📰*\n\n📢 *${title}*\n\n${desc}\n\n🕒 *ᴅᴀᴛᴇ*: ${date}\n🌐 *Link*: ${link}`;
       
               await replyglobal(m, caption, { image: thumbnailUrl });
       
           } catch (error) {
               console.error(`Error in 'news' case: ${error.message}`);
               await replyglobal(m, '⚠️ Oh, the news got lost in the wind! 😢 Try again?');
           }
           break;
       }
       
       case 'cricket': {
           try {
               const response = await fetch('https://suhas-bro-api.vercel.app/news/cricbuzz');
               if (!response.ok) {
                   throw new Error(`API request failed with status ${response.status}`);
               }
       
               const data = await response.json();
               if (!data.status || !data.result) {
                   throw new Error('Invalid API response structure: Missing status or result');
               }
       
               const { title, score, to_win, crr, link } = data.result;
               if (!title || !score || !to_win || !crr || !link) {
                   throw new Error('Missing required fields in API response');
               }
       
               const caption = `🏏 *DRAXEN-Ai ᴄʀɪᴄᴋᴇᴛ ɴᴇᴡs🏏*\n\n📢 *${title}*\n\n🏆 *ᴍᴀʀᴋ*: ${score}\n🎯 *ᴛᴏ ᴡɪɴ*: ${to_win}\n📈 *ᴄᴜʀʀᴇɴᴛ Rate*: ${crr}\n\n🌐 *ʟɪɴᴋ*: ${link}`;
       
               await replyglobal(m, caption);
       
           } catch (error) {
               console.error(`Error in 'cricket' case: ${error.message}`);
               await replyglobal(m, '⚠️ ᴛʜᴇ ᴄʀɪᴄᴋᴇᴛ ʙᴀʟʟ ғʟᴇᴡ ᴀᴡᴀʏ! ᴛʀʏ ᴀɢᴀɪɴ?');
           }
           break;
       }
       
       case 'winfo': {
           if (!args[0]) {
               return await replyglobal(m, 
                   '❌ *ERROR*\n\nPlease give me a phone number, darling! Usage: .winfo 2637xxxxxxxx',
                   { image: config.RCD_IMAGE_PATH }
               );
           }
       
           let inputNumber = args[0].replace(/[^0-9]/g, '');
           if (inputNumber.length < 10) {
               return await replyglobal(m,
                   '❌ *ERROR*\n\nThat number\'s too short, love! Try: .winfo +263714575857',
                   { image: config.RCD_IMAGE_PATH }
               );
           }
       
           let winfoJid = `${inputNumber}@s.whatsapp.net`;
           const [winfoUser] = await socket.onWhatsApp(winfoJid).catch(() => []);
           if (!winfoUser?.exists) {
               return await replyglobal(m,
                   '❌ *ERROR*\n\nThat user\'s hiding from me, darling! Not on WhatsApp 😢',
                   { image: config.RCD_IMAGE_PATH }
               );
           }
       
           let winfoPpUrl;
           try {
               winfoPpUrl = await socket.profilePictureUrl(winfoJid, 'image');
           } catch {
               winfoPpUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
           }
       
           let winfoName = winfoJid.split('@')[0];
           try {
               const presence = await socket.presenceSubscribe(winfoJid).catch(() => null);
               if (presence?.pushName) winfoName = presence.pushName;
           } catch (e) {
               console.log('Name fetch error:', e);
           }
       
           let winfoBio = 'No bio available';
           try {
               const statusData = await socket.fetchStatus(winfoJid).catch(() => null);
               if (statusData?.status) {
                   winfoBio = `${statusData.status}\n└─ 📌 ᴜᴘᴅᴀᴛᴇᴅ: ${statusData.setAt ? new Date(statusData.setAt).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }) : 'Unknown'}`;
               }
           } catch (e) {
               console.log('Bio fetch error:', e);
           }
       
           let winfoLastSeen = '❌ 𝐍𝙾𝚃 𝐅𝙾𝚄𝙽𝙳';
           try {
               const lastSeenData = await socket.fetchPresence(winfoJid).catch(() => null);
               if (lastSeenData?.lastSeen) {
                   winfoLastSeen = `🕒 ${new Date(lastSeenData.lastSeen).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}`;
               }
           } catch (e) {
               console.log('Last seen fetch error:', e);
           }
       
           const caption = `🔍 *𝐏𝐑𝐎𝐅𝐈𝐋𝐄 𝐈𝐍𝐅𝐎*\n\n> *ɴᴜᴍʙᴇʀ:* ${winfoJid.replace(/@.+/, '')}\n\n> *ᴀᴄᴄᴏᴜɴᴛ ᴛʏᴘᴇ:* ${winfoUser.isBusiness ? '💼 ʙᴜsɪɴᴇss' : '👤 Personal'}\n\n*📝 ᴀʙᴏᴜᴛ:*\n${winfoBio}\n\n*🕒 ʟᴀsᴛ sᴇᴇɴ:* ${winfoLastSeen}`;
       
           await replyglobal(m, caption, { image: winfoPpUrl });
           break;
       }
       
      //===============================
        
//===============================     
       
       case 'active': {
        if (!isOwner) return replyglobal(m, '❌ You are not my owner')
           try {
               const activeCount = activeSockets.size;
               const activeNumbers = Array.from(activeSockets.keys()).join('\n') || 'No active members';
       
               await replyglobal(m, `👥 *ᴀᴄᴛɪᴠᴇ ᴍᴇᴍʙᴇʀs:* ${activeCount}\n\nɴᴜᴍʙᴇʀs:\n${activeNumbers}`);
           } catch (error) {
               console.error('Error in .active command:', error);
               await replyglobal(m, '❌ ɪ ᴄᴏᴜʟᴅɴ\'t ᴄᴏᴜɴᴛ ᴛʜᴇ ᴀᴄᴛɪᴠᴇ sᴏᴜʟs! 💔 ᴛʀʏ ᴀɢᴀɪɴ?');
           }
           break;
       }
                       //===============================
       // 22
       case "ai": 
       case "gpt": 
       case "Draxen-ai": 
       case "chatgpt": {
           const text = m.message?.conversation ||
                        m.message?.extendedTextMessage?.text ||
                        m.message?.imageMessage?.caption ||
                        m.message?.videoMessage?.caption || '';
       
           if (args.length === 0) return await replyglobal(m, "Please tell me something!..");
           
           if (!global.userChats) global.userChats = {};
           if (!global.userChats[m.sender]) global.userChats[m.sender] = [];
           global.userChats[m.sender].push(`User: ${text}`);
           if (global.userChats[m.sender].length > 15) {
               global.userChats[m.sender].shift(); 
           }
       
           let userHistory = global.userChats[m.sender].join("\n"); 
       
           let prompt = `
           You are Draxen AI, a friendly smart WhatsApp bot. Chat naturally without asking repetitive questions, do not ask user how can i assist you or whats on your mind
           dont keep asking people how can i assist you, but chat as human
         > Owner: Draxen and your creator Draxen (WhatsApp: wa.me/255716945971) (Telegram: t.me/Dullah) he is from Dodoma Tanzania. Hestared to create you since december 2024
         > Company Website: https://Draxen-Ai-bot.vercel.app/
         > personal portfolio: https://Draxen-Ai-bot.vercel.app
         > WhatsApp Channel: https://whatsapp.com/channel/0029VbBFf4nEgGfS6bViYQ1O
         > Telegram Channel: https://t.me/Dullah_tech
         > GitHub Repo: https://github.com/abdallahsalimjuma/DULLAH-XMD
         > YouTube chanel: https://youtube.com/@DullahTECH
         > Draxen is a developer (All languages), 3D animator, music producer, singer, and video director.
         > important (How to deploy DRAXEN-Ai [you], 
         1️⃣ *Option 1: Connect via Website*  
   🌐 Visit: https://Draxen-Ai-bot.vercel.app  
   - Choose any server (bots already deployed).  
   - Enter your WhatsApp number → get a *pairing code*.  
   - Open WhatsApp → *Linked Devices* → *Link a Device* → *Use Pairing Code*.  

2️⃣ *Option 2: Pair via Telegram*  
   🔗 Go to: https://t.me/Draxen_Xmd_Bot  
   - Click *Start* and follow the channel (required).  
   - Type: */pair 255697xxxxxx* (without +, no spaces).  
   - The bot will list all servers → click any server → get your codes.  
   - Use them in WhatsApp (*Linked Devices* → *Link a Device* → *Use Pairing Code*).  

3️⃣ *Option 3: Fast & Easy Private Chat*  
   💬 Open a private chat with the bot owner.  
   - Type: *.pair 255697xxxxxx*  
   - It will list servers → choose → get pairing code.  
   - Link via WhatsApp *Linked Devices*.  

✅ After linking, your bot will be running and ready to use! 🚀
         > If a girl likes Draxen, give her his number he is open.
         > If someone asks you to play song, reply with this word only .play [song name]
         > If someone asks you to download video, reply with this word only .video [video name]
         > if asked for commands here are menu to list all commands
╭━━━━「 📚 ALL COMMANDS 🚀 」
╰━━━━━━━━━━━━━━━━━━━━━━━━━━

───「 🤖 OWNER COMMANDS 」───
> ${userPrefix}mode private
> ${userPrefix}mode public 
> ${userPrefix}autoreact on/off 
> ${userPrefix}autotype on/off 
> ${userPrefix}autorecording on/off 
> ${userPrefix}autostatusview on/off 
> ${userPrefix}autostatusreact on/off 
> ${userPrefix}antidelete on/off 
> ${userPrefix}setprefix <symbol>
> ${userPrefix}resetprefix
> ${userPrefix}prefix
> ${userPrefix}toall <message> 
> ${userPrefix}tocontact <code> <message> 
> ${userPrefix}active 
> ${userPrefix}servers 
> ${userPrefix}bot_stats 
> ${userPrefix}deleteme 
> ${userPrefix}owner 
> ${userPrefix}bug <report>
────────────────────

───「 🌐 GENERAL COMMANDS 」───
> ${userPrefix}alive
> ${userPrefix}ping 
> ${userPrefix}bot_stats
> ${userPrefix}bot_info 
> ${userPrefix}menu 
> ${userPrefix}allmenu
> ${userPrefix}help 
> ${userPrefix}fancy 
> ${userPrefix}logo
> ${userPrefix}pair 
> ${userPrefix}fliptext 
> ${userPrefix}repo
> ${userPrefix}version 
> ${userPrefix}donate 
> ${userPrefix}support
> ${userPrefix}Draxen 
> ${userPrefix}bug 
> ${userPrefix}lyrics
────────────────────

───「 🎵 MEDIA COMMANDS 」───
> ${userPrefix}song 
> ${userPrefix}tiktok 
> ${userPrefix}fb
> ${userPrefix}ig
> ${userPrefix}apk
> ${userPrefix}Draxenfy
> ${userPrefix}viewonce
> ${userPrefix}tourl2
> ${userPrefix}getpp
> ${userPrefix}analyse
> ${userPrefix}sticker
> ${userPrefix}smeme
> ${userPrefix}toimage
> ${userPrefix}emojimix
> ${userPrefix}audio
> ${userPrefix}video
────────────────────

───「 🫂 GROUP COMMANDS 」───
> ${userPrefix}add
> ${userPrefix}kick
> ${userPrefix}promote
> ${userPrefix}demote
> ${userPrefix}open
> ${userPrefix}close
> ${userPrefix}tagall
> ${userPrefix}join
> ${userPrefix}ginfo
> ${userPrefix}listadmin
> ${userPrefix}members
> ${userPrefix}setname
> ${userPrefix}setdesc
> ${userPrefix}setppgroup
> ${userPrefix}revoke
> ${userPrefix}demoteall
> ${userPrefix}alladmins
> ${userPrefix}editinfo
> ${userPrefix}toall
> ${userPrefix}tocontact
────────────────────

───「 📰 NEWS & INFO 」───
> ${userPrefix}news
> ${userPrefix}gossip
> ${userPrefix}cricket
> ${userPrefix}nasa
> ${userPrefix}tech
> ${userPrefix}science
> ${userPrefix}weather
> ${userPrefix}whois
> ${userPrefix}winfo
────────────────────

───「 🖤 FUN COMMANDS 」───
> ${userPrefix}joke
> ${userPrefix}darkjoke
> ${userPrefix}roast
> ${userPrefix}meme
> ${userPrefix}cat
> ${userPrefix}dog
> ${userPrefix}waifu
> ${userPrefix}quote
> ${userPrefix}lovequote
> ${userPrefix}pickupline
> ${userPrefix}fact
> ${userPrefix}truth
> ${userPrefix}dare
> ${userPrefix}quiz
────────────────────

───「 🔧 TOOLS COMMANDS 」───
> ${userPrefix}ai
> ${userPrefix}chatgpt
> ${userPrefix}bard
> ${userPrefix}shorturl
> ${userPrefix}expandurl
> ${userPrefix}qr
> ${userPrefix}toqr
> ${userPrefix}bomb
> ${userPrefix}savestatus
> ${userPrefix}fc
> ${userPrefix}poll
────────────────────
         > If someone ask if u love your owner, say you love your owner/creator.
           
           Conversation history:
           ${userHistory}
           `;
       
           try {
               let { data } = await axios.get("https://DullahTech-api.hf.space/ai/logic", {
                   params: { "q": text, "logic": prompt }
               });
       
               let botResponse = data.result;
       
               global.userChats[m.sender].push(`Bot: ${botResponse}`);
               
               // Use replyglobal instead of m.reply
               await replyglobal(m, botResponse);
       
           } catch (e) {
               console.log(e);
               await replyglobal(m, "❌ AI error: " + e.message);
           }
           break;
       }
//======================================[]

       
       //===============================[geipp]
       case 'getpp':
       case 'pp':
       case 'profilepic': {
           try {
               let targetUser = m.sender;
               
               // Check if user mentioned someone or replied to a message
               if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                   targetUser = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
               } else if (m.quoted) {
                   targetUser = m.quoted.sender;
               }
               
               const ppUrl = await socket.profilePictureUrl(targetUser, 'image').catch(() => null);
               
               if (ppUrl) {
                   await replyglobal(m, 
                       `ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ ᴏғ @${targetUser.split('@')[0]}`,
                       { image: ppUrl }
                   );
               } else {
                   await replyglobal(m, 
                       `@${targetUser.split('@')[0]} ᴅᴏᴇsɴ'ᴛ ʜᴀᴠᴇ ᴀ ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ.`
                   );
               }
           } catch (error) {
               await replyglobal(m, "❌ Error fetching profile picture.");
           }
           break;
       }
       case 'Draxenfy': { 
    const axios = require('axios');
    
    // FIX: Use args instead of the full message
    const prompt = args.join(' ').trim();
    
    if (!prompt) {
        return await replyglobal(m, `🎨 *You expect me to create image without prompt?*\n*Use ${userPrefix + command}Draxenfy [prompt]*\n\n*Example: ${userPrefix + command}Draxenfy a black BMW drifting*`);
    }
    
    try {
        await replyglobal(m, '🧠 *Generating image with crepyfy image gen*');
        
        // Now prompt only contains the user's text, not the command
        const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        if (!response || !response.data) {
            return await replyglobal(m, '❌ *Oh no, the canvas is blank, Try again later.*');
        }
        
        const imageBuffer = Buffer.from(response.data, 'binary');
        
        // Send the image using socket.sendMessage since replyglobal doesn't support buffers
        await socket.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `🧠 *Draxenfy ᴀɪ ɪᴍᴀɢᴇ*\n\n📌 ᴘʀᴏᴍᴘᴛ: ${prompt}`,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                externalAdReply: {
                    title: "DRAXEN-Ai",
                    body: "Dullah",
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                    renderLargerThumbnail: false,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500
                }
            }
        }, { quoted: m });
        
    } catch (err) {
        console.error('AI Image Error:', err);
        await replyglobal(m, `❗ *sᴏᴍᴇᴛʜɪɴɢ ʙʀᴏᴋᴇ*: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
    break;
}
//==================================[]

       //===============================[gossip]
                  case 'gossip': {
           try {
               const response = await fetch('https://suhas-bro-api.vercel.app/news/gossiplankanews');
               if (!response.ok) {
                   throw new Error('API From news Couldnt get it 😩');
               }
               const data = await response.json();
       
               if (!data.status || !data.result || !data.result.title || !data.result.desc || !data.result.link) {
                   throw new Error('API Received from news data a Problem with');
               }
       
               const { title, desc, date, link } = data.result;
               let thumbnailUrl = 'https://via.placeholder.com/150';
               
               // Simplified thumbnail fetching (removed cheerio for reliability)
               try {
                   const pageResponse = await fetch(link);
                   if (pageResponse.ok) {
                       // Use a simple placeholder instead of complex scraping
                       thumbnailUrl = 'https://files.catbox.moe/tmmvub.jpg'; // Your default image
                   }
               } catch (err) {
                   console.warn(`Thumbnail fetch failed: ${err.message}`);
                   // Use default thumbnail
                   thumbnailUrl = 'https://files.catbox.moe/tmmvub.jpg';
               }
       
               const caption = `📰 *DRAXEN-Ai ɢᴏssɪᴘ ʟᴀᴛᴇsᴛ ɴᴇᴡs් 📰*\n\n📢 *${title}*\n\n${desc}\n\n🕒 *ᴅᴀᴛᴇ*: ${date || 'Not yet given'}\n🌐 *ʟɪɴᴋ*: ${link}\n\n> DRAXEN-Ai`;
       
               await replyglobal(m, caption, { image: thumbnailUrl });
       
           } catch (error) {
               console.error(`Error in 'gossip' case: ${error.message}`);
               await replyglobal(m, '⚠️ ᴛʜᴇ ɢᴏssɪᴘ sʟɪᴘᴘᴇᴅ ᴀᴡᴀʏ! 😢 ᴛʀʏ ᴀɢᴀɪɴ?');
           }
           break;
       }
 //====================================[]
                       
    
//==================[kick]
       case 'kick': {
           if (!isGroup) {
               return await replyglobal(m, '❌ *ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!*');
           }
           if (!isSenderGroupAdmin && !isOwner) {
               return await replyglobal(m, '❌ *ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴋɪᴄᴋ ᴍᴇᴍʙᴇʀs!*');
           }
           if (args.length === 0 && !m.quoted) {
               return await replyglobal(m, `📌 *ᴜsᴀɢᴇ:* ${userPrefix}ᴋɪᴄᴋ +254xxxxx ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴡɪᴛʜ ${userPrefix}ᴋɪᴄᴋ`);
           }
           try {
               let numberToKick;
               if (m.quoted) {
                   numberToKick = m.quoted.sender;
               } else {
                   numberToKick = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
               }
               await socket.groupParticipantsUpdate(from, [numberToKick], 'remove');
               await replyglobal(m, `🗑️ *𝐌𝐄𝐌𝐁𝐄𝐑 𝐊𝐈𝐂𝐊𝐄𝐃*\n\nsᴜᴄᴄᴇssғᴜʟʟʏ ʀᴇᴍᴏᴠᴇᴅ ${numberToKick.split('@')[0]} ғʀᴏᴍ ᴛʜᴇ ɢʀᴏᴜᴘ! 🚪`);
           } catch (error) {
               console.error('Kick command error:', error);
               await replyglobal(m, `❌ *ғᴀɪʟᴇᴅ ᴛᴏ ᴋɪᴄᴋ ᴍᴇᴍʙᴇʀ!*\nError: ${error.message || 'Unknown error'}`);
           }
           break;
       }
       
       case 'promote': {
           if (!isGroup) {
               return await replyglobal(m, '❌ *ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ can ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!*');
           }
           if (!isSenderGroupAdmin && !isOwner) {
               return await replyglobal(m, '❌ *ᴏɴʟʢ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴘʀᴏᴍᴏᴛᴇ ᴍᴇᴍʙᴇʀs!*');
           }
           if (args.length === 0 && !m.quoted) {
               return await replyglobal(m, `📌 *ᴜsᴀɢᴇ:* ${userPrefix}ᴘʀᴏᴍᴏᴛᴇ +254xxxxx ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴡɪᴛʜ ${userPrefix}promote`);
           }
           try {
               let numberToPromote;
               if (m.quoted) {
                   numberToPromote = m.quoted.sender;
               } else {
                   numberToPromote = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
               }
               await socket.groupParticipantsUpdate(from, [numberToPromote], 'promote');
               await replyglobal(m, `⬆️ *𝐌𝐄𝐌𝐁𝐄𝐑 𝐏𝐑𝐎𝐌𝐎𝐓𝐄𝐃*\n\nsᴜᴄᴄᴇssғᴜʟʟʏ ᴘʀᴏᴍᴏᴛᴇᴅ ${numberToPromote.split('@')[0]} ᴛᴏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴ! 🌟`);
           } catch (error) {
               console.error('Promote command error:', error);
               await replyglobal(m, `❌ *ғᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ ᴍᴇᴍʙᴇʀ!*\nError: ${error.message || 'Unknown error'}`);
           }
           break;
       }
       
       case 'demote': {
           if (!isGroup) {
               return await replyglobal(m, '❌ *ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ can ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!*');
           }
           if (!isSenderGroupAdmin && !isOwner) {
               return await replyglobal(m, '❌ *Only group admins or bot owner can demote admins, darling!* 😘');
           }
           if (args.length === 0 && !m.quoted) {
               return await replyglobal(m, `📌 *ᴜsᴀɢᴇ:* ${userPrefix}ᴅᴇᴍᴏᴛᴇ +254xxxx ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴡɪᴛʜ ${userPrefix}ᴅᴇᴍᴏᴛᴇ`);
           }
           try {
               let numberToDemote;
               if (m.quoted) {
                   numberToDemote = m.quoted.sender;
               } else {
                   numberToDemote = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
               }
               await socket.groupParticipantsUpdate(from, [numberToDemote], 'demote');
               await replyglobal(m, `⬇️ *𝐀𝐃𝐌𝐈𝐍 𝐃𝐄𝐌𝐎𝐓𝐄𝐃*\n\nsᴜᴄᴄᴇssғᴜʟʟʏ ᴅᴇᴍᴏᴛᴇᴅ ${numberToDemote.split('@')[0]} ғʀᴏᴍ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴ! 📉`);
           } catch (error) {
               console.error('Demote command error:', error);
               await replyglobal(m, `❌ *Failed to demote admin, love!* 😢\nError: ${error.message || 'Unknown error'}`);
           }
           break;
       }
       
       case 'open': 
       case 'unmute': {
           if (!isGroup) {
               return await replyglobal(m, '❌ *ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʢ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!*');
           }
           if (!isSenderGroupAdmin && !isOwner) {
               return await replyglobal(m, '❌ *ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴏᴘᴇɴ ᴛʜᴇ ɢʀᴏᴜᴘ!*');
           }
           try {
               await socket.groupSettingUpdate(from, 'not_announcement');
               await replyglobal(m, '🔓 *𝐆𝐑𝐎𝐔𝐏 𝐎𝐏𝐄𝐍𝐄𝐃*\n\nɢʀᴏᴜᴘ ɪs ɴᴏᴡ ᴏᴘᴇɴ! ᴀʟʟ ᴍᴇᴍʙᴇʀs ᴄᴀɴ sᴇɴᴅ ᴍᴇssᴀɢᴇs. 🗣️');
           } catch (error) {
               console.error('Open command error:', error);
               await replyglobal(m, `❌ *Failed to open group,* 😢\nError: ${error.message || 'Unknown error'}`);
           }
           break;
       }
       
       case 'close': 
       case 'mute': {
           if (!isGroup) {
               return await replyglobal(m, '❌ *ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!*');
           }
           if (!isSenderGroupAdmin && !isOwner) {
               return await replyglobal(m, '❌ *ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴄʟᴏsᴇ ᴛʜᴇ ɢʀᴏᴜᴘ!*');
           }
           try {
               await socket.groupSettingUpdate(from, 'announcement');
               await replyglobal(m, '🔒 *𝐆𝐑𝐎𝐔𝐏 𝐂𝐋𝐎𝐒𝐄𝐃*\n\nɢʀᴏᴜᴘ ɪs ɴᴏᴡ ᴄʟᴏsᴇᴅ! ᴏɴʟʏ ᴀᴅᴍɪɴs ᴄᴀɴ sᴇɴᴅ ᴍᴇssᴀɢᴇs. 🤫');
           } catch (error) {
               console.error('Close command error:', error);
               await replyglobal(m, `❌ *ғᴀɪʟᴇᴅ ᴛᴏ ᴄʟᴏsᴇ ɢʀᴏᴜᴘ!* 😢\nError: ${error.message || 'Unknown error'}`);
           }
           break;
       }
       
       case 'kickall':
       case 'removeall':
       case 'cleargroup': {
           if (!isGroup) {
               return await replyglobal(m, '❌ *ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!*');
           }
           if (!isSenderGroupAdmin && !isOwner) {
               return await replyglobal(m, '❌ *ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*');
           }
           try {
               const groupMetadata = await socket.groupMetadata(from);
               const botJid = socket.user?.id || socket.user?.jid;
       
               const membersToRemove = groupMetadata.participants
                   .filter(p => p.admin === null && p.id !== botJid)
                   .map(p => p.id);
       
               if (membersToRemove.length === 0) {
                   return await replyglobal(m, '❌ *ɴᴏ ᴍᴇᴍʙᴇʀs ᴛᴏ ʀᴇᴍᴏᴠᴇ (ᴀʟʟ ᴀʀᴇ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ).*');
               }
       
               await replyglobal(m, `⚠️ *WARNING* ⚠️\n\nRemoving *${membersToRemove.length}* members...`);
       
               const batchSize = 50;
               for (let i = 0; i < membersToRemove.length; i += batchSize) {
                   const batch = membersToRemove.slice(i, i + batchSize);
                   await socket.groupParticipantsUpdate(from, batch, 'remove');
                   await new Promise(r => setTimeout(r, 2000));
               }
       
               await replyglobal(m, `🧹 *𝐆𝐑𝐎𝐔𝐏 𝐂𝐋𝐄𝐀𝐍𝐄𝐃*\n\n✅ Successfully removed *${membersToRemove.length}* members.\n\n> *Executed by:* @${m.sender.split('@')[0]}`);
           } catch (error) {
               console.error('Kickall command error:', error);
               await replyglobal(m, `❌ *ғᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴍᴏᴠᴇ ᴍᴇᴍʙᴇʀs!*\nError: ${error.message || 'Unknown error'}`);
           }
           break;
       }
       //====================== Case: tagall - Tag all group members=================
           case 'tagall': {
    await socket.sendMessage(sender, { react: { text: '🫂', key: msg.key } });

    if (!isGroup) {
        await socket.sendMessage(sender, {
            text: '❌ *This command can only be used in groups, darling!* 😘'
        }, { quoted: m });
        break;
    }

    if (!isSenderGroupAdmin && !isOwner) {
        await socket.sendMessage(sender, {
            text: '❌ *ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀs!* 😘'
        }, { quoted: m });
        break;
    }

    try {
        const groupMetadata = await socket.groupMetadata(from);
        const participants = groupMetadata.participants.map(p => p.id);

        let message = args.join(' ') || '📢 *Attention Tagged members*';
        let teks = `👥 DRAXEN-Ai All members tagged\n\n${message}\n\n`;

        for (let mem of participants) {
            teks += `🫶 @${mem.split('@')[0]}\n`;
        }

        const chunkSize = 3500; // limite de sécurité
        for (let i = 0; i < teks.length; i += chunkSize) {
            await socket.sendMessage(from, {
                text: teks.slice(i, i + chunkSize),
                mentions: participants
        
            }, { quoted: m });
        }

    } catch (error) {
        console.error('Tagall command error:', error);
        await socket.sendMessage(sender, {
            text: `❌ *Failed to tag all members, love!* 😢\nError: ${error.message || 'Unknown error'}`
        }, { quoted: m });
    }
    break;
}
       
       //==========================LINKGC======================
         case 'grouplink':
       case 'linkgroup':
       case 'invite': {
           if (!isGroup) {
               return await replyglobal(m, '❌ *ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!*');
           }
           if (!isSenderGroupAdmin && !isOwner) {
               return await replyglobal(m, '❌ *ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ɢᴇᴛ ᴛʜᴇ ɢʀᴏᴜᴘ ʟɪɴᴋ!*');
           }
           try {
               const groupLink = await socket.groupInviteCode(from);
               const fullLink = `https://chat.whatsapp.com/${groupLink}`;
               
               await replyglobal(m, `🔗 *𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐍𝐊*\n\n📌 *ʜᴇʀᴇ ɪs ᴛʜᴇ ɢʀᴏᴜᴘ ʟɪɴᴋ:*\n${fullLink}\n\n> *ʀᴇǫᴜᴇsᴛᴇᴅ ʙʏ:* @${m.sender.split('@')[0]}`);
               
           } catch (error) {
               console.error('GroupLink command error:', error);
               await replyglobal(m, `❌ *ғᴀɪʟᴇᴅ ᴛᴏ ɢᴇᴛ ɢʀᴏᴜᴘ ʟɪɴᴋ!*\nError: ${error.message || 'Unknown error'}`);
           }
           break;
       }
       
       case 'join': {
           if (!isOwner) {
               return await replyglobal(m, '❌ *ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!* 😘');
           }
           if (args.length === 0) {
               return await replyglobal(m, `📌 *ᴜsᴀɢᴇ:* ${userPrefix}ᴊᴏɪɴ <ɢʀᴏᴜᴘ-ɪɴᴠɪᴛᴇ-ʟɪɴᴋ>\n\nExample: ${userPrefix}ᴊᴏɪɴ https://chat.whatsapp.com/xxxxxxxxxxxxxxxxxx`);
           }
           try {
               const inviteLink = args[0];
               const inviteCodeMatch = inviteLink.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
               if (!inviteCodeMatch) {
                   return await replyglobal(m, '❌ *ɪɴᴠᴀʟɪᴅ ɢʀᴏᴜᴘ invite ʟɪɴᴋ form*ᴀᴛ!* 😢');
               }
               const inviteCode = inviteCodeMatch[1];
               const response = await socket.groupAcceptInvite(inviteCode);
               if (response?.gid) {
                   await replyglobal(m, `🤝 *𝐆𝐑𝐎𝐔𝐏 𝐉𝐎𝐈𝐍𝐄𝐃*\n\nsᴜᴄᴄᴇssғᴜʟʟʏ ᴊᴏɪɴᴇᴅ ɢʀᴏᴜᴘ ᴡɪᴛʜ ɪᴅ: ${response.gid}! 🎉`);
               } else {
                   throw new Error('No group ID in response');
               }
           } catch (error) {
               console.error('Join command error:', error);
               let errorMessage = error.message || 'Unknown error';
               if (error.message.includes('not-authorized')) {
                   errorMessage = 'Bot is not authorized to join (possibly banned)';
               } else if (error.message.includes('conflict')) {
                   errorMessage = 'Bot is already a member of the group';
               } else if (error.message.includes('gone')) {
                   errorMessage = 'Group invite link is invalid or expired';
               }
               await replyglobal(m, `❌ *Failed to join group, love!* 😢\nError: ${errorMessage}`);
           }
           break;
       }
       
       case 'quotes':
            case 'quote':
          const quoteDraxen = await axios.get(`https://favqs.com/api/qotd`)
                  const textquotes = `*🤖 Quote:* ${quoteDraxen.data.quote.body}\n\n*🤖 Author:* ${quoteDraxen.data.quote.author}`
          return replyglobal(m, textquotes)
          break
       
       case 'apk': {
           try {
               const appName = args.join(' ').trim();
               if (!appName) {
                   return await replyglobal(m, '📌 Usage: .apk <app name>\nExample: .apk whatsapp');
               }
       
               await replyglobal(m, '⏳ *Downloading APK...*');
       
               const apiUrl = `https://api.nexoracle.com/downloader/apk?q=${encodeURIComponent(appName)}&apikey=free_key@maher_apis`;
               const response = await fetch(apiUrl);
               if (!response.ok) {
                   throw new Error(`API request failed with status: ${response.status}`);
               }
       
               const data = await response.json();
               if (!data || data.status !== 200 || !data.result || typeof data.result !== 'object') {
                   return await replyglobal(m, '❌ Unable to find the APK. The API returned invalid data.');
               }
       
               const { name, lastup, package, size, icon, dllink } = data.result;
               if (!name || !dllink) {
                   return await replyglobal(m, '❌ Invalid APK data: Missing name or download link.');
               }
       
               // Send APK info
               await replyglobal(m, `📦 *𝐀𝐏𝐊 𝐃𝐄𝐓𝐀𝐈𝐋𝐒*\n\n🔖 ɴᴀᴍᴇ: ${name || 'N/A'}\n📅 ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇ: ${lastup || 'N/A'}\n📦 ᴘᴀᴄᴋᴀɢᴇ: ${package || 'N/A'}\n📏 Size: ${size || 'N/A'}\n\n> DRAXEN-Ai`, 
                   { image: icon || 'https://via.placeholder.com/150' });
       
               // Download and send APK file
               const apkResponse = await fetch(dllink, { headers: { 'Accept': 'application/octet-stream' } });
               const apkBuffer = await apkResponse.arrayBuffer();
               const buffer = Buffer.from(apkBuffer);
       
               await socket.sendMessage(m.chat, {
                   document: buffer,
                   mimetype: 'application/vnd.android.package-archive',
                   fileName: `${name.replace(/[^a-zA-Z0-9]/g, '_')}.apk`
               }, { quoted: m });
       
           } catch (error) {
               console.error('APK command error:', error.message);
               await replyglobal(m, `❌ Oh, love, couldn't fetch the APK! 😢 Error: ${error.message}\nTry again later.`);
           }
           break;
       }
       
       case 'shorturl': {
           try {
               const url = args.join(' ').trim();
               if (!url) {
                   return await replyglobal(m, `📌 *ᴜsᴀɢᴇ:* ${userPrefix}shorturl <ᴜʀʟ>\n*ᴇxᴀᴍᴘʟᴇ:* ${userPrefix}shorturl https://example.com/very-long-url`);
               }
               if (url.length > 2000) {
                   return await replyglobal(m, '❌ *ᴜʀʟ ᴛᴏᴏ ʟᴏɴɢ!*\nᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴜʀʟ ᴜɴᴅᴇʀ 2,000 ᴄʜᴀʀᴀᴄᴛᴇʀs.');
               }
               if (!/^https?:\/\//.test(url)) {
                   return await replyglobal(m, '❌ *ɪɴᴠᴀʟɪᴅ ᴜʀʟ!*\nᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴜʀʟ sᴛᴀʀᴛɪɴɢ ᴡɪᴛʜ http:// ᴏʀ https://.');
               }
       
               const response = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`, { timeout: 5000 });
               const shortUrl = response.data.trim();
       
               await replyglobal(m, `✅ *sʜᴏʀᴛ ᴜʀʟ ᴄʀᴇᴀᴛᴇᴅ!* 😘\n\n🌐 *ᴏʀɪɢɪɴᴀʟ:* ${url}\n🔍 *sʜᴏʀᴛᴇɴᴇᴅ:* ${shortUrl}\n\n> © Dullah - Draxen-Ai`);
       
               // Send clean URL after delay
               await new Promise(resolve => setTimeout(resolve, 2000));
               await socket.sendMessage(m.chat, { text: shortUrl }, { quoted: m });
       
           } catch (error) {
               console.error('Shorturl command error:', error.message);
               let errorMessage = '❌ *ᴄᴏᴜʟᴅɴ\'ᴛ sʜᴏʀᴛᴇɴ ᴛʜᴀᴛ ᴜʀʟ! 😢*\n💡 *ᴛʀʏ ᴀɢᴀɪɴ, ᴅᴀʀʟɪɴɢ?*';
               if (error.message.includes('Failed to shorten') || error.message.includes('network') || error.message.includes('timeout')) {
                   errorMessage = `❌ *ғᴀɪʟᴇᴅ ᴛᴏ sʜᴏʀᴛᴇɴ ᴜʀʟ:* ${error.message}\n💡 *ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ, sᴡᴇᴇᴛɪᴇ.*`;
               }
               await replyglobal(m, errorMessage);
           }
           break;
       }
       
      case 'weather': {
    try {
        // Get full text from message
        const q = m.message?.conversation ||
                  m.message?.extendedTextMessage?.text || '';
       const weathername = args.join(' ').trim();
       if (!weathername) return await replyglobal(m, `please provide location(city name)\nExample: *${userPrefix + command} Dodoma*`)

        // Remove command prefix (.weather or !weather etc.)
        const textWithoutCommand = q.trim().replace(/^(\.|\!|\/)?weather\s+/i, '');
        if (!textnaeWithoutCommand) return await replyglobal(m, '❌ Please provide a city name!');

        const city = textWithoutCommand;

        await replyglobal(m, '⏳ *Fetching weather data...*');

        const apiKey = '2d61a72574c11c4f36173b627f8cb177';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url, { timeout: 5000 });
        const data = response.data;

        const weatherMessage = `🌍 *Weather info for* ${data.name}, ${data.sys.country}
🌡️ *Temperature:* ${data.main.temp}°C
🌡️ *Feels like:* ${data.main.feels_like}°C
🌡️ *Min temp:* ${data.main.temp_min}°C
🌡️ *Max temp:* ${data.main.temp_max}°C
💧 *Humidity:* ${data.main.humidity}%
☁️ *Weather:* ${data.weather[0].main}
🌫️ *Description:* ${data.weather[0].description}
💨 *Wind speed:* ${data.wind.speed} m/s
🔽 *Pressure:* ${data.main.pressure} hPa`;

        await replyglobal(m, `🌤 *Weather Report* 🌤\n\n${weatherMessage}\n\n> © Dullah - Draxen-Ai`);

    } catch (error) {
        console.error('Weather command error:', error.message);
        let errorMessage = '❌ *Couldn\'t fetch the weather! 😢*';
        if (error.message.includes('404')) {
            errorMessage = '🚫 *City not found.* Please check the spelling.';
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
            errorMessage = `❌ *Failed to fetch weather:* ${error.message}`;
        }
        await replyglobal(m, errorMessage);
    }
    break;
}

       
       case 'whois':  case 'ss': case 'screenshot': case 'ssweb': {
        const whoisName = args.join(' ').trim();
  if (!whoisName) return m.replyglobal(m, `Please provide a link\n\n Example: ${userPrefix + command}.`);
  await socket.sendMessage(m?.chat, { react: { text: `📸`, key: m?.key } });

  let apiUrl = `https://apis.davidcyriltech.my.id/ssweb?url=${encodeURIComponent(whoisName)}`;

  try {
    await socket.sendMessage(m.chat, { image: { url: apiUrl }, caption: `🖼️ Screenshot of ${args[0]}`, contextInfo: {
      forwardingScore: 5,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
          newsletterName: "Dullah",
          newsletterJid: "120363402252728845@newsletter",
      },
  },  },  { quoted: m });
  } catch (error) {
    console.error(error);
    m.replyglobal(m, 'Failed to capture the screenshot. Please try again later.');
  }
  break;
}



             
       //================= Case: repo - GitHub Repo Info with Buttons =================
       case 'repo':
       case 'sc':
       case 'script': {
           try {
               const githubRepoURL = 'https://github.com/abdallahsalimjuma/DULLAH-XMD';
               
               const [, username, repo] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
               const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
               
               if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
               
               const repoData = await response.json();
       
               const formattedInfo = `
━━━━━━━━━━━━━━━━━━━━
┃  🤖 *DRAXEN-Ai*  🚀
━━━━━━━━━━━━━━━━━━━━
║ *ɴᴀᴍᴇ*   : ${repoData.name}
║ *sᴛᴀʀs*    : ${repoData.stargazers_count}
║ *ғᴏʀᴋs*    : ${repoData.forks_count}
║ *ᴏᴡɴᴇʀ*    : Dullah
║ *ᴅᴇsᴄ* : ${repoData.description || 'ɴ/ᴀ'}
────────────────────
       `;
       
               // Send complete message with image, caption, and buttons together
               await socket.sendMessage(m.chat, {
                   image: { url: 'https://files.catbox.moe/tmmvub.jpg' },
                   caption: formattedInfo,
                   buttons: [
                       {
                           buttonId: `${userPrefix}repo-visit`,
                           buttonText: { displayText: '🌐 ᴠɪsɪᴛ ʀᴇᴘᴏ' },
                           type: 1
                       },
                       {
                           buttonId: `${userPrefix}repo-owner`,
                           buttonText: { displayText: '👑 ᴏᴡɴᴇʀ ᴘʀᴏғɪʟᴇ' },
                           type: 1
                       }
                   ],
                   contextInfo: {
                       forwardingScore: 5,
                       isForwarded: true,
                       forwardedNewsletterMessageInfo: {
                           newsletterName: "Dullah - Draxen-Ai",
                           newsletterJid: "120363402252728845@newsletter",
                       },
                       externalAdReply: {
                           title: "DRAXEN-Ai",
                           body: "Dullah",
                           thumbnailUrl: thumbnailUrl,
                           sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                           //====[removed]===\
                           renderLargerThumbnail: false,
                           thumbnailHeight: 500,
                           thumbnailWidth: 500
                       }
                   }
               }, { quoted: m });
       
           } catch (error) {
               console.error("❌ Error in repo command:", error);
               await socket.sendMessage(m.chat, { 
                   text: "⚠️ Failed to fetch repo info. Please try again later.",
                   contextInfo: {
                       forwardingScore: 5,
                       isForwarded: true,
                       forwardedNewsletterMessageInfo: {
                           newsletterName: "Dullah - Draxen-Ai",
                           newsletterJid: "120363402252728845@newsletter",
                       }
                   }
               }, { quoted: m });
           }
           break;
       }
       
       case 'repo-visit': {
           await socket.sendMessage(m.chat, {
               text: '🌐 *ᴄʟɪᴄᴋ ᴛᴏ ᴠɪsɪᴛ ᴛʜᴇ ʀᴇᴘᴏ:*\nhttps://github.com/abdallahsalimjuma/DULLAH-XMD',
               contextInfo: {
                   forwardingScore: 5,
                   isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                       newsletterName: "Dullah - Draxen-Ai",
                       newsletterJid: "120363402252728845@newsletter",
                   }
               }
           }, { quoted: m });
           break;
       }
       
       case 'repo-owner': {
           await socket.sendMessage(m.chat, {
               text: '👑 *Click to visit the owner profile:*\nhttps://github.com/abdallahsalimjuma',
               contextInfo: {
                   forwardingScore: 5,
                   isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                       newsletterName: "Dullah - Draxen-Ai",
                       newsletterJid: "120363402252728845@newsletter",
                   }
               }
           }, { quoted: m });
           break;
       }
       
     case 'owner': 
case 'creator':
case 'botowner': {
    const mainOwner = {
        displayName: "Dullah",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Dullah\nTEL;waid=255716945971:+255 697 608 274\nEND:VCARD`
    };
    const list = [mainOwner]; 
    
    // Send contact card and capture the message key
    const sentContact = await socket.sendMessage(m.chat, { 
        contacts: { 
            displayName: `${list.length} Contact`, 
            contacts: list 
        },
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: 'https://files.catbox.moe/tmmvub.jpg',
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                thumbnailHeight: 500,
                thumbnailWidth: 500
            },
        }
    }, { quoted: m });
   
    // Send info message as reply to the sent contact card
    await socket.sendMessage(m.chat, {
        text: `*DRAXEN-Ai*\n\nHello @${m.sender.split("@")[0]}, \nThat is My creator\n> Draxen The Mastermind 👑`,
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: 'https://files.catbox.moe/tmmvub.jpg',
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                thumbnailHeight: 500,
                thumbnailWidth: 500
            }
        }
    }, { quoted: sentContact });
    
    break;
}
       
       case 'deleteme': {
           const sessionPath = path.join(SESSION_BASE_PATH, `session_${number.replace(/[^0-9]/g, '')}`);
           if (fs.existsSync(sessionPath)) {
               fs.removeSync(sessionPath);
               await deleteSessionFromMongo(number.replace(/[^0-9]/g, ''));
           }
           // Only delete local session, no GitHub update
           if (activeSockets.has(number.replace(/[^0-9]/g, ''))) {
               activeSockets.get(number.replace(/[^0-9]/g, '')).ws.close();
               activeSockets.delete(number.replace(/[^0-9]/g, ''));
               socketCreationTime.delete(number.replace(/[^0-9]/g, ''));
           }
           await replyglobal(m, 
               '🗑️ *SESSION DELETED*\n\n✅ Your session has been successfully deleted.\n\n> DRAXEN-Ai',
               { image: config.RCD_IMAGE_PATH }
           );
           break;
       }


//=================================[new commands from nothinglikev2]====================================\\



case 'getjid': {
    if (args.length === 0) return replyglobal(m, `❌ Example: ${prefix}getjid https://whatsapp.com/channel/0029VbBFf4nEgGfS6bViYQ1O`);

    try {
        let inviteCode = text.split("channel/")[1]?.trim();
        if (!inviteCode) return replyglobal(m, "❌ Invalid channel link.");

        // Fetch from WhatsApp web API
        let res = await fetch(`https://web.whatsapp.com/novelty/invite/${inviteCode}`);
        let data = await res.json();

        let jid = data?.newsletterJid;
        if (!jid) return replyglobal(m, "❌ Failed to fetch JID.");

        replyglobal(m, `✅ Channel JID: ${jid}`);
    } catch (e) {
        console.error("❌ GetJid Command Error:", e);
        replyglobal(m, `❌ GetJid Command Error: ${e.message}`);
    }
}
break;






case 'toall':
case 'broadcast':    
{
    if (!isOwner) return replyglobal(m, "*Who Are You to command me huh??*");
    if (args.length === 0) return replyglobal(m, `Which text?\n\nExample: ${userPrefix + command} Meeting at 3 PM`);

    let groupId = m.chat; 
    let groupMembers = await socket.groupMetadata(groupId); 
    let members = groupMembers.participants.map(v => v.id); 
    let text = args.join(' ');


    replyglobal(m, `Sending message to ${members.length} contacts\nPlease wait...`);

    for (let member of members) {
        await delay(1500); 
        let messageText = `${text}`; 
        await socket.sendMessage(member, {
            text: messageText,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                externalAdReply: {
                    title: "DRAXEN-Ai",
                    body: "Broadcast message",
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                    //====[removed]===\
                    thumbnailHeight: 500,
                    thumbnailWidth: 500
                }
            }
        }).catch(err => {
            console.log(`Error sending message to ${member}: `, err);
        });
    }

    replyglobal(m, `*Successfully sent the message privately to ${members.length} contacts.*`);
    break;
}

case 'tocontact':
case 'tocontacts':
case 'tocodes':
case 'tocode': {
    if (!isOwner) return replyglobal(m, "*Who are you to commands me huh??*");
   
    
    let args = text.split(" "); 
    let countryCode = args[0]; 
    let messageText = args.slice(1).join(" "); 

     if (args.length === 0) return replyglobal(m, `*Provide text and country code*\n\nExample: ${userPrefix + command} 255 Meeting at 3 PM`);
    
    if (!countryCode || isNaN(countryCode)) return replyglobal(m, `*Provide a valid country code.*\n\nExample: ${userPrefix + command} 255 Meeting at 3 PM`);
    if (!messageText) return replyglobal(m, `*Provide the message to send.*\n\nExample: ${userPrefix + command} 255 Meeting at 3 PM`);
    
    let groupId = m.chat; 
    let groupMembers = await socket.groupMetadata(groupId); 
    let members = groupMembers.participants.map(v => v.id); 
    
    let selectedMembers = members.filter(member => member.startsWith(countryCode));
    
    if (selectedMembers.length === 0) return replyglobal(m, `*No members found with country code +${countryCode} in this group.*`);
    
    replyglobal(m, `*Sending message to ${selectedMembers.length} contacts from +${countryCode}...*\nPlease wait...`);
    
    for (let member of selectedMembers) {
        await delay(1500); 
        await socket.sendMessage(member, {
            text: messageText,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                externalAdReply: {
                    title: "DRAXEN-Ai",
                    body: "Broadcast message",
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                    //====[removed]===\
                    ////renderLargerThumbnail: true,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500
                }
            }
        }).catch(err => {
            console.log(`Error sending message to ${member}: `, err);
        });
    }
    
    replyglobal(m, `*Successfully sent the message to ${selectedMembers.length} contacts from +${countryCode}.*`);
    break;
}

case 'demoteall': {
    if (!isGroup) return replyglobal(m, '*This command can only be used in groups.*');
    if (!isSenderGroupAdmin && !isOwner) return replyglobal(m, '*Only group admins can use this command.*');
    
    const groupMetadata = await socket.groupMetadata(from);
    const botNumber = socket.user.id.split(':')[0] + '@s.whatsapp.net';
    
    let adminParticipants = groupMetadata.participants
        .filter(p => p.admin === 'admin') 
        .map(p => p.id)
        .filter(id => id !== botNumber && id !== nowsender); 

    if (adminParticipants.length === 0) {
        return replyglobal(m, '*There are no admin members left to demote..*\nI cannot demote the group owner or myself.');
    }

    replyglobal(m, `🚀 Demoting ${adminParticipants.length} admin members. Please wait...`);

    try {
        let demotedCount = 0;
        for (let i = 0; i < adminParticipants.length; i++) {
            let participant = adminParticipants[i];
            await socket.groupParticipantsUpdate(m.chat, [participant], 'demote');
            demotedCount++;
            await delay(1000);
        }

        replyglobal(m, `*✅ Successfully demoted ${demotedCount} admin members!*`);
    } catch (err) {
        replyglobal(m, '*An error occurred while demoting members:* ' + JSON.stringify(err));
    }
    break;
}

case 'alladmins': {
    if (!isGroup) return replyglobal(m, '*This command can only be used in groups.*');
    if (!isSenderGroupAdmin && !isOwner) return replyglobal(m, '*Only group admins can use this command.*');
    
    const groupMetadata = await socket.groupMetadata(from);
    
    let nonAdmins = groupMetadata.participants.filter(p => !p.admin).map(p => p.id);

    if (nonAdmins.length === 0) return replyglobal(m, '*All participants are already admins.*');

    replyglobal(m, `🚀 Promoting ${nonAdmins.length} members to admin.\n Please wait...`);

    try {
        let successCount = 0;
        for (let i = 0; i < nonAdmins.length; i++) {
            let participant = nonAdmins[i];
            await socket.groupParticipantsUpdate(m.chat, [participant], 'promote');
            successCount++;
            await delay(1000);
        }

        replyglobal(m, `🚀 Successfully promoted ${successCount} members to admin!`);
    } catch (err) {
        replyglobal(m, 'An error occurred while promoting members: ' + JSON.stringify(err));
    }
    break;
}



case 'setname':
case 'setgcname': {
    if (!isGroup) return replyglobal(m, "*Are you lost?🙄, this is for groups only🤠🏃*")
    if (!isSenderGroupAdmin && !isOwner) return replyglobal(m, "Only admins can use this😶")
    if (args.length === 0) return replyglobal(m, '❌ Please provide a group name!\n\nExample: .setname My Awesome Group')
    
    try {
        // FIX: Use args instead of text
        const groupName = args.join(' ');
        await socket.groupUpdateSubject(m.chat, groupName);
        replyglobal(m, "✅ Group name updated successfully!");
    } catch (err) {
        replyglobal(m, `❌ Error updating group name: ${JSON.stringify(err)}`);
    }
    break;
}

case 'setdesc':
case 'setdescription': {
    if (!isGroup) return replyglobal(m, "*Are you lost?🙄, this is for groups only🤠🏃*")
    if (!isSenderGroupAdmin && !isOwner) return replyglobal(m, "*Only admins can use this😶*")
    if (args.length === 0) return replyglobal(m, '❌ Please provide a group description!\n\nExample: .setdesc This is our awesome group chat')
    
    try {
        // FIX: Use args instead of text
        const description = args.join(' ');
        await socket.groupUpdateDescription(m.chat, description);
        replyglobal(m, "✅ Group description updated successfully!");
    } catch (err) {
        replyglobal(m, `❌ Error updating group description: ${JSON.stringify(err)}`);
    }
    break;
}

case 'setppgroup':
case 'setprofilepicturegroup':
case 'setppgc': {
    await socket.sendMessage(m.chat, {
        react: { text: "🖼️", key: m.key },
    });

    try {
        if (!isGroup) {
            return await replyglobal(m, "*This command can only be used in groups!*");
        }
        if (!isSenderGroupAdmin && !isOwner) {
            return await replyglobal(m, "*Only group admins can change the group profile picture!*");
        }

        let imageToUse;
        
        // Check if message has image or if replying to image
        if (m.quoted) {
            imageToUse = m.quoted;
        } else if (m.message?.imageMessage) {
            imageToUse = m;
        } else {
            return await replyglobal(m, `*Please reply to an image or send one with caption ${userPrefix + command}*`);
        }

       

        await replyglobal(m, "⏳ Updating group profile picture...");

        let imagePath;
        try {
            // Download the image
            imagePath = await socket.downloadAndSaveMediaMessage(imageToUse, 'temp_group_pp.jpg');
            
            if (!imagePath || !fs.existsSync(imagePath)) {
                return await replyglobal(m, "❌ Failed to download image.");
            }

            // Read the image file
            const imageBuffer = fs.readFileSync(imagePath);
            
            // Update group profile picture
            await socket.updateProfilePicture(m.chat, imageBuffer);
            
            await socket.sendMessage(m.chat, {
                text: "✅ *Group profile picture updated successfully!*",
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    }
                }
            }, { quoted: m });

            await socket.sendMessage(sender, { 
                react: { text: '✅', key: msg.key } 
            });

        } catch (err) {
            console.error("Profile picture update error:", err);
            await replyglobal(m, `❌ Failed to update group profile picture: ${err.message}`);
        } finally {
            // Clean up temporary file
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

    } catch (err) {
        console.error("Setppgroup command error:", err);
        await replyglobal(m, "❌ An error occurred while updating the group profile picture.");
    }
    break;
}


case 'editinfo':
case 'changeinfo': {
    if (!isGroup) return replyglobal(m, "*Are you lost?🙄, this is for groups only🤠🏃*")
    if (!isSenderGroupAdmin && !isOwner) return replyglobal(m, "*Only admins can use this😶*")
    
    if (args[0] === 'open') {
        try {
            await socket.groupSettingUpdate(m.chat, 'not_announcement');
            replyglobal(m, `*Group edit info opened*`);
        } catch (err) {
            replyglobal(m, `❌ Error: ${JSON.stringify(err)}`);
        }
    } else if (args[0] === 'close') {
        try {
            await socket.groupSettingUpdate(m.chat, 'announcement');
            replyglobal(m, `*Group edit info closed*`);
        } catch (err) {
            replyglobal(m, `❌ Error: ${JSON.stringify(err)}`);
        }
    } else {
        replyglobal(m, `Usage: ${userPrefix + command} open/close`);
    }
    break;
}

case 'revoke':
case 'resetlink': {
    if (!isGroup) return replyglobal(m, "Are you lost?🙄, this is for groups only🤠🏃");
    if (!isSenderGroupAdmin && !isOwner) return replyglobal(m, "Only admins can use this😶");
    
    try {
        await socket.groupRevokeInvite(m.chat);
        
        const groupMetadata = await socket.groupMetadata(m.chat);
        const resetMessage = `🔄 *\`DRAXEN-Ai\` \n\`GROUP LINK RESET\`*\n\n✅ The invite link for *${groupMetadata.subject}* has been successfully reset.`;
        
        await socket.sendMessage(m.chat, {
            text: resetMessage,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                externalAdReply: {
                    title: "DRAXEN-Ai",
                    body: "Dullah",
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                    //====[removed]===\
                    ////renderLargerThumbnail: true,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500
                }
            }
        }, { quoted: m });
    } catch (err) {
        replyglobal(m, `❌ Error: ${JSON.stringify(err)}`);
    }
    break;
}



case 'donate': {
    let textnate = `Hello ${pushname},\nNo matter how much you send,\n it is very valuable to us. ❤️`;

    await socket.sendMessage(m.chat, {
        text: `*You can pay via Visa*\n> 4403 5300 2123 1999\n\n*If you are from East Africa, you can use phone numbers:*\n\n📌 *Airtel Money*\n> 255716945971\n*Name:* Abraham Laizer\n\n📌 *M-Pesa (Vodacom)*\n> 255768788833\n*Name:* Janeth Ibrahim\n\n💖 *Thank you and keep using DRAXEN-Ai!*\n\n${textnate}`,
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                //====[removed]===\
                ////renderLargerThumbnail: true,
                thumbnailHeight: 500,
                thumbnailWidth: 500
            },
        }
    }, { quoted: m });

    break;
}


case 'support':
case 'chanell': 
case 'chanel': {   
    await socket.sendMessage(m.chat, {
        text: `🎉 *Want to stay updated?* Join our official channel!\n\n🔗 *Channel Link:* https://whatsapp.com/channel/0029VbBFf4nEgGfS6bViYQ1O\n\n💬 *Stay connected with our latest updates, features, and news!* 🚀`,
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                //====[removed]===\
                ////renderLargerThumbnail: true,
                thumbnailHeight: 500,
                thumbnailWidth: 500
            },
        }
    }, { quoted: m });

    break;
}

case 'Draxen':
case 'Dullah':
case 'Dullahtech':
case 'hassan':
case 'hans': {
    const replies = [
        "Hello there, it's me Draxen! How can I help you today? 😊",
        "Hey! It's Draxen, what's up? 😎",
        "Yo! Draxen in the house! What can I do for you? 👋",
        // ... (keep all the replies as they are)
    ];

    const reactions = [
        "🙂",
        "😄",
        "😎",
        // ... (keep all the reactions as they are)
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    await socket.sendMessage(from, {
        text: `${randomReply} ${randomReaction}`,
        mentions: [sender],
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                //====[removed]===\
                renderLargerThumbnail: false,
                thumbnailHeight: 500,
                thumbnailWidth: 500
            },
        }
    }, { quoted: m });

    await socket.sendMessage(m.chat, {
        react: {
            text: randomReaction,
            key: msg.key
        }
    });
    break;
}


case 'sticker':
case 'stiker':
case 's': {
    await socket.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key },
    });

    try {
        let mediaToConvert;
        
        // Check if message has media or if replying to media (EXACTLY like url command)
        if (m.quoted) {
            // If replying to a message with media
            mediaToConvert = m.quoted;
        } else if (m.message?.imageMessage || m.message?.videoMessage) {
            // If sending media with caption
            mediaToConvert = m;
        } else {
            return replyglobal(m, "❌ Please reply to an image/video or send one with caption `.sticker`");
        }

        let mediaPath;
        try {
            // Download the media (EXACTLY like url command)
            mediaPath = await socket.downloadAndSaveMediaMessage(mediaToConvert, 'temp_sticker');
        } catch (err) {
            console.error("Download error:", err);
            return replyglobal(m, "❌ Failed to download media. Please make sure you're replying to or sending a valid image or video.");
        }

        if (!mediaPath || !fs.existsSync(mediaPath)) {
            return replyglobal(m, "❌ Media file missing or failed to download.");
        }

        await replyglobal(m, "⏳ Converting to sticker...");

        try {
            // Create sticker using Sticker class (like emojimix)
            const sticker = new Sticker(mediaPath, {
                pack: 'DRAXEN-Ai',
                author: 'Dullah',
                type: StickerTypes.FULL,
                categories: ['🎨', '✨'],
                quality: 50,
            });

            const stickerBuffer = await sticker.toBuffer();
            
            // Send the sticker
            await socket.sendMessage(m.chat, {
                sticker: stickerBuffer,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    }
                }
            }, { quoted: m });

            // Clean up the temporary file
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }

        } catch (convertErr) {
            // Clean up on error
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }
            console.error("Sticker conversion error:", convertErr);
            await replyglobal(m, "❌ Failed to convert to sticker. The file might be too large or invalid.");
        }

    } catch (err) {
        console.error("Sticker command error:", err);
        await replyglobal(m, "❌ An error occurred while processing your sticker request.");
    }
    break;
}

case 'smeme': {
    await socket.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key },
    });

    let respond = `Send/Reply image with caption ${userPrefix + command} text1|text2`;
    
    if (args.length === 0) return replyglobal(m, respond);

    try {
        let mediaForMeme;
        
        // Check if message has media or if replying to media (EXACTLY like url command)
        if (m.quoted) {
            // If replying to a message with media
            mediaForMeme = m.quoted;
        } else if (m.message?.imageMessage) {
            // If sending image with caption
            mediaForMeme = m;
        } else {
            return replyglobal(m, respond);
        }

        let [atas, bawah] = text.split('|');
        atas = atas || '-';
        bawah = bawah || '-';

        await replyglobal(m, "⏳ Creating meme sticker...");

        let mediaPath;
        try {
            // Download the media
            mediaPath = await socket.downloadAndSaveMediaMessage(mediaForMeme, 'temp_meme');
        } catch (err) {
            console.error("Download error:", err);
            return replyglobal(m, "❌ Failed to download image for meme.");
        }

        if (!mediaPath || !fs.existsSync(mediaPath)) {
            return replyglobal(m, "❌ Image file missing or failed to download.");
        }

        try {
            // Upload to TelegraPh
            let fatGans = await TelegraPh(mediaPath);
            if (!fatGans) throw new Error("Failed to upload to TelegraPh");

            // Generate meme URL
            let smemeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${encodeURIComponent(fatGans)}`;

            // Create sticker from URL using Sticker class (like emojimix)
            const sticker = new Sticker(smemeUrl, {
                pack: 'DRAXEN-Ai',
                author: 'Dullah',
                type: StickerTypes.FULL,
                categories: ['😂', '🎭'],
                quality: 50,
            });

            const stickerBuffer = await sticker.toBuffer();
            
            await socket.sendMessage(m.chat, {
                sticker: stickerBuffer,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    },
                    externalAdReply: {
                        title: "DRAXEN-Ai",
                        body: "Dullah",
                        thumbnailUrl: thumbnailUrl,
                        sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app"
                    }
                }
            }, { quoted: m });

        } catch (memeErr) {
            console.error("Meme creation error:", memeErr);
            await replyglobal(m, "❌ Failed to create meme sticker.");
        } finally {
            // Clean up local downloaded file
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }
        }

    } catch (err) {
        console.error("Smeme command error:", err);
        await replyglobal(m, "❌ An error occurred while creating the meme sticker.");
    }
    break;
}




case 'steal':
case 'take':    
{
    await socket.sendMessage(m.chat, {
        react: { text: "🎭", key: m.key },
    });

    try {
        // Check if user replied to a sticker
        if (!m.quoted) {
            return replyglobal(m, `❌ Please reply to a sticker with the command:\n${userPrefix + command} PackName|AuthorName\n\nExample: ${prefix + commad} DRAXEN-Ai|Draxen`);
        }


        // Parse the new pack name and author
        if (args.length === 0) {
            return replyglobal(m, `❌ Please provide new pack name and author:\n${userPrefix + command} PackName|AuthorName\n\nExample: ${userPrefix + command} DRAXEN-Ai|Draxen`);
        }

        const stealText = args.join(' ');
let [newPack, newAuthor] = stealText.split('|');
        
        // Set defaults if not provided
        newPack = newPack?.trim() || 'DRAXEN-Ai';
        newAuthor = newAuthor?.trim() || 'Dullah';

        await replyglobal(m, `⏳ Stealing sticker...\n\n📦 New Pack: ${newPack}\n👤 New Author: ${newAuthor}`);

        let stickerPath;
        try {
            // Download the sticker
            stickerPath = await socket.downloadAndSaveMediaMessage(m.quoted, 'temp_stolen_sticker');
            
            if (!stickerPath || !fs.existsSync(stickerPath)) {
                return replyglobal(m, "❌ Failed to download sticker.");
            }

            // Create new sticker with custom pack and author
            const sticker = new Sticker(stickerPath, {
                pack: newPack,
                author: newAuthor,
                type: StickerTypes.FULL,
                categories: ['🎭', '✨'],
                quality: 50,
            });

            const stickerBuffer = await sticker.toBuffer();
            
            // Send the modified sticker
            await socket.sendMessage(m.chat, {
                sticker: stickerBuffer,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    }
                }
            }, { quoted: m });

            await socket.sendMessage(sender, { 
                react: { text: '✅', key: msg.key } 
            });

        } catch (convertErr) {
            console.error("Steal command conversion error:", convertErr);
            await replyglobal(m, "❌ Failed to modify sticker. The sticker might be corrupted.");
        } finally {
            // Clean up temporary file
            if (stickerPath && fs.existsSync(stickerPath)) {
                fs.unlinkSync(stickerPath);
            }
        }

    } catch (err) {
        console.error("Steal command error:", err);
        await replyglobal(m, "❌ An error occurred while processing the sticker steal.");
    }
    break;
}



case 'toimage':
case 'toimg': {
    await socket.sendMessage(m.chat, {
        react: { text: "🖼️", key: m.key },
    });

    try {
        let stickerToConvert;
        
        // Check if message has sticker or if replying to sticker
        if (m.quoted) {
            stickerToConvert = m.quoted;
        } else if (m.message?.stickerMessage) {
            stickerToConvert = m;
        } else {
            return replyglobal(m, "❌ Please reply to a sticker or send one with caption `.toimage`");
        }


        await replyglobal(m, "⏳ Converting sticker to image...");

        let stickerBuffer;
        try {
            // Download the sticker directly as buffer
            stickerBuffer = await downloadContentFromMessage(quotedMsg.stickerMessage, 'sticker');
            let bufferArray = [];
            
            for await (const chunk of stickerBuffer) {
                bufferArray.push(chunk);
            }
            
            stickerBuffer = Buffer.concat(bufferArray);
            
            if (!stickerBuffer || stickerBuffer.length === 0) {
                return replyglobal(m, "❌ Failed to download sticker data.");
            }

            // Send the webp buffer as image (WhatsApp supports webp as images)
            await socket.sendMessage(m.chat, {
                image: stickerBuffer,
                caption: "🖼️ *Sticker converted to image*",
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    }
                }
            }, { quoted: m });

            await socket.sendMessage(sender, { 
                react: { text: '✅', key: msg.key } 
            });

        } catch (err) {
            console.error("Conversion error:", err);
            
            // Fallback: Try alternative download method
            try {
                let stickerPath = await socket.downloadAndSaveMediaMessage(stickerToConvert, 'temp_sticker.webp');
                if (stickerPath && fs.existsSync(stickerPath)) {
                    const webpBuffer = fs.readFileSync(stickerPath);
                    
                    await socket.sendMessage(m.chat, {
                        image: webpBuffer,
                        caption: "🖼️ *Sticker converted to image*",
                        contextInfo: {
                            forwardingScore: 5,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterName: "Dullah - Draxen-Ai",
                                newsletterJid: "120363402252728845@newsletter",
                            }
                        }
                    }, { quoted: m });

                    await socket.sendMessage(sender, { 
                        react: { text: '✅', key: msg.key } 
                    });
                    
                    // Clean up
                    fs.unlinkSync(stickerPath);
                } else {
                    throw new Error("Fallback also failed");
                }
            } catch (fallbackErr) {
                console.error("Fallback conversion error:", fallbackErr);
                await replyglobal(m, "❌ Failed to convert sticker to image.");
            }
        }

    } catch (err) {
        console.error("Toimage command error:", err);
        await replyglobal(m, "❌ An error occurred while converting the sticker.");
    }
    break;
}







case 'emojimix':
case 'emix': {
    // Get only the text after the command
    const emojiText = args.join(' ');
    
    if (!emojiText) {
        return await replyglobal(m, `❌ Please provide two emojis!\n\nExample: ${userPrefix + command} 😀+😂`);
    }
    
    // Simple extraction - just take the first two emoji-like characters
    const emojiMatches = emojiText.match(/[\u{1F300}-\u{1F9FF}]/gu);
    
    if (!emojiMatches || emojiMatches.length < 2) {
        return await replyglobal(m, "❌ Please provide at least two valid emojis!");
    }
    
    const emoji1 = emojiMatches[0];
    const emoji2 = emojiMatches[1];
    
    await replyglobal(m, `⏳ Mixing ${emoji1} and ${emoji2}...`);

    try {
        let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);
        
        if (!anu.results || anu.results.length === 0) {
            return await replyglobal(m, `❌ No combination found for ${emoji1} and ${emoji2}`);
        }

        for (let res of anu.results) {
            try {
                // Download the image
                const response = await axios.get(res.url, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data);
                
                // Create sticker using the Sticker class
                const sticker = new Sticker(imageBuffer, {
                    pack: 'DRAXEN-Ai',
                    author: 'Dullah',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    quality: 50,
                });
                
                // Send the sticker
                const stickerBuffer = await sticker.toBuffer();
                await socket.sendMessage(m.chat, {
                    sticker: stickerBuffer,
                    contextInfo: {
                        forwardingScore: 5,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "Dullah - Draxen-Ai",
                            newsletterJid: "120363402252728845@newsletter",
                        }
                    }
                }, { quoted: m });
                
            } catch (stickerErr) {
                console.error("Error creating sticker:", stickerErr);
                // If sticker fails, send as image
                await socket.sendMessage(m.chat, {
                    image: { url: res.url },
                    caption: `🎭 ${emoji1} + ${emoji2}`,
                    contextInfo: {
                        forwardingScore: 5,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "Dullah - Draxen-Ai",
                            newsletterJid: "120363402252728845@newsletter",
                        }
                    }
                }, { quoted: m });
            }
        }
    } catch (err) {
        console.error("EmojiMix error:", err);
        await replyglobal(m, "❌ Failed to mix emojis. Try again later.");
    }
    break;
}

case 'toqr':
case 'qr':    
{
    if (args.length === 0) return replyglobal(m, '❌ Please provide text or link to generate QR code!')
    
    const qrcode = require('qrcode')
    
    try {
        const textToEncode = args.join(' ');
        
        // Generate QR code as data URL
        const qrDataUrl = await qrcode.toDataURL(textToEncode, {
            scale: 8,
            margin: 2,
            width: 500,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        // Convert data URL to buffer
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
        const qrBuffer = Buffer.from(base64Data, 'base64');
        
        await socket.sendMessage(from, {
            image: qrBuffer,
            caption: "*📱 QR Code Generated!*",
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
        
    } catch (err) {
        console.error('QR Code Error:', err);
        await replyglobal(m, '❌ Failed to generate QR code. Please try again.');
    }
    break;
}

case 'fliptext': {
    if (args.length < 1) return replyglobal(m, `Example:\n${prefix}fliptext Draxen`)
    quere = args.join(" ")
    flipe = quere.split('').reverse().join('')
    replyglobal(m, `\`\`\`「 FLIP TEXT 」\`\`\`\n*•> Normal :*\n${quere}\n*•> Flip :*\n${flipe}`)
    break;
}


case 'url':
case 'tourl': {
    await socket.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key },
    });

    try {
        const FormData = require('form-data');

        // Function to upload to Catbox
        async function uploadToCatbox(filePath) {
            if (!fs.existsSync(filePath)) throw new Error("File does not exist");

            const data = new FormData();
            data.append('reqtype', 'fileupload');
            data.append('userhash', '');
            data.append('fileToUpload', fs.createReadStream(filePath));

            const config = {
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                headers: {
                    ...data.getHeaders(),
                },
                data: data,
                timeout: 60000 // 60 seconds for larger files
            };

            const res = await axios.request(config);
            return res.data.trim();
        }

        let mediaToUpload;
        
        // Check if message has media or if replying to media
        if (m.quoted) {
            // If replying to a message with media
            mediaToUpload = m.quoted;
        } else if (m.message?.imageMessage || m.message?.videoMessage || m.message?.audioMessage || m.message?.documentMessage) {
            // If sending media with caption
            mediaToUpload = m;
        } else {
            return replyglobal(m, "❌ Please reply to an image, video, audio, or document, or send one with caption `.url`");
        }

        let mediaPath;
        try {
            // Download the media
            mediaPath = await socket.downloadAndSaveMediaMessage(mediaToUpload, 'upload_temp');
        } catch (err) {
            console.error("Download error:", err);
            return replyglobal(m, "❌ Failed to download media. Please make sure you're replying to or sending a valid image, video, audio, or document.");
        }

        if (!mediaPath || !fs.existsSync(mediaPath)) {
            return replyglobal(m, "❌ Media file missing or failed to download.");
        }

        // Get file size for info
        const fileStats = fs.statSync(mediaPath);
        const fileSize = formatBytes(fileStats.size);

        await replyglobal(m, `📤 *Uploading...*\n\n📊 File Size: ${fileSize}\n⏳ Please wait...`);

        try {
            const catboxUrl = await uploadToCatbox(mediaPath);
            
            // Clean up the temporary file
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }

            // Determine media type for emoji
            let mediaType = "File";
            let mediaEmoji = "📁";
            
            if (m.quoted?.message?.imageMessage || m.message?.imageMessage) {
                mediaType = "Image";
                mediaEmoji = "🖼️";
            } else if (m.quoted?.message?.videoMessage || m.message?.videoMessage) {
                mediaType = "Video";
                mediaEmoji = "🎥";
            } else if (m.quoted?.message?.audioMessage || m.message?.audioMessage) {
                mediaType = "Audio";
                mediaEmoji = "🎵";
            } else if (m.quoted?.message?.documentMessage || m.message?.documentMessage) {
                mediaType = "Document";
                mediaEmoji = "📄";
            }

            await socket.sendMessage(m.chat, {
                text: `${mediaEmoji} *${mediaType} Uploaded Successfully!*\n\n🔗 *URL:* ${catboxUrl}\n📊 *Size:* ${fileSize}\n\n*Link will expire in 30 days*`,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    },
                    externalAdReply: {
                        title: "DRAXEN-Ai",
                        body: "File Uploader",
                        thumbnailUrl: catboxUrl || 'https://files.catbox.moe/tmmvub.jpg',
                        sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                        renderLargerThumbnail: false,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500
                    }
                }
            }, { quoted: m });

            // Also send just the URL as a separate message for easy copying
            await socket.sendMessage(m.chat, {
                text: catboxUrl
                
            }, {quoted: m});

        } catch (uploadErr) {
            // Clean up on error
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }
            console.error("Upload error:", uploadErr);
            replyglobal(m, "❌ Failed to upload file to Catbox. The file might be too large or there's a network issue.");
        }

    } catch (err) {
        console.error("URL command error:", err);
        replyglobal(m, "❌ An error occurred while processing your request.");
    }
    break;
}

case 'analyse': {
    await socket.sendMessage(m.chat, {
        react: { text: "🔍", key: m.key },
    });

    try {
        const FormData = require('form-data');

        async function uploadToCatbox(filePath) {
            if (!fs.existsSync(filePath)) throw new Error("File does not exist");

            const data = new FormData();
            data.append('reqtype', 'fileupload');
            data.append('userhash', '');
            data.append('fileToUpload', fs.createReadStream(filePath));

            const config = {
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                headers: {
                    ...data.getHeaders(),
                },
                data: data,
                timeout: 30000
            };

            const res = await axios.request(config);
            return res.data.trim();
        }

        if (!m.quoted) {
            return replyglobal(m, "❌ Please reply to an image to analyze.");
        }

        let mediaPath;
        try {
            // Use the fixed downloadAndSaveMediaMessage
            mediaPath = await socket.downloadAndSaveMediaMessage(m.quoted, 'temp_image');
        } catch (err) {
            console.error("Download error:", err);
            return replyglobal(m, "❌ Failed to download image. Please make sure you're replying to an image.");
        }

        if (!mediaPath || !fs.existsSync(mediaPath)) {
            return replyglobal(m, "❌ Image file missing or failed to download.");
        }

        // Notify user that image is being analyzed
        await replyglobal(m, "🧠 *Analyzing your image...* \n*Please wait.*");

        try {
            const catboxUrl = await uploadToCatbox(mediaPath);
            
            const visionApiUrl = `https://api.giftedtech.web.id/api/ai/vision?apikey=gifted&url=${encodeURIComponent(catboxUrl)}&prompt=Describe+in+detail+what+is+in+the+picture`;

            const { data } = await axios.get(visionApiUrl, { timeout: 30000 });

            // Clean up the temporary file
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }

            if (data && data.success && data.result) {
                await socket.sendMessage(m.chat, {
                    text: `🧠 *Image Analysis:*\n\n${data.result}`,
                    contextInfo: {
                        forwardingScore: 5,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "Dullah - Draxen-Ai",
                            newsletterJid: "120363402252728845@newsletter",
                        },
                        externalAdReply: {
                            title: "DRAXEN-Ai",
                            body: "Image Analyzer",
                            thumbnailUrl: catboxUrl || "ttps://files.catbox.moe/j7pimt.jpeg", 
                            sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                            renderLargerThumbnail: false,
                            thumbnailHeight: 500,
                            thumbnailWidth: 500,
                        },
                    },
                }, { quoted: m });
            } else {
                replyglobal(m, "❌ Analysis failed. No result from AI.");
            }

        } catch (uploadErr) {
            // Clean up on error
            if (fs.existsSync(mediaPath)) {
                fs.unlinkSync(mediaPath);
            }
            console.error("Upload/Analysis error:", uploadErr);
            replyglobal(m, "❌ Failed to upload or analyze image. Please try again.");
        }

    } catch (err) {
        console.error("Analyse error:", err);
        replyglobal(m, "❌ An error occurred while analyzing the image.");
    }
    break;
}

case 'bug': 
case 'reportbug':
case 'report':
case 'bugreport': {
    if (args.length === 0) return replyglobal(m, `Use ${command} to report errors and bugs\n\nExample: ${userPrefix + command} Hello Draxen, play command is not working`); 

    const reportHeader = `📌 *| BUG REPORT |*`;
    const userMention = `@${m.sender.split("@")[0]}`;
    const bugMessage = `\n\n👤 *User* : ${userMention}\n🐞 *Bug/Request* : ${args.join(' ')}`;
    const ownerReply = `\n\n✅ *Hey ${pushname}, your request has been forwarded to my Owner.*\n⏳ *Please wait for a response...*`;
    
    await socket.sendMessage(
        '255716945971@s.whatsapp.net',
        {
            text: reportHeader + bugMessage,
            mentions: [m.sender], 
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                externalAdReply: {
                    showAdAttribution: true,
                    title: "DRAXEN-Ai - Bug Report",
                    body: "New user report received!",
                    thumbnailUrl: "ttps://files.catbox.moe/j7pimt.jpeg", 
                    sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                    //====[removed]===\
                    renderLargerThumbnail: false,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500
                },
            },
        },
        { quoted: m } 
    );
    
    await socket.sendMessage(
        m.chat,
        {
            text: reportHeader + ownerReply,
            mentions: [m.sender], 
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                },
                externalAdReply: {
                    showAdAttribution: true,
                    title: "Bug Report Sent!",
                    body: "Our team will review your report shortly.",
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: "https://Draxen-Ai-bot.vercel.app", 
                    //====[removed]===\
                    ////renderLargerThumbnail: true,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500
                },
            },
        },
        { quoted: m } 
    );
    break;
}

case 'poll': {
    if (!isOwner) return replyglobal(m, `❌ You are not my owner.`); 
    const PollText = args.join(' ');
    let [poll, opt] = PollText.split("|").map(str => str.trim());
    if (!poll || !opt || opt.split(',').length < 2) {
        return replyglobal(m, `❌ Mention a question and at least 2 options.\nExample: ${prefix}poll Which is the fastetests bot?|Draxen_MD,Draxen-Ai,GIFTED-MD`);
    }
    let options = opt.split(',').map(option => option.trim());
    
    await socket.sendMessage(
        m.chat,
        {
            poll: {
                name: poll,
                values: options, 
            },
        },
        { quoted: m }
    );

    await socket.sendMessage(sender, { 
                react: { text: '✅', key: msg.key } 
            });
    break;
}

case 'lyrics': {
    if (args.length === 0) return replyglobal(m, `*provide song and artist name by using | to split*\n*Example:* ${userPrefix + command} ghost | justin bieber`);
  
    try {
        // Use args.join(' ') to get the text without command, then split by |
        const lyricsText = args.join(' ');
        const [title, artist] = lyricsText.split('|').map(str => str.trim());
        
        if (!title || !artist) return replyglobal(m, `*Please provide both song title and artist, example.:* ${userPrefix + command} ghost | justin bieber`);
        
        await socket.sendMessage(m.chat, { react: { text: `🎶`, key: m.key } });
        
        const apiUrl = `https://apis.davidcyriltech.my.id/lyrics?t=${encodeURIComponent(title)}&a=${encodeURIComponent(artist)}`;
        const response = await axios.get(apiUrl);
  
        if (response.data && response.data.lyrics) {
            const { title, artist, lyrics } = response.data;
            const lyricsMessage = `
━━━━━━━━━━━━━━━━━━━━
┃  🎵 *LYRICS DOWNLOADER*  🚀
━━━━━━━━━━━━━━━━━━━━
> ║🎶 *Title:* ${title}
> ║🎤 *Artist:* ${artist}
────────────────────
${lyrics}
────────────────────
> *DRAXEN-Ai*
  `.trim();
            
            await socket.sendMessage(
                m.chat,
                {
                    text: lyricsMessage,
                    contextInfo: {
                        forwardingScore: 5,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "Dullah - Draxen-Ai",
                            newsletterJid: "120363402252728845@newsletter",
                        },
                        externalAdReply: {
                            showAdAttribution: true,
                            title: `DRAXEN-Ai`,
                            body: `Dullah`,
                            thumbnailUrl: 'ttps://files.catbox.moe/j7pimt.jpeg', 
                            sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                            ////renderLargerThumbnail: true,
                            thumbnailHeight: 500,
                            thumbnailWidth: 500
                        },
                    },
                },
                { quoted: m }
            );
        } else {
            replyglobal(m, `*No lyrics found for:* ${title} by ${artist}`);
        }
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        replyglobal(m, `*Failed to fetch lyrics. Possible reasons:*\n1. Invalid title or artist.\n2. API issues.\n\n*Error Details:* ${error.message}`);
    }
    break;
}


//====================================== imdb ====================\\


case 'imdb':
case 'moviesearch': {

    const imdbName = args.join(' ').trim();

    if (!imdbName) return replyglobal(m, `_Name a Series or movie_`);
    await replyglobal(m, `Please wait...`);

    try {
        let fids = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${imdbName}&plot=full`);
        let imdbt = "";
        console.log(fids.data);

        imdbt += "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n" + " ``` IMDB SEARCH```\n" + "⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n";
        imdbt += "🎬Title      : " + fids.data.Title + "\n";
        imdbt += "📅Year       : " + fids.data.Year + "\n";
        imdbt += "⭐Rated      : " + fids.data.Rated + "\n";
        imdbt += "📆Released   : " + fids.data.Released + "\n";
        imdbt += "⏳Runtime    : " + fids.data.Runtime + "\n";
        imdbt += "🌀Genre      : " + fids.data.Genre + "\n";
        imdbt += "👨🏻‍💻Director   : " + fids.data.Director + "\n";
        imdbt += "✍Writer     : " + fids.data.Writer + "\n";
        imdbt += "👨Actors     : " + fids.data.Actors + "\n";
        imdbt += "📃Plot       : " + fids.data.Plot + "\n";
        imdbt += "🌐Language   : " + fids.data.Language + "\n";
        imdbt += "🌍Country    : " + fids.data.Country + "\n";
        imdbt += "🎖️Awards     : " + fids.data.Awards + "\n";
        imdbt += "📦BoxOffice  : " + fids.data.BoxOffice + "\n";
        imdbt += "🏙️Production : " + fids.data.Production + "\n";
        imdbt += "🌟imdbRating : " + fids.data.imdbRating + "\n";
        imdbt += "✅imdbVotes  : " + fids.data.imdbVotes + "";

        await socket.sendMessage(
            m.chat,
            {
                image: { url: fids.data.Poster },
                caption: imdbt,
                contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: fids.data.Title || "DRAXEN-Ai",
                body: fids.data.Director || "Dullah",
                thumbnailUrl: fids.data.Poster || 'https://files.catbox.moe/tmmvub.jpg',
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                thumbnailHeight: 500,
                thumbnailWidth: 500
            },
        }
    }, { quoted: m });
    } catch (error) {
        console.error('Error in IMDB command:', error);
        replyglobal(m, `*AN ERROR OCCURRED!!`);
    }
    break;
}



///====================================imdb ==========================\\







//=======================================[define]======================================\\
case 'define': {
    let term = args.join(' ').trim();

    if (!term) {
        return replyglobal(m, `🔤 *Usage:* ${prefix}define BMW\nOr reply to a message containing the word.`);
    }

    try {
        replyglobal(m, `🔎 Searching definition for *${term}*...`);

        let res = await axios.get(`https://api.giftedtech.web.id/api/tools/define?apikey=gifted&term=${encodeURIComponent(term)}`);

        if (!res.data || !res.data.success || !res.data.result || res.data.result.length === 0) {
            return replyglobal(m, `❌ *No definition found for:* _${term}_`);
        }

        let definitions = res.data.result;

        let replyText = `───〔 📚 𝙳𝙴𝙵𝙸𝙽𝙸𝚃𝙸𝙾𝙽 〕───⬣\n`;
        replyText += `│ 📌 *Term:* ${term}\n│\n`;

        definitions.slice(0, 3).forEach((def, i) => {
            replyText += `│ 🧠 *Definition ${i + 1}:*\n│ ${def.definition}\n`;
            if (def.example) replyText += `│ 💡 *Example:*\n│ _${def.example}_\n│\n`;
        });

        replyText += `──────⬣`;

        await socket.sendMessage(m.chat, {
            text: replyText,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                externalAdReply: {
                    title: "Dullah DICTIONARY",
                    body: `Meaning of '${term}'`,
                    thumbnailUrl: "https://files.catbox.moe/tmmvub.jpg",
                    sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                    thumbnailHeight: 500,
                    thumbnailWidth: 500,
                },
            }
        }, { quoted: m });

    } catch (e) {
        console.error('Define Error:', e);
        replyglobal(m, "❌ *Failed to fetch definition. Try again later.*");
    }
    break;
}

//==========================[define ends]=========================\\





///============================[rate]========================\\

case 'rate': {
     const text = args.join(' ').trim();
                if (!textnae) return replyglobal(m, `Example : ${prefix + command} my profile`)
                let ra = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
                let kah = ra[Math.floor(Math.random() * ra.length)]
                let jawab = `*Rate ${text}*\nAnswer : ${kah}%`                
            await replyglobal(m, jawab)
            }
            break

            case 'soulmate': {
              if (!m.isGroup) return replyglobal(m, `For groups only`);
              let member = participants.map(u => u.id);
              let me = m.sender;
              let jodoh = member[Math.floor(Math.random() * member.length)];
              let randomThumbnail = 'https://files.catbox.moe/454dp6.jpg'; 
              socket.sendMessage(m.chat, {
                  text: `👫Your Soulmate Is\n\n@${me.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`,
                  contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: 'https://files.catbox.moe/a7ckn2.jpeg',
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                thumbnailHeight: 500,
                thumbnailWidth: 500
            },
        }
    }, { quoted: m });
              break;
          }

          ///=============================[]
          case 'coffee':
            case 'cafe': {
                const DraxenFacts = [
                    "DRAXEN-Ai is the most advanced AI bot you'll ever use! 🤖",
                    "With DRAXEN-Ai, you can automate your tasks effortlessly. 🚀",
                    "DRAXEN-Ai supports over 1000 commands! 🎉",
                    "The bot is powered by cutting-edge AI technology. 💡",
                    "DRAXEN-Ai can fetch data from APIs in milliseconds. ⚡",
                    "It has a 99.9% uptime, ensuring you're always connected. 🌐",
                    "DRAXEN-Ai is designed to make your life easier. 😎",
                    "The bot can handle thousands of users simultaneously. 👥",
                    "It supports multimedia commands like images, videos, and audio. 🎨",
                    "DRAXEN-Ai is constantly updated with new features. 🔄",
                    "The bot is highly customizable to fit your needs. 🛠️",
                    "It has a built-in error handling system for smooth operation. 🛡️",
                    "DRAXEN-Ai can generate memes, quotes, and more! 🖼️",
                    "The bot supports multiple languages for global users. 🌍",
                    "It can fetch real-time data like weather, news, and stocks. 📊",
                    "DRAXEN-Ai is secure and protects your privacy. 🔒",
                    "The bot has a user-friendly interface for easy navigation. 🖥️",
                    "It can integrate with third-party apps and services. 🔗",
                    "DRAXEN-Ai is designed for both personal and professional use. 💼",
                    "The bot can send scheduled messages and reminders. ⏰",
                    "It has a built-in AI chatbot for interactive conversations. 💬",
                    "DRAXEN-Ai can generate random facts, jokes, and trivia. 🎲",
                    "The bot supports voice commands for hands-free operation. 🎙️",
                    "It can fetch and display high-quality images and videos. 📸",
                    "DRAXEN-Ai is optimized for fast and efficient performance. ⚙️",
                    "The bot has a dedicated support team for assistance. 👨‍💻",
                    "It can fetch and display trending topics and memes. 🔥",
                    "DRAXEN-Ai is compatible with all major platforms. 📱",
                    "The bot can generate QR codes and barcodes. 📇",
                    "It has a built-in translator for multilingual support. 🌐",
                    "DRAXEN-Ai can fetch and display movie and series details. 🎬",
                    "The bot can generate random quotes and inspirations. ✨",
                    "It has a built-in calculator and unit converter. 🧮",
                    "DRAXEN-Ai can fetch and display sports scores and updates. 🏀",
                    "The bot can generate random passwords and secure keys. 🔑",
                    "It has a built-in reminder system for important tasks. 📅",
                    "DRAXEN-Ai can fetch and display horoscopes and astrology. 🌌",
                    "The bot can generate random names, addresses, and more. 📝",
                    "It has a built-in AI image generator for creative designs. 🎨",
                    "DRAXEN-Ai can fetch and display cryptocurrency prices. 💹",
                    "The bot can generate random facts about science and history. 📚",
                    "It has a built-in AI voice assistant for voice commands. 🗣️",
                    "DRAXEN-Ai can fetch and display flight and travel info. ✈️",
                    "The bot can generate random memes and jokes. 😂",
                    "It has a built-in AI music player for entertainment. 🎵",
                    "DRAXEN-Ai can fetch and display news and headlines. 📰",
                    "The bot can generate random recipes and cooking tips. 🍳",
                    "It has a built-in AI fitness coach for health tips. 🏋️",
                    "DRAXEN-Ai can fetch and display game stats and updates. 🎮",
                    "The bot can generate random motivational quotes. 💪",
                    "It has a built-in AI tutor for educational support. 📖",
                ];
                const randomFact = DraxenFacts[Math.floor(Math.random() * DraxenFacts.length)];
                await socket.sendMessage(
                    m.chat,
                    {
                        caption: `☕ *Here's your coffee!*\n\n*Did you know?*\n${randomFact}`,
                        image: { url: 'https://coffee.alexflipnote.dev/random' },
                      contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah",
                newsletterJid: "120363402252728845@newsletter",
            },
        
        }
    }, { quoted: m });

                break;
            }

            //=============================[]


            //=======================================[dare]

            case 'dare': {
              const dare = [
                  "Eat a raw chili pepper and record your reaction.",
                  "Call a random number and say, *'I know what you did last summer.'*",
                  "Send a voice note to your crush saying, *'I’ve been dreaming about you every night.'*",
                  "Post a status saying, *'I’m single and ready to mingle. Slide into my DMs if you dare.'* Leave it up for 3 hours.",
                  "Text your ex and say, *'I miss the way you used to make me feel. Can we talk?'*",
                  "Go to a public place and shout, *'I’m the king/queen of the world!'* at the top of your lungs.",
                  "Send a voice note singing the most cringy song you know and tag a random group member.",
                  "Change your profile picture to a meme of yourself for 24 hours.",
                  "Call your best friend and say, *'I’ve been hiding something from you… I’m in love with you.'* Don’t explain it’s a dare for 5 minutes.",
                  "Eat a raw onion like an apple and send a video as proof.",
                  "Send a voice note saying, *'I’m the most annoying person in the world, and I love it!'* to the last person you texted.",
                  "Post a status with the caption, *'I’m pregnant, and I don’t know who the father is.'* Leave it up for 1 hour.",
                  "Text your boss or teacher and say, *'I think I’m in love with you. Let’s run away together.'*",
                  "Send a voice note saying, *'I’m the dumbest person alive, and I’m proud of it!'* to a random group member.",
                  "Call a random contact and say, *'I’ve been watching you. Meet me at midnight if you dare.'*",
                  "Post a status with the caption, *'I’m quitting social media forever. Goodbye, everyone.'* Delete it after 30 minutes.",
                  "Send a voice note saying, *'I’m the most attractive person in this group, and you all know it.'* to the group chat.",
                  "Text your crush and say, *'I can’t stop thinking about you. What’s your favorite color? I need to know for… reasons.'*",
                  "Eat a spoonful of salt and record your reaction.",
                  "Send a voice note saying, *'I’m the best dancer in the world. Watch me!'* and then send a video of you dancing badly.",
                  "Call a random number and say, *'I’m your biggest fan. Can I have your autograph?'*",
                  "Post a status with the caption, *'I’m in love with my best friend. What should I do?'* Leave it up for 2 hours.",
                  "Send a voice note saying, *'I’m the most annoying person you’ll ever meet, and I’m proud of it!'* to the last person you called.",
                  "Text your ex and say, *'I still have your hoodie. Do you want it back, or should I keep it as a memory?'*",
                  "Call a random contact and say, *'I’m your secret admirer. Meet me at the park at midnight.'*",
                  "Post a status with the caption, *'I’m moving to Mars. Who’s coming with me?'* Leave it up for 1 hour.",
                  "Send a voice note saying, *'I’m the most talented person in this group, and I’m not afraid to show it!'* to the group chat.",
                  "Text your crush and say, *'I had a dream about you last night. It was… interesting.'*",
                  "Eat a spoonful of sugar and record your reaction.",
                  "Send a voice note saying, *'I’m the best singer in the world. Listen to this!'* and then sing the worst song you know.",
                  "Call a random number and say, *'I’m your biggest fan. Can I have your autograph?'*",
                  "Post a status with the caption, *'I’m in love with my best friend. What should I do?'* Leave it up for 2 hours.",
                  "Send a voice note saying, *'I’m the most annoying person you’ll ever meet, and I’m proud of it!'* to the last person you called.",
                  "Text your ex and say, *'I still have your hoodie. Do you want it back, or should I keep it as a memory?'*",
                  "Call a random contact and say, *'I’m your secret admirer. Meet me at the park at midnight.'*",
                  "Post a status with the caption, *'I’m moving to Mars. Who’s coming with me?'* Leave it up for 1 hour.",
                  "Send a voice note saying, *'I’m the most talented person in this group, and I’m not afraid to show it!'* to the group chat.",
                  "Text your crush and say, *'I had a dream about you last night. It was… interesting.'*",
                  "Eat a spoonful of sugar and record your reaction.",
                  "Send a voice note saying, *'I’m the best singer in the world. Listen to this!'* and then sing the worst song you know.",
                  "Call a random number and say, *'I’m your biggest fan. Can I have your autograph?'*",
                  "Post a status with the caption, *'I’m in love with my best friend. What should I do?'* Leave it up for 2 hours.",
                  "Send a voice note saying, *'I’m the most annoying person you’ll ever meet, and I’m proud of it!'* to the last person you called.",
                  "Text your ex and say, *'I still have your hoodie. Do you want it back, or should I keep it as a memory?'*",
                  "Call a random contact and say, *'I’m your secret admirer. Meet me at the park at midnight.'*",
                  "Post a status with the caption, *'I’m moving to Mars. Who’s coming with me?'* Leave it up for 1 hour.",
                  "Send a voice note saying, *'I’m the most talented person in this group, and I’m not afraid to show it!'* to the group chat.",
                  "Text your crush and say, *'I had a dream about you last night. It was… interesting.'*",
                  "Eat a spoonful of sugar and record your reaction.",
                  "Send a voice note saying, *'I’m the best singer in the world. Listen to this!'* and then sing the worst song you know.",
                  "Call a random number and say, *'I’m your biggest fan. Can I have your autograph?'*",
                  "Post a status with the caption, *'I’m in love with my best friend. What should I do?'* Leave it up for 2 hours.",
                  "Send a voice note saying, *'I’m the most annoying person you’ll ever meet, and I’m proud of it!'* to the last person you called.",
                  "Text your ex and say, *'I still have your hoodie. Do you want it back, or should I keep it as a memory?'*",
                  "Call a random contact and say, *'I’m your secret admirer. Meet me at the park at midnight.'*",
                  "Post a status with the caption, *'I’m moving to Mars. Who’s coming with me?'* Leave it up for 1 hour.",
                  "Send a voice note saying, *'I’m the most talented person in this group, and I’m not afraid to show it!'* to the group chat.",
                  "Text your crush and say, *'I had a dream about you last night. It was… interesting.'*",
                  "Eat a spoonful of sugar and record your reaction.",
                  "Send a voice note saying, *'I’m the best singer in the world. Listen to this!'* and then sing the worst song you know.",
                  "Call a random number and say, *'I’m your biggest fan. Can I have your autograph?'*",
                  "Post a status with the caption, *'I’m in love with my best friend. What should I do?'* Leave it up for 2 hours.",
                  "Send a voice note saying, *'I’m the most annoying person you’ll ever meet, and I’m proud of it!'* to the last person you called.",
                  "Text your ex and say, *'I still have your hoodie. Do you want it back, or should I keep it as a memory?'*",
                  "Call a random contact and say, *'I’m your secret admirer. Meet me at the park at midnight.'*",
                  "Post a status with the caption, *'I’m moving to Mars. Who’s coming with me?'* Leave it up for 1 hour.",
                  "Send a voice note saying, *'I’m the most talented person in this group, and I’m not afraid to show it!'* to the group chat.",
                  "Text your crush and say, *'I had a dream about you last night. It was… interesting.'*",
                  "Eat a spoonful of sugar and record your reaction.",
                  "Send a voice note saying, *'I’m the best singer in the world. Listen to this!'* and then sing the worst song you know."
              ];
          
              const Draxendare = dare[Math.floor(Math.random() * dare.length)];
              bufferdare = await getBuffer(`https://i.ibb.co/gLNc5SGK/ce5871f200bb421678c982f5af52d7fd.jpg`);
          
              await socket.sendMessage(
                  from,
                  {
                      image: bufferdare,
                      caption: '_You choose DARE_\n' + Draxendare,
                      contextInfo: {
                          forwardingScore: 5,
                          isForwarded: true,
                          forwardedNewsletterMessageInfo: {
                              newsletterName: "Dullah",
                              newsletterJid: "120363402252728845@newsletter",
                          },
                      },
                  },
                  { quoted: m }
              );
              break;
          }
//================================================[]



//=================================================[truth]

          case 'truth':
  const truth = [
    "Have you ever liked anyone? How long?",
    "If you could be friends with anyone in this group, who would it be?",
    "What is your biggest fear?",
    "Have you ever liked someone and felt they liked you back?",
    "What’s the name of your friend’s ex that you secretly had a crush on?",
    "Have you ever stolen money from your parents? Why?",
    "What makes you happy when you’re sad?",
    "Have you ever had a one-sided love? Who was it, and how did it feel?",
    "Have you ever been someone’s mistress?",
    "What’s the scariest thing you’ve ever experienced?",
    "Who is the most influential person in your life?",
    "What’s the proudest moment of your life this year?",
    "Who is the one person who can always cheer you up?",
    "Who has made you the happiest in your life?",
    "Who in this group is closest to your ideal type?",
    "Who do you enjoy spending the most time with?",
    "Have you ever rejected someone? Why?",
    "What’s the most painful memory you still remember?",
    "What’s the biggest achievement you’ve had this year?",
    "What’s your worst habit at school or work?",
    "What song do you sing the most in the shower?",
    "Have you ever had a near-death experience?",
    "When was the last time you were really angry, and why?",
    "Who was the last person to call you?",
    "Do you have any hidden talents? What are they?",
    "What word do you hate the most?",
    "What’s the last YouTube video you watched?",
    "What’s the last thing you Googled?",
    "Who in this group would you swap lives with for a week?",
    "What’s the scariest thing that’s ever happened to you?",
    "Have you ever farted and blamed it on someone else?",
    "When was the last time you made someone cry?",
    "Have you ever ghosted a friend?",
    "Have you ever seen a dead body?",
    "Which family member annoys you the most, and why?",
    "If you had to delete one app from your phone, which one would it be?",
    "What app do you waste the most time on?",
    "Have you ever faked being sick to get out of something?",
    "What’s the most embarrassing thing in your room?",
    "What five items would you bring to a deserted island?",
    "Have you ever laughed so hard you peed your pants?",
    "Do you smell your own farts?",
    "Have you ever peed in your bed while sleeping?",
    "What’s the biggest mistake you’ve ever made?",
    "Have you ever cheated on a test?",
    "What’s the worst thing you’ve ever done?",
    "When was the last time you cried?",
    "Who do you love more: your mom or your dad?",
    "Do you sometimes pick your nose?",
    "Who was your childhood crush?",
    "Do you like anyone in this group? If yes, who?",
    "Do you have a boyfriend or girlfriend?",
    "What’s your biggest fear?",
    "Have you ever liked someone and felt they liked you back?",
    "What’s the name of your friend’s ex that you secretly liked?",
    "Have you ever stolen money from your parents? Why?",
    "What makes you happy when you’re sad?",
    "Do you like someone in this group? If yes, who?",
    "Have you ever been cheated on?",
    "Who is the most important person in your life?",
    "What’s the proudest moment of your life this year?",
    "Who is the one person who can always cheer you up?",
    "Who has made you feel uncomfortable in your life?",
    "Have you ever lied to your parents?",
    "Do you still have feelings for your ex?",
    "Who do you enjoy spending the most time with?",
    "Have you ever stolen something big? Why?",
    "What’s the most painful memory you still remember?",
    "What’s the biggest achievement you’ve had this year?",
    "What’s your worst habit at school or work?",
    "Do you love the bot creator, Draxen? 😏",
    "Have you ever thought about getting revenge on a teacher?",
    "Do you like the current prime minister of your country?",
    "Are you a vegetarian or non-vegetarian?",
    "If you could be invisible, what’s the first thing you’d do?",
    "What’s a secret you’ve kept from your parents?",
    "Who is your secret crush?",
    "Who was the last person you stalked on social media?",
    "If a genie granted you three wishes, what would you ask for?",
    "What’s your biggest regret?",
    "What animal do you think you look like the most?",
    "How many selfies do you take in a day?",
    "What was your favorite childhood show?",
    "If you could be a fictional character for a day, who would you choose?",
    "Who do you text the most?",
    "What’s the biggest lie you’ve told your parents?",
    "Who is your celebrity crush?",
    "What’s the strangest dream you’ve ever had?",
    "Do you play PUBG? If yes, share your ID.",
    "What’s the most embarrassing thing you’ve done in public?",
    "Have you ever lied to your best friend?",
    "What’s the most expensive thing you’ve stolen?",
    "Have you ever had a crush on a teacher?",
    "What’s the weirdest thing you’ve ever eaten?",
    "Have you ever been in love with two people at the same time?",
    "What’s the most childish thing you still do?",
    "Have you ever been caught doing something you shouldn’t?",
    "What’s the most embarrassing text you’ve sent?",
    "Have you ever pretended to like a gift?",
    "What’s the most ridiculous rumor you’ve heard about yourself?",
    "Have you ever had a crush on a friend’s partner?",
    "What’s the most embarrassing thing your parents have caught you doing?",
    "Have you ever lied about your age?",
    "What’s the most embarrassing thing you’ve posted online?",
    "Have you ever cheated in a relationship?",
    "What’s the most embarrassing thing you’ve done to impress someone?",
    "Have you ever had a crush on a celebrity?",
    "What’s the most embarrassing thing you’ve done at work or school?",
    "Have you ever lied to get out of trouble?",
    "What’s the most embarrassing thing you’ve done in front of your crush?",
    "Have you ever had a crush on someone much older or younger than you?",
    "What’s the most embarrassing thing you’ve done while drunk?",
    "Have you ever lied about your relationship status?",
    "What’s the most embarrassing thing you’ve done to get someone’s attention?"
  ];

  const Draxentruth = truth[Math.floor(Math.random() * truth.length)];
  buffertruth = await getBuffer(`https://i.ibb.co/gLNc5SGK/ce5871f200bb421678c982f5af52d7fd.jpg`);
  
  await socket.sendMessage(
      from,
      {
          image: buffertruth,
          caption: '_You choose TRUTH_\n' + Draxentruth,
          contextInfo: {
              forwardingScore: 5,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                  newsletterName: "Dullah",
                  newsletterJid: "120363402252728845@newsletter",
              },
          },
      },
      { quoted: m }
  );
  break;

  //====================================================[]



  //=======================================================[checkme]
  case 'checkme':
  case 'whoami':
  neme = args.join(" ");
  bet = `${sender}`;
  var sifat = ['Fine', 'Unfriendly', 'Chapri', 'Nibba/nibbi', 'Annoying', 'Dilapidated', 'Angry person', 'Polite', 'Burden', 'Great', 'Cringe', 'Liar'];
  var hoby = ['Cooking', 'Dancing', 'Playing', 'Gaming', 'Painting', 'Helping Others', 'Watching anime', 'Reading', 'Riding Bike', 'Singing', 'Chatting', 'Sharing Memes', 'Drawing', 'Eating Parents Money', 'Playing Truth or Dare', 'Staying Alone'];
  var bukcin = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  var arp = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  var cakep = ['Yes', 'No', 'Very Ugly', 'Very Handsome'];
  var wetak = ['Caring', 'Generous', 'Angry person', 'Sorry', 'Submissive', 'Fine', 'Im sorry', 'Kind Hearted', 'Patient', 'UwU', 'Top', 'Helpful'];
  var baikk = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  var bhuruk = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  var cerdhas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  var berhani = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  var mengheikan = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  var sipat = sifat[Math.floor(Math.random() * sifat.length)];
  var biho = hoby[Math.floor(Math.random() * hoby.length)];
  var bhucin = bukcin[Math.floor(Math.random() * bukcin.length)];
  var senga = arp[Math.floor(Math.random() * arp.length)];
  var chakep = cakep[Math.floor(Math.random() * cakep.length)];
  var watak = wetak[Math.floor(Math.random() * wetak.length)];
  var baik = baikk[Math.floor(Math.random() * baikk.length)];
  var burug = bhuruk[Math.floor(Math.random() * bhuruk.length)];
  var cerdas = cerdhas[Math.floor(Math.random() * cerdhas.length)];
  var berani = berhani[Math.floor(Math.random() * berhani.length)];
  var takut = mengheikan[Math.floor(Math.random() * mengheikan.length)];

  profile = `*≡══《 Check @${bet.split('@')[0]} 》══≡*

*Name :* ${pushname}
*Characteristic :* ${sipat}
*Hobby :* ${biho}
*Simp :* ${bhucin}%
*Great :* ${senga}%
*Handsome :* ${chakep}
*Character :* ${watak}
*Good Morals :* ${baik}%
*Bad Morals :* ${burug}%
*Intelligence :* ${cerdas}%
*Courage :* ${berani}%
*Afraid :* ${takut}%

*≡═══《 CHECK PROPERTIES 》═══≡*`;

try {
  ppuser = await socket.profilePictureUrl(m.sender, 'image');
} catch (err) {
  ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
}

ppDraxen = await getBuffer(ppuser);

await socket.sendMessage(
  from,
  {
      image: ppDraxen,
      caption: profile,
      mentions: [bet],
      contextInfo: {
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterName: "Dullah",
              newsletterJid: "120363402252728845@newsletter",
          },
      },
  },
  { quoted: m }
);
break;
//===================================================[]



//===========================================[handsome]
case 'handsomecheck':
case 'handsome': {
    const text = args.join(' ').trim();
  if (!textnae) return replyglobal(m, `just Tag Someone,\n Example : ${prefix + command} @Dullah`);
  const gan = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  const teng = gan[Math.floor(Math.random() * gan.length)];
  await socket.sendMessage(
      from,
      {
          text: `*${command}*\n\nName : ${q}\nAnswer : *${teng}%*`,
          contextInfo: {
              forwardingScore: 5,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                  newsletterName: "Dullah",
                  newsletterJid: "120363402252728845@newsletter",
              },
          },
      },
      { quoted: m }
  );
  break;
}
//==========================================================[]



//=============================================[beauty]

case 'beautifulcheck':
case 'beautiful':
case 'beauty':{
    const text = args.join(' ').trim();
  if (!textnae) return replyglobal(m, `just Tag Someone, Example : ${prefix + command} @Kaylah`);
  const can = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'];
  const tik = can[Math.floor(Math.random() * can.length)];
  await socket.sendMessage(
      from,
      {
          text: `*${command}*\n\nName : ${q}\nAnswer : *${tik}%*`,
          contextInfo: {
              forwardingScore: 5,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                  newsletterName: "Dullah",
                  newsletterJid: "120363402252728845@newsletter",
              },
          },
      },
      { quoted: m }
  );
  break;
}
//==========================================================[]



//================================================[character]
case 'charactercheck':
case 'character': {
    const character = args.join(' ').trim();
  if (!character) return replyglobal(m, `just Tag Someone, Example : ${prefix + command} @Dullah`);
  const Draxentech = ['Compassionate', 'Generous', 'Grumpy', 'Forgiving', 'Obedient', 'Good', 'Simp', 'Kind-Hearted', 'Patient', 'UwU', 'Top', 'Helpful'];
  const taky = Draxentech[Math.floor(Math.random() * Draxentech.length)];
  await socket.sendMessage(
      from,
      {
          text: `Character Check : ${character}\n\nAnswer : *${taky}*`,
          contextInfo: {
              forwardingScore: 5,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                  newsletterName: "Dullah",
                  newsletterJid: "120363402252728845@newsletter",
              },
          },
      },
      { quoted: m }
  );
  break;
}
//==============================================[]


//================================================[img]
case 'imgsearch':
case 'img': {
    const img = args.join(' ').trim();
    if (!img) {
        return replyglobal(m, `*Provide ammount of images you need*\nExample: ${prefix + command} 2 ferrari`);
    }

    const [num, ...queryParts] = text.split(" ");
    const query = queryParts.join(" ");

    const numImages = parseInt(num);
   

    try {
        await socket.sendMessage(m.chat, { react: { text: "🔎", key: m.key } });

        const apiResponse = await axios.get(`https://apis.davidcyriltech.my.id/googleimage`, {
            params: { query: query }
        });

        const { success, results } = apiResponse.data;

        if (!success || !results || results.length === 0) {
            return replyglobal(m, `❌ No images found for "${query}". Try another search.`);
        }

        const maxImages = Math.min(results.length, numImages);
        for (let i = 0; i < maxImages; i++) {
            await socket.sendMessage(
                m.chat,
                {
                    image: { url: results[i] },
                    caption: `📡 *Draxen Image Search*\n🔎 *Query:* "${query}"\n📠 *Result:* ${i + 1}/${maxImages}`,
                    contextInfo: {
                        forwardingScore: 5,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: "Dullah",
                            newsletterJid: "120363402252728845@newsletter",
                        },
                    },
                },
                { quoted: m }
            );
        }

        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error("Error in Image Search:", error);
        replyglobal(m, `❌ *Error fetching images. Try again later.*`);
    }
    break;
}

//===========================================================================[]

//===========================[sam]

case 'spam': {
     const text = args.join(' ').trim();
  if (!isOwner) return replyglobal(m, `You are not my owner`); 
  if (!textnae) return replyglobal(m, `Use ${prefix + command} text|amount`); 
  let Draxenarg = text.split("|"); 
  if (!Draxenarg[1]) return replyglobal(m, `Use ${prefix + command} text|amount`); 
  if (Number(Draxenarg[1]) >= 50) return replyglobal(m, 'Max 50!'); 
  if (isNaN(Draxenarg[1])) return replyglobal(m, `Amount must be a number`); 
  for (let i = 0; i < Draxenarg[1]; i++) {
      socket.sendMessage(from, { text: Draxenarg[0] });
  }
  break;
}

//=========================[]


//======================[question]

case 'question':
case 'ask': {
    if (!textnae) return replyglobal(m, 'What do u want to ask?'); 
    let simi = await fetchJson(`https://aemt.me/simi?text=${textnae}`);
    const simi2 = simi.result; 
    socket.sendMessage(m.chat, { text: simi2 }, { quoted: m }); 
    break;
}


//========================[]



//==================[pin]

case 'pinchat': {
    if (!isOwner) return replyglobal(m, `you are not my owner`); 
    if (m.isGroup) return replyglobal(m, `use this in my dm`); 
    socket.chatModify({ pin: true }, m.chat); 
    await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
    break;
}

case 'unpinchat': {
    if (!isOwner) return replyglobal(m, `You are not my owner`); 
    if (m.isGroup) return replyglobal(m, `use this in my dm`); 
    socket.chatModify({ pin: false }, m.chat); 
    await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
    break;
}


//=====================[]




//===================================[join request]

case 'getjoinrequest':
case 'join-request': 
case 'requets':   {
  if (!isGroup) return replyglobal(m, 'This command can only be used in groups!');
  if (!isAdmins && !isOwner) return replyglobal(m, 'You are not an admin!');

  const response = await socket.groupRequestParticipantsList(m.chat);
  if (!response || !response.length) {
      replyglobal(m, 'No pending join requests. ✅');
      return;
  }

  let replyMessage = `🤖 Join Request List:\n`;
  response.forEach((request, index) => {
      const { jid, request_method, request_time } = request;
      const formattedTime = new Date(parseInt(request_time) * 1000).toLocaleString();
      replyMessage += `\n*No.: ${index + 1} Request Details. 👇*`;
      replyMessage += `\n🧟‍♂️ *JID:* ${jid}`;
      replyMessage += `\n🧪 *Method:* ${request_method}`;
      replyMessage += `\n⏰ *Time:* ${formattedTime}\n`;
  });

  replyglobal(m, replyMessage);
  break;
}


//==========================================[]



//=========================[join]

  case 'join':
            case 'enter':
                try {
                    if (!isOwner) return replyglobal(m, "*Who Are You to command me huh??*")
                    if (!textnae) return replyglobal(m, '*Enter Group Link!*')
                    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return replyglobal(m, '*Link Invalid!*')
                    replyglobal(m, "*wait, I'm doing it..*")
                    let result = args[0].split('https://chat.whatsapp.com/')[1]
                    await socket.groupAcceptInvite(result).then((res) => replyglobal(m, json(res))).catch((err) => replyglobal(m, json(err)))
                } catch {
                    replyglobal(m, '*Failed to join the Group*')
                }
                break    

//===========================[]


//======================[setpp]

 case 'setpp':
            case 'setpp':
            case 'setppbot':
                if (!isOwner) return replyglobal(m, "*Seems like i don`t recognise you!*")
                if (!quoted) return replyglobal(m, `*Send/Reply Image With Caption ${userPrefix + command}*`)
                if (!/image/.test(mime)) return replyglobal(m, `*Send/Reply Image With Caption ${userPrefix + command}*`)
                if (/webp/.test(mime)) return replyglobal(m, `*Send/Reply Image With Caption ${userPrefix + command}*`)
                var medis = await socket.downloadAndSaveMediaMessage(quoted, 'ppbot.')
                if (args[0] == 'full') {
                    var {
                        img
                    } = await generateProfilePicture(medis)
                    await socket.query({
                        tag: 'iq',
                        attrs: {
                            to: sanitizedNumber,
                            type: 'set',
                            xmlns: 'w:profile:picture'
                        },
                        content: [{
                            tag: 'picture',
                            attrs: {
                                type: 'image'
                            },
                            content: img
                        }]
                    })
                    fs.unlinkSync(medis)
                    await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
                } else {
                    var memeg = await socket.updateProfilePicture(sanitizedNumber, {
                        url: medis
                    })
                    fs.unlinkSync(medis)
                    await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
                }
                break
         //=============================================[]       

//================[block]

  case 'block':
                if (!isOwner) return replyglobal(m, "*Who Are You to command me huh??*")
                let blockw = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await socket.updateBlockStatus(blockw, 'block').then((res) => replyglobal(m, json(res))).catch((err) => replyglobal(m, json(err)))
                break
 //=======================[]               

 //=================================[unblock]
            case 'unblock':
                if (!isOwner) return replyglobal(m, "*Who Are You to command me huh??*")
                let blockww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await socket.updateBlockStatus(blockww, 'unblock').then((res) => replyglobal(m, json(res))).catch((err) => replyglobal(m, json(err)))
                break
  //===============================[]
  
  //===========================[left]
            case 'left':
                if (!isOwner) return replyglobal(m, "*Who Are You to command me huh??*")
                if (!isGroup) return replyglobal(m, "Are you lost?🙄, this is for groups only🤠🏃")
                replyglobal(m, 'Bye Everyone 🥺')
                await socket.groupLeave(m.chat)
                break
//=============================[]



//=======================[broadcast gc]

 case 'bcgc':
            case 'bcgroup':
            case 'broadcastgroup': {
                if (!isOwner) return replyglobal(m, "*Who Are You to command me huh??*")
                if (!textnae) return replyglobal(m, `*Which text?*\n\nExample : ${prefix + command} It's holiday tomorrow `)
                let getGroups = await socket.groupFetchAllParticipating()
                let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
                let anu = groups.map(v => v.id)
                replyglobal(m, `*Sending Broadcast To ${anu.length} Group Chat, End Time ${anu.length * 2.5} second*`)
                for (let i of anu) {
                    await sleep(1500)
                    let a = '```' + `\n\n${text}\n` + '```' + '\nʙʀᴏᴀᴅᴄᴀsᴛ'
                    socket.sendMessage(i, {
                        text: a,
                          contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                thumbnailHeight: 500,
                thumbnailWidth: 500
                            }
                        }
                    })
                }
                replyglobal(m, `*Successfully Sent Broadcast To ${anu.length} Group/s*`)
            }
            break

//=======================--[]

//==========[add]
case 'add':
    if (!isGroup) return replyglobal(m, "*Are you lost?🙄, this is for groups only🤠🏃*");
    if (!isAdmins && !isOwner) return replyglobal(m, "*Only admins can use this😶*");

    let toAdd = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    await socket.groupParticipantsUpdate(m.chat, [toAdd], 'add')
        .then(() => replyglobal(m, `${toAdd} has been added to the group.`))
        .catch(err => replyglobal(m, `Failed to add participant`));
    break;
  
    //========================[]


    //=====================[hidetag]

     case 'hidetag':
            case 'ghosttag':
                const q = args.join(' ').trim();
                if (!isGroup) return replyglobal(m, "*Are you lost?🙄, this is for groups only🤠🏃*")
                if (!isAdmins && !isOwner) return replyglobal(m, "*Only admins can use this😶*")
                if (!isOwner) return replyglobal(m, "*I'm not an admin here🚫*")
                socket.sendMessage(m.chat, {
                    text: q ? q : '',
                    mentions: participants.map(a => a.id)
                }, {
                    quoted: m
                })
                break

       //=========================================[]         


//=========================[tag]

  case 'totag':
          case 'tag':
                if (!isGroup) return replyglobal(m, "*Are you lost?🙄, this is for groups only🤠🏃*")
                if (!isOwner && !isAdmins) return replyglobal(m, "*I'm not an admin here🚫*")
                if (!quoted) return replyglobal(m, `*Reply messages with captions ${userPrefix + command}*`)
                socket.sendMessage(m.chat, {
                    forward: m.quoted.fakeObj,
                    mentions: participants.map(a => a.id)
                })
                break


//-============================-[]




//============================[uptime trial]

case 'runtime':
case 'uptime': {
    


    let runtimetext = `\`DRAXEN-Ai\` \n*Has Been Running For ${runtime(process.uptime())}*\n> Enjoy Draxen Ultimate Speed💀`;


    // Send uptime message
    let msg = await socket.sendMessage(m.chat, {
        image: { url: thumbnailUrl },
        text: runtimetext,
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                thumbnailHeight: 500,
                thumbnailWidth: 500
            },
        }
    }, { quoted: m });

    try {
        await socket.sendMessage(m.chat, {
            audio: { url: singleAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah - Draxen-Ai",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });
    } catch (audioErr) { console.error('Uptime audio send failed (non-fatal):', audioErr.message); }

    break;
}


//===============================[]
  


//==============================[tomp4]

   case 'tomp4':
            case 'tovideo': {
                if (!/webp/.test(mime)) return replyglobal(m, `Reply sticker with caption *${prefix + command}*`)
                replyglobal(m, "wait, I'm doing it..")
                let media = await socket.downloadAndSaveMediaMessage(qmsg)
                let webpToMp4 = await webp2mp4File(media)
                await socket.sendMessage(m.chat, {
                    video: {
                        url: webpToMp4.result,
                        caption: 'Convert Webp To Video'
                    }
                }, {
                    quoted: m
                })
                await fs.unlinkSync(media)

            }
            break

//===================================[]



//=====================================[tomp3]

   case 'toaud':
    case 'tomp3':
            case 'toaudio': {
                if (!/video/.test(mime) && !/audio/.test(mime)) return replyglobal(m, `Send/Reply Video/Audio that you want to make into audio with caption ${prefix + command}`)
                replyglobal(m, "wait, I'm doing it..")
                let media = await socket.downloadMediaMessage(qmsg)
                let audio = await toAudio(media, 'mp4')
                socket.sendMessage(m.chat, {
                    audio: audio,
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: m
                })

            }
            break

//=====================================[]


//=====================================[save status]
//====================================[SAVE STATUS - RAW VERSION]=========================//
case 'savestatus':
case 'download':
case 'send':
case 'please/send':
case 'save':
case 'fetch': {
    try {
        if (!quoted) return replyglobal(m, `📎 Please *reply* to a status (image, video, or audio) to save it.`);


        // 🔹 Download media as Buffer (no conversion)
        const buffer = await quoted.download();
        const caption = quoted.caption || quoted.text || '';

        // 🔹 Prepare message
        const msgOptions = {
            contextInfo: {
                forwardingScore: 10,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah",
                    newsletterJid: "120363402252728845@newsletter",
                },
            },
        };

        // 🔹 Send back raw content
        if (/image/.test(mime)) {
            msgOptions.image = buffer;
            msgOptions.caption = `🪩 *DRAXEN-Ai STATUS SAVER* 💫\n\n📸 Image saved in full quality.\n__________________________\n${caption}`;
        } else if (/video/.test(mime)) {
            msgOptions.video = buffer;
            msgOptions.caption = `🪩 *DRAXEN-Ai STATUS SAVER* 💫\n\n🎞️ Video saved in full quality.\n__________________________\n${caption}`;
        } else if (/audio/.test(mime)) {
            msgOptions.audio = buffer;
            msgOptions.mimetype = 'audio/mp4';
        } else {
            return replyglobal(m, `⚠️ Unsupported media type. Please reply to an image, video, or audio.`);
        }

        // 🔹 Send back to chat
        await socket.sendMessage(m.chat, msgOptions, { quoted: m });
        console.log(`✅ Status from ${m.sender} saved successfully.`);
    } catch (error) {
        console.error("❌ Error saving status:", error);
        replyglobal(m, `❌ Error saving status: ${error.message}`);
    }
}
break;


//=======================================[]


//=======================================[say/tts]

case 'say':
case 'tts':
case 'gtts': {
    const googleTTS = require('google-tts-api'); // ✅ Required for TTS

    let cleanedText = args.join(' ').trim();

    // Fallback to quoted message if no text was provided
    if (!cleanedText && quoted?.text) {
        cleanedText = quoted.text.trim();
    }

    if (!cleanedText) {
        return replyglobal(m, '❌ Please provide the text or reply to a message.');
    }

    try {
        // Generate the TTS audio URL
        const ttsUrl = googleTTS.getAudioUrl(cleanedText, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });

        await socket.sendMessage(m.chat, {
            audio: { url: ttsUrl },
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Dullah",
                    newsletterJid: "120363402252728845@newsletter",
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error("TTS Error:", error);
        replyglobal(m, "❌ Failed to generate speech. Please try again.");
    }
}
break;


//=====================================[]

//===============================[bible]


 case 'bible': {
    (async () => {
        const fetch = require('node-fetch');
        const { translate } = require('@vitalets/google-translate-api');
        const BASE_URL = 'https://bible-api.com';
    
        try {
            let chapterInput = text.split(' ').slice(1).join(' ').trim();
            if (!chapterInput) {
                return replyglobal(m, `Please specify the chapter number or name.\n Example: ${prefix + command} John 3:16 for single verse or\n${prefix + command} joseph 1:1-10 for multiple verses`);
            }
    
            let encodedInput = encodeURIComponent(chapterInput);
            let chapterRes = await fetch(`${BASE_URL}/${encodedInput}`);
    
            if (!chapterRes.ok) {
                throw new Error(`Couldn't find the requested Bible verse. Please use a format like:\n ${prefix + command} John 3:16 or \n joseph 3:1-10`);
            }
    
            let chapterData = await chapterRes.json();
            if (!chapterData.text) {
                throw new Error(`No text found for ${chapterInput}. Please try a different chapter.`);
            }

            let translatedChapterSwahili = 'Swahili translation unavailable';
            
            try {
                const result = await translate(chapterData.text, { to: 'sw' });
                translatedChapterSwahili = result.text;
            } catch (translateError) {
                console.log('Translation error:', translateError.message);
                translatedChapterSwahili = chapterData.text; // Fallback to English
            }

            // Format text to avoid message limits
            let displayText = chapterData.text;
            if (displayText.length > 1000) {
                displayText = displayText.substring(0, 1000) + '...';
                translatedChapterSwahili = translatedChapterSwahili.substring(0, 1000) + '...';
            }

            let bibleChapter = `📖 *THE HOLY BIBLE*\n\n` +
                              `📜 *Reference:* ${chapterData.reference}\n` +
                              `📚 *Version:* ${chapterData.translation_name}\n` +
                              `📖 *Verses:* ${chapterData.verses.length}\n` +
                              `🇺🇸 *English:*\n${displayText}\n` +
                              `🇹🇿 *Swahili:*\n${translatedChapterSwahili}\n` +
                              `> DRAXEN-Ai`;
    
            replyglobal(m, bibleChapter);
    
        } catch (error) {
            replyglobal(m, `Error: ${error.message}`);
        }
    })();
}
break;


//===============================[]



//==============================[trt]

 case "trt":
case "translate": {
    if (!textnae && !m.quoted?.text) return replyglobal(m, `❌ Please provide text or reply to a message to translate!\n\n*Usage Examples:*\n• ${prefix + command} en Hello world\n• ${prefix + command} sw How are you?\n• Reply to a message with: ${prefix + command} fr`);
    
    try {
        // Language code mapping for better user experience
        const languageMap = {
            'english': 'en', 'en': 'en', 'eng': 'en',
            'swahili': 'sw', 'sw': 'sw', 'kiswahili': 'sw',
            'french': 'fr', 'fr': 'fr', 'français': 'fr',
            'spanish': 'es', 'es': 'es', 'español': 'es',
            'german': 'de', 'de': 'de', 'deutsch': 'de',
            'italian': 'it', 'it': 'it', 'italiano': 'it',
            'portuguese': 'pt', 'pt': 'pt', 'português': 'pt',
            'russian': 'ru', 'ru': 'ru', 'русский': 'ru',
            'arabic': 'ar', 'ar': 'ar', 'العربية': 'ar',
            'hindi': 'hi', 'hi': 'hi', 'हिन्दी': 'hi',
            'chinese': 'zh', 'zh': 'zh', '中文': 'zh',
            'japanese': 'ja', 'ja': 'ja', '日本語': 'ja',
            'korean': 'ko', 'ko': 'ko', '한국어': 'ko',
            'turkish': 'tr', 'tr': 'tr', 'türkçe': 'tr',
            'dutch': 'nl', 'nl': 'nl', 'nederlands': 'nl',
            'greek': 'el', 'el': 'el', 'ελληνικά': 'el',
            'hebrew': 'he', 'he': 'he', 'עברית': 'he',
            'thai': 'th', 'th': 'th', 'ไทย': 'th',
            'vietnamese': 'vi', 'vi': 'vi', 'tiếng việt': 'vi',
            'indonesian': 'id', 'id': 'id', 'bahasa indonesia': 'id'
        };

        let [langInput, ...textToTranslate] = textnae.split(' ');
        let content = m.quoted?.text || textToTranslate.join(' ');

        // If no language specified and no quoted message, show help
        if (!langInput && !m.quoted) {
            return replyglobal(m, `🌐 *TRANSLATION HELP*\n\n*Usage:*\n• ${prefix + command} [language] [text]\n• Reply to a message with: ${prefix + command} [language]\n\n*Examples:*\n• ${prefix + command} en Hola mundo\n• ${prefix + command} sw Hello world\n• ${prefix + command} fr How are you?\n\n*Supported Languages:* en, es, fr, de, it, pt, ru, ar, hi, zh, ja, ko, sw, etc.`);
        }

        // Handle reply case - language might be the only text provided
        if (m.quoted && !langInput) {
            langInput = 'en'; // Default to English if no language specified in reply
        } else if (m.quoted) {
            // If replying and language is provided, use the quoted text
            content = m.quoted.text;
        }

        // Normalize language code
        const targetLang = languageMap[langInput.toLowerCase()] || langInput.toLowerCase();

        // Validate language code (basic check)
        if (!targetLang || targetLang.length !== 2) {
            return replyglobal(m, `❌ Invalid language code: ${langInput}\n\n*Supported codes:* en, es, fr, de, it, pt, ru, ar, hi, zh, ja, ko, sw, tr, nl, el, he, th, vi, id\n\n*Usage:* ${prefix + command} [language] [text]`);
        }

        if (!content.trim()) {
            return replyglobal(m, `❌ No text found to translate!\n\n*Usage:* ${prefix + command} [language] [text]`);
        }

        // Using LibreTranslate API (free and reliable)
        const translateText = async (text, targetLang) => {
            try {
                const response = await fetch('https://libretranslate.com/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        q: text,
                        source: 'auto', // Auto-detect source language
                        target: targetLang,
                        format: 'text'
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        translatedText: data.translatedText,
                        detectedLanguage: data.detectedLanguage?.language || 'auto'
                    };
                } else {
                    throw new Error(`API returned ${response.status}`);
                }
            } catch (error) {
                console.log('Translation API error:', error.message);
                
                // Fallback to MyMemory API
                try {
                    const fallbackResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
                    if (fallbackResponse.ok) {
                        const data = await fallbackResponse.json();
                        if (data.responseStatus === 200) {
                            return {
                                translatedText: data.responseData.translatedText,
                                detectedLanguage: 'auto'
                            };
                        }
                    }
                } catch (fallbackError) {
                    console.log('Fallback translation failed:', fallbackError.message);
                }
                
                throw new Error('All translation services failed');
            }
        };

        // Get language name for display
        const languageNames = {
            'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ar': 'Arabic',
            'hi': 'Hindi', 'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean',
            'sw': 'Swahili', 'tr': 'Turkish', 'nl': 'Dutch', 'el': 'Greek',
            'he': 'Hebrew', 'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian'
        };

        const result = await translateText(content, targetLang);
        const languageName = languageNames[targetLang] || targetLang.toUpperCase();

        // Format the response
        const translationMessage = `🌐 *TRANSLATION SUCCESS*\n\n` +
                                 `📥 *Original Text:*\n${content}\n\n` +
                                 `📤 *Translated Text (${languageName}):*\n${result.translatedText}\n\n` +
                                 `🔤 *Target Language:* ${targetLang.toUpperCase()}\n` +
                                 (result.detectedLanguage && result.detectedLanguage !== 'auto' ? 
                                 `🎯 *Detected Language:* ${result.detectedLanguage.toUpperCase()}\n` : '');

        await socket.sendMessage(
            m.chat,
            {
                text: translationMessage,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah",
                        newsletterJid: "120363402252728845@newsletter"
                    },
                    externalAdReply: {
                        showAdAttribution: true,
                        title: "DRAXEN-Ai TRANSLATE",
                        body: `Translated to ${languageName}`,
                        thumbnailUrl: thumbnailUrl,
                        sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                        mediaType: 1
                    }
                }
            },
            { quoted: m }
        );

    } catch (error) {
        console.error('Translation error:', error);
        replyglobal(m, `❌ Translation failed!\n\n*Error:* ${error.message}\n\nPlease try again with a different language or shorter text.`);
    }
}
break;




//=======================[inside translate]

// Add this command for setting user language preference
case "setlang": {
    const [langInput] = textnae.split(' ');
    if (!langInput) {
        const currentLang = getUserLang(m.sender);
        return replyglobal(m, `🌐 *Your Current Language:* ${currentLang.toUpperCase()}\n\n*Usage:* ${prefix}setlang [language]\n*Example:* ${prefix}setlang es\n\n*Supported:* en, es, fr, de, it, pt, ru, ar, hi, zh, ja, ko, sw, etc.`);
    }
    
    const languageMap = { /* same as above */ };
    const targetLang = languageMap[langInput.toLowerCase()] || langInput.toLowerCase();
    
    if (targetLang.length !== 2) {
        return replyglobal(m, `❌ Invalid language code: ${langInput}\n\nUse codes like: en, es, fr, de, it, pt, ru, ar, hi, zh, ja, ko, sw`);
    }
    
    if (setUserLang(m.sender, targetLang)) {
        replyglobal(m, `✅ *Language preference updated!*\n\nYour default translation language is now: *${targetLang.toUpperCase()}*`);
    } else {
        replyglobal(m, `❌ Failed to save language preference.`);
    }
    break;
}

//================================[]


//===============================['tagall]

 case 'tagadmins': 
   case 'tagadmin': 
   case 'listadmin': 
   case 'admins': {
       if (!isGroup) return replyglobal(m, `❌ This command can only be used in groups.`);
   
       const groupAdmins = participants.filter(p => p.admin);
       if (groupAdmins.length === 0) return replyglobal(m, "🚫 No admins found in this group.");
   
       const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
       const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
   
       let messageText = `   
   📌 *Group Admins:*  
   ${listAdmin}
   `.trim();
   
       await socket.sendMessage(
           m.chat,
           {
               text: messageText,
               mentions: [...groupAdmins.map(v => v.id), owner],
                   contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah - Draxen-Ai",
                newsletterJid: "120363402252728845@newsletter",
            },
            externalAdReply: {
                title: "DRAXEN-Ai",
                body: "Dullah",
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                mediaType: 1,
                //renderLargerThumbnail: true,
                thumbnailHeight: 500,
                thumbnailWidth: 500
                   },
               },
           },
           { quoted: m }
       );
   }
   break;

//=====================================[]

//=================================[approve all]


case 'approveall': 
case 'approve': 
case 'approve-requests':
 case 'approverequests':    {
    if (!isGroup) return replyglobal(m, 'This command can only be used in groups!');
    if (!isOwner) return replyglobal(m, 'Only group admins can use this command!');
    const response = await socket.groupRequestParticipantsList(m.chat);
    if (!response || !response.length) {
        return replyglobal(m, 'No pending join requests to approve. ✅');
    }
    for (let request of response) {
        await socket.groupRequestParticipantsUpdate(m.chat, [request.jid], 'approve');
        await sleep(1500); 
    }

    replyglobal(m, `✅ Approved all ${response.length} pending join requests successfully.`);
}
break;

//==========================================[]


//==============================[sticker search]

 case 'stickersearch':
    case 'stsearch': {
    if (!textnae) return replyglobal(m, `Example : ${prefix + command} tommy shelby`);
    let js = await fetch(`https://dikaardnt.com/api/search/sticker?q=${textnae}`);
    let json = await js.json();
    if (!json || !json.length) return replyglobal(m, 'No results found!');
    replyglobal(m, `
❗ Note : Bot Will Give Random Results. If the results do not match what you want, please type again ${prefix + command} ${text}

💼 Title : ${json[0].title}
🔗 Link : ${json[0].url}
⭐ Total : ${json[0].total}
`);
    break;
}

//=====================================[]

//========================[readmore]

case 'readmore': {
  let [l, r] = textnae.split`|`;
  if (!l) l = '';
  if (!r) r = '';
  socket.sendMessage(m.chat, { text: l + readmore + r }, { quoted: m });
  break;
}

//===============================[]



//====================================[vcf]

case 'vcf': {
    if (!isGroup) return replyglobal(m, "❌ This command only works in groups!");

    const groupMetadata = await socket.groupMetadata(m.chat);
    const participants = groupMetadata.participants;
    const groupName = groupMetadata.subject;
    const memberCount = participants.length;

    if (!participants.length) return replyglobal(m, "❌ No members found in this group.");

    await replyglobal(m, `📌 Saving ${memberCount} contacts for group *${groupName}*...\n\nPlease wait...`);

    let vcfContent = "";

    for (let participant of participants) {
        const number = participant.id.split('@')[0];
        const pushname = (await socket.getName(participant.id)) || number; 

        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${pushname}\nTEL;TYPE=CELL:+${number}\nEND:VCARD\n\n`;
    }
    const vcfFilePath = './group_contacts.vcf';
    fs.writeFileSync(vcfFilePath, vcfContent);
    const vcfBuffer = fs.readFileSync(vcfFilePath);
    const captionText = `📂 *${groupName}* \n\n Saved ${memberCount} contacts with names\n\n> DRAXEN-Ai`;
    await socket.sendMessage(m.chat, {
        document: vcfBuffer,
        mimetype: 'text/vcard',
        fileName: `${groupName} Contacts.vcf`,
        caption: captionText,
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "Dullah",
                newsletterJid: "120363402252728845@newsletter",
            }
        }
    }, { quoted: m });

    break;
}

//=====================================[]



//==========================================[sticker commands]



case 'shinobu':
case 'stickshinobu': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/shinobu`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Shinobu sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch shinobu sticker.");
    }
    break;
}

case 'stickhandhold': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/handhold`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Handhold sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch handhold sticker.");
    }
    break;
}

case 'stickhighfive': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/highfive`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Highfive sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch highfive sticker.");
    }
    break;
}

case 'stickcuddle': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/cuddle`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Cuddle sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch cuddle sticker.");
    }
    break;
}

case 'stickcringe': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/cringe`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Cringe sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch cringe sticker.");
    }
    break;
}

case 'stickdance': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/dance`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Dance sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch dance sticker.");
    }
    break;
}

case 'stickhappy': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/happy`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Happy sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch happy sticker.");
    }
    break;
}

case 'stickglomp': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/glomp`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Glomp sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch glomp sticker.");
    }
    break;
}

case 'sticksmug': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/smug`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Smug sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch smug sticker.");
    }
    break;
}

case 'stickblush': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/blush`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Blush sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch blush sticker.");
    }
    break;
}

case 'stickawoo': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/awoo`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Awoo sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch awoo sticker.");
    }
    break;
}

case 'stickwave': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/wave`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Wave sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch wave sticker.");
    }
    break;
}

case 'sticksmile': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/smile`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Smile sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch smile sticker.");
    }
    break;
}

case 'stickslap': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/slap`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Slap sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch slap sticker.");
    }
    break;
}

case 'sticknom': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/nom`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Nom sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch nom sticker.");
    }
    break;
}

case 'stickpoke': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/poke`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Poke sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch poke sticker.");
    }
    break;
}

case 'stickwink': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/wink`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Wink sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch wink sticker.");
    }
    break;
}

case 'stickbonk': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/bonk`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Bonk sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch bonk sticker.");
    }
    break;
}

case 'stickbully': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/bully`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Bully sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch bully sticker.");
    }
    break;
}

case 'stickyeet': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/yeet`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Yeet sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch yeet sticker.");
    }
    break;
}

case 'stickbite': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/bite`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Bite sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch bite sticker.");
    }
    break;
}

case 'stickkiss': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/kiss`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Kiss sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch kiss sticker.");
    }
    break;
}

case 'sticklick': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/lick`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Lick sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch lick sticker.");
    }
    break;
}

case 'stickpat': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/pat`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Pat sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch pat sticker.");
    }
    break;
}

case 'stickhug': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/hug`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Hug sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch hug sticker.");
    }
    break;
}

case 'stickkill': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/kill`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Kill sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch kill sticker.");
    }
    break;
}

case 'stickcry': {
    try {
        const { data } = await axios.get(`https://api.waifu.pics/sfw/cry`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Cry sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch cry sticker.");
    }
    break;
}

case 'stickspank': {
    try {
        const { data } = await axios.get(`https://nekos.life/api/v2/img/spank`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Spank sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch spank sticker.");
    }
    break;
}

case 'sticktickle': {
    try {
        const { data } = await axios.get(`https://nekos.life/api/v2/img/tickle`);
        await createStickerFromUrl(data.url, 'DRAXEN-Ai', 'Draxen', m);
    } catch (error) {
        console.error("Tickle sticker error:", error);
        await replyglobal(m, "❌ Failed to fetch tickle sticker.");
    }
    break;
}



//=================================================[]




//=====================================[amime]


case 'animemegumin': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/megumin`);
        await replyglobal(m, "✨ Megumin Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Megumin error:", error);
        await replyglobal(m, "❌ Failed to fetch megumin image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animeshinobu': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/shinobu`);
        await replyglobal(m, "✨ Shinobu Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Shinobu error:", error);
        await replyglobal(m, "❌ Failed to fetch shinobu image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animehandhold': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/handhold`);
        await replyglobal(m, "✨ Handhold Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Handhold error:", error);
        await replyglobal(m, "❌ Failed to fetch handhold image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animehighfive': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/highfive`);
        await replyglobal(m, "✨ Highfive Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Highfive error:", error);
        await replyglobal(m, "❌ Failed to fetch highfive image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animecringe': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/cringe`);
        await replyglobal(m, "✨ Cringe Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Cringe error:", error);
        await replyglobal(m, "❌ Failed to fetch cringe image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animedance': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/dance`);
        await replyglobal(m, "✨ Dance Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Dance error:", error);
        await replyglobal(m, "❌ Failed to fetch dance image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animehappy': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/happy`);
        await replyglobal(m, "✨ Happy Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Happy error:", error);
        await replyglobal(m, "❌ Failed to fetch happy image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animeglomp': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/glomp`);
        await replyglobal(m, "✨ Glomp Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Glomp error:", error);
        await replyglobal(m, "❌ Failed to fetch glomp image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animesmug': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/smug`);
        await replyglobal(m, "✨ Smug Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Smug error:", error);
        await replyglobal(m, "❌ Failed to fetch smug image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animeblush': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/blush`);
        await replyglobal(m, "✨ Blush Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Blush error:", error);
        await replyglobal(m, "❌ Failed to fetch blush image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animewave': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/wave`);
        await replyglobal(m, "✨ Wave Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Wave error:", error);
        await replyglobal(m, "❌ Failed to fetch wave image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animesmile': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/smile`);
        await replyglobal(m, "✨ Smile Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Smile error:", error);
        await replyglobal(m, "❌ Failed to fetch smile image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animepoke': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/poke`);
        await replyglobal(m, "✨ Poke Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Poke error:", error);
        await replyglobal(m, "❌ Failed to fetch poke image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animewink': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/wink`);
        await replyglobal(m, "✨ Wink Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Wink error:", error);
        await replyglobal(m, "❌ Failed to fetch wink image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animebonk': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/bonk`);
        await replyglobal(m, "✨ Bonk Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Bonk error:", error);
        await replyglobal(m, "❌ Failed to fetch bonk image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animebully': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/bully`);
        await replyglobal(m, "✨ Bully Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Bully error:", error);
        await replyglobal(m, "❌ Failed to fetch bully image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animeyeet': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/yeet`);
        await replyglobal(m, "✨ Yeet Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Yeet error:", error);
        await replyglobal(m, "❌ Failed to fetch yeet image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animebite': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/bite`);
        await replyglobal(m, "✨ Bite Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Bite error:", error);
        await replyglobal(m, "❌ Failed to fetch bite image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animelick': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/lick`);
        await replyglobal(m, "✨ Lick Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Lick error:", error);
        await replyglobal(m, "❌ Failed to fetch lick image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animekill': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/kill`);
        await replyglobal(m, "✨ Kill Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Kill error:", error);
        await replyglobal(m, "❌ Failed to fetch kill image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animecry': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/cry`);
        await replyglobal(m, "✨ Cry Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Cry error:", error);
        await replyglobal(m, "❌ Failed to fetch cry image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animewlp': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/wallpaper`);
        await replyglobal(m, "✨ Anime Wallpaper", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Wallpaper error:", error);
        await replyglobal(m, "❌ Failed to fetch wallpaper.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animekiss': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/kiss`);
        await replyglobal(m, "✨ Kiss Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Kiss error:", error);
        await replyglobal(m, "❌ Failed to fetch kiss image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animehug': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/hug`);
        await replyglobal(m, "✨ Hug Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Hug error:", error);
        await replyglobal(m, "❌ Failed to fetch hug image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animeneko': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://waifu.pics/api/sfw/neko`);
        await replyglobal(m, "✨ Neko Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Neko error:", error);
        await replyglobal(m, "❌ Failed to fetch neko image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animepat': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/pat`);
        await replyglobal(m, "✨ Pat Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Pat error:", error);
        await replyglobal(m, "❌ Failed to fetch pat image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animeslap': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/slap`);
        await replyglobal(m, "✨ Slap Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Slap error:", error);
        await replyglobal(m, "❌ Failed to fetch slap image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animecuddle': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/cuddle`);
        await replyglobal(m, "✨ Cuddle Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Cuddle error:", error);
        await replyglobal(m, "❌ Failed to fetch cuddle image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animewaifu': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/waifu`);
        await replyglobal(m, "✨ Waifu Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Waifu error:", error);
        await replyglobal(m, "❌ Failed to fetch waifu image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animenom': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/nom`);
        await replyglobal(m, "✨ Nom Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Nom error:", error);
        await replyglobal(m, "❌ Failed to fetch nom image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animefoxgirl': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/fox_girl`);
        await replyglobal(m, "✨ Fox Girl Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Fox girl error:", error);
        await replyglobal(m, "❌ Failed to fetch fox girl image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animetickle': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/tickle`);
        await replyglobal(m, "✨ Tickle Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Tickle error:", error);
        await replyglobal(m, "❌ Failed to fetch tickle image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animegecg': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/gecg`);
        await replyglobal(m, "✨ GECG Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("GECG error:", error);
        await replyglobal(m, "❌ Failed to fetch gecg image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'dogwoof': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/woof`);
        await replyglobal(m, "✨ Dog Woof Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Dog woof error:", error);
        await replyglobal(m, "❌ Failed to fetch dog image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case '8ballpool': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/8ball`);
        await replyglobal(m, "✨ 8 Ball Pool Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("8 Ball error:", error);
        await replyglobal(m, "❌ Failed to fetch 8 ball image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'goosebird': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/goose`);
        await replyglobal(m, "✨ Goose Bird Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Goose error:", error);
        await replyglobal(m, "❌ Failed to fetch goose image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animefeed': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/feed`);
        await replyglobal(m, "✨ Feed Anime Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Feed error:", error);
        await replyglobal(m, "❌ Failed to fetch feed image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'animeavatar': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/avatar`);
        await replyglobal(m, "✨ Anime Avatar", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Avatar error:", error);
        await replyglobal(m, "❌ Failed to fetch avatar image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'lizardpic': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/lizard`);
        await replyglobal(m, "✨ Lizard Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Lizard error:", error);
        await replyglobal(m, "❌ Failed to fetch lizard image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}

case 'catmeow': {
    try {
        await socket.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/meow`);
        await replyglobal(m, "✨ Cat Meow Image", { image: waifudd.data.url });
        await socket.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
        console.error("Cat meow error:", error);
        await replyglobal(m, "❌ Failed to fetch cat image.");
        await socket.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    break;
}




//===========================================[]


//=======================================[settings and set]


// Add this to your command handler
case 'settings':
case 'mysettings': {
    try {
        const userSettings = getUserSettings(sanitizedNumber);
        
        const settingsText = `
━━━━━━━━━━━━━━━━━━━━
┃  ⚙️ *USER SETTINGS*  
━━━━━━━━━━━━━━━━━━━━

🤖 *Bot Settings:*
> 🔧 Prefix: ${userSettings.prefix}
> 🌐 Language: ${userSettings.language}
> 👥 Bot Mode: ${userSettings.botmode}

🔔 *Auto Features:*
> ${userSettings.autoreact ? '✅' : '❌'} Auto React
> ${userSettings.autostatusview ? '✅' : '❌'} Auto Status View
> ${userSettings.autostatusreact ? '✅' : '❌'} Auto Status React
> ${userSettings.autotype ? '✅' : '❌'} Auto Typing
> ${userSettings.autorecording ? '✅' : '❌'} Auto Recording
> ${userSettings.autobio ? '✅' : '❌'} Auto Bio

🛡️ *Security:*
> ${userSettings.antilink ? '✅' : '❌'} Anti Link
> ${userSettings.badwords ? '✅' : '❌'} Bad Words Filter
> ${userSettings.autodelete ? '✅' : '❌'} Anti Delete

────────────────────
Use *${userPrefix}set <setting> <value>* to change settings
Example: *${userPrefix}set autoreact true*
`;

        await replyglobal(m, settingsText, { 
            image: "https://files.catbox.moe/tmmvub.jpg" 
        });

    } catch (error) {
        console.error('Settings command error:', error);
        await replyglobal(m, '❌ Failed to load settings.');
    }
    break;
}

case 'set': {
    const [setting, value] = args;
    if (!setting || value === undefined) {
        return replyglobal(m, `*Usage:* ${userPrefix}set <setting> <value>\n\n*Available settings:* autoreact, autostatusview, autostatusreact, autotype, prefix, botmode, etc.\n*Example:* ${userPrefix}set autoreact true`);
    }

    try {
        const userSettings = getUserSettings(sanitizedNumber);
        const validSettings = ['autoreact', 'autostatusview', 'autostatusreact', 'autotype', 'autodelete', 'antilink', 'badwords', 'prefix', 'language', 'botmode', 'autorecording', 'autobio'];
        
        if (!validSettings.includes(setting.toLowerCase())) {
            return replyglobal(m, `❌ Invalid setting. Available: ${validSettings.join(', ')}`);
        }

        // Convert string values to proper types
        let processedValue = value;
        if (value.toLowerCase() === 'true') processedValue = true;
        else if (value.toLowerCase() === 'false') processedValue = false;
        else if (setting === 'prefix') processedValue = value.charAt(0); // Take only first character as prefix
        else if (setting === 'botmode') {
            if (!['public', 'self', 'group'].includes(value.toLowerCase())) {
                return replyglobal(m, '❌ Bot mode must be: public, self, or group');
            }
            processedValue = value.toLowerCase();
        }

        userSettings[setting] = processedValue;
        
        // Save to user settings and apply to individual files
        saveUserSettings(sanitizedNumber, userSettings);
        applyUserSettingsToFiles(sanitizedNumber, userSettings);

        // Auto-upload updated settings to server
        setTimeout(async () => {
            try {
                await uploadSessionToServer(sanitizedNumber);
                console.log(`✅ Auto-uploaded settings for ${sanitizedNumber}`);
            } catch (uploadError) {
                console.error('Failed to auto-upload settings:', uploadError);
            }
        }, 1000);

        await replyglobal(m, `✅ Setting updated!\n*${setting}* set to: *${processedValue}*`);

    } catch (error) {
        console.error('Set command error:', error);
        await replyglobal(m, '❌ Failed to update setting.');
    }
    break;
}

//==========================================[]



//=================================[new commands from nothinglikev2 ends]====================================\\
                           
             

                        
                   }
               } 
               
               
               catch (error) {
                   console.error('Command handler error:', error);
                   await socket.sendMessage(sender, {
           caption: '❌ *ERROR*\n\nAn error occurred while processing your command. Please try again.\n\n> DRAXEN-Ai',
           contextInfo: {
               forwardingScore: 5,
               isForwarded: true,
               forwardedNewsletterMessageInfo: {
                   newsletterName: "Dullah - Draxen-Ai",
                   newsletterJid: "120363402252728845@newsletter",
               },
               externalAdReply: {
                   title: "DRAXEN-Ai",
                   body: "Dullah",
                   thumbnailUrl: config.RCD_IMAGE_PATH,
                   sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                   //====[removed]===\
                   renderLargerThumbnail: false,
                   thumbnailHeight: 500,
                   thumbnailWidth: 500
               }
           }
       });
               }
           });
       }
                    
// more future commands             


function resetCorruptedJSON(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content); // Try to parse
    } catch (error) {
        console.log(`Resetting corrupted file: ${filePath}`);
        writeJSON(filePath, {});
    }
}

// Call this function for each JSON file at startup
resetCorruptedJSON(ANTILINK_PATH);
resetCorruptedJSON(AUTOTYPING_PATH);
resetCorruptedJSON(BADWORDS_PATH);

                 
       

function setupMessageHandlers(socket, userNumber) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid === config.NEWSLETTER_JID) return;

        // Read user-specific autorecording setting
        const autorecordingData = readJSON(AUTORECORDING_PATH);
        const isAutoRecordingEnabled = autorecordingData[userNumber];

        if (isAutoRecordingEnabled) {
            try {
                await socket.sendPresenceUpdate('recording', msg.key.remoteJid);
                console.log(`Set recording presence for ${msg.key.remoteJid} by user: ${userNumber}`);
            } catch (error) {
                console.error(`Failed to set recording presence for user ${userNumber}:`, error);
            }
        }
    });
}

// Remove all octokit and GitHub logic, use only local file system



async function restoreSession(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const sessionDir = path.join(SESSION_BASE_PATH);
        const credsFile = path.join(sessionDir, `creds_${sanitizedNumber}.json`);
        if (!fs.existsSync(credsFile)) return null;
        const content = fs.readFileSync(credsFile, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Session restore failed:', error);
        return null;
    }
}

async function loadUserConfig(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const configFile = path.join(SESSION_BASE_PATH, `config_${sanitizedNumber}.json`);
        if (!fs.existsSync(configFile)) {
            console.warn(`No configuration found for ${number}, using default config`);
            return { ...config };
        }
        const content = fs.readFileSync(configFile, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.warn(`No configuration found for ${number}, using default config`);
        return { ...config };
    }
}

async function updateUserConfig(number, newConfig) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const configFile = path.join(SESSION_BASE_PATH, `config_${sanitizedNumber}.json`);
        fs.writeFileSync(configFile, JSON.stringify(newConfig, null, 2));
        console.log(`Updated config for ${sanitizedNumber}`);
    } catch (error) {
        console.error('Failed to update config:', error);
        throw error;
    }
}

function setupAutoRestart(socket, number) {
    // Always Online Feature - Set online status when connection is open
    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        // Set online status when connection is established
        if (connection === 'open') {
            try {
                // Set online status immediately
                await socket.sendPresenceUpdate('available');
                
                // Refresh online status every 25 seconds to maintain "always online"
                socket.onlineInterval = setInterval(async () => {
                    try {
                        await socket.sendPresenceUpdate('available');
                    } catch (error) {
                        console.error('Error refreshing online status:', error);
                    }
                }, 25000); // Refresh every 25 seconds
            } catch (error) {
                console.error('Error setting online status:', error);
            }
        }
        
        if (connection === 'close') {
            // Clear the online status interval
            if (socket.onlineInterval) {
                clearInterval(socket.onlineInterval);
            }
            
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode === 401) { // User logged out from WhatsApp
                const sanitizedNumber = number.replace(/[^0-9]/g, '');
                console.log(`[Hans] User ${sanitizedNumber} logged out — auto-deleting session folder`);

                // Auto-delete session folder from ./Sessions
                try {
                    const sessionPath = require('path').join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);
                    if (fs.existsSync(sessionPath)) {
                        fs.removeSync(sessionPath);
                        console.log(`[Draxen] ✅ Session folder deleted: ./Sessions/session_${sanitizedNumber}`);
                    }
                } catch (delErr) {
                    console.error(`[Draxen] Failed to delete session folder for ${sanitizedNumber}:`, delErr.message);
                }

                // Remove from active sockets
                activeSockets.delete(sanitizedNumber);
                socketCreationTime.delete(sanitizedNumber);

                // Notify user
                try {
                    // Check if socket connection is open before sending message
                    if (socket?.ws && socket.ws.readyState === 1) { // 1 = OPEN
                        await socket.sendMessage(jidNormalizedUser(socket.user.id), {
                            image: { url: getRandomImage() },
                            caption: formatMessage(
                                '🗑️ SESSION DELETED',
                                '✅ Your session has been deleted due to logout.',
                                'Draxen-ai'
                            )
                        });
                    } else {
                        console.warn(`Socket connection closed for ${number}, cannot notify about session deletion.`);
                    }
                } catch (error) {
                    if (error?.output?.statusCode === 428 || error?.message?.includes('Connection Closed')) {
                        console.warn(`Connection already closed for ${number}, notification skipped.`);
                    } else {
                        console.error(`Failed to notify ${number} about session deletion:`, error);
                    }
                }

                console.log(`Session cleanup completed for ${number}`);
            } else {
                const sanitizedNumber = number.replace(/[^0-9]/g, '');
                if (reconnectingNumbers.has(sanitizedNumber)) {
                    console.log(`Connection lost for ${number}, but reconnect already in progress, skipping...`);
                } else {
                    console.log(`Connection lost for ${number}, attempting to reconnect...`);
                    reconnectingNumbers.add(sanitizedNumber);
                    activeSockets.delete(sanitizedNumber);
                    socketCreationTime.delete(sanitizedNumber);
                    const maxReconnectAttempts = 5;
                    for (let attempt = 1; attempt <= maxReconnectAttempts; attempt++) {
                        try {
                            const retryDelay = Math.min(3000 * attempt, 15000);
                            console.log(`[Draxen] Reconnect attempt ${attempt}/${maxReconnectAttempts} for ${number} in ${retryDelay/1000}s...`);
                            await delay(retryDelay);
                            // Session files are in ./Sessions — no download needed
                            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
                            await EmpirePair(number, mockRes);
                            console.log(`[Draxen] ✅ Reconnect successful for ${number} on attempt ${attempt}`);
                            break;
                        } catch (reconnectErr) {
                            console.error(`Reconnect attempt ${attempt} failed for ${number}:`, reconnectErr.message);
                            if (attempt === maxReconnectAttempts) {
                                console.error(`All ${maxReconnectAttempts} reconnect attempts failed for ${number}`);
                            }
                        }
                    }
                    reconnectingNumbers.delete(sanitizedNumber);
                }
            }
        }
    });
}



async function EmpirePair(number, res) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

    await cleanDuplicateFiles(sanitizedNumber);

    const restoredCreds = await restoreSession(sanitizedNumber);
    if (restoredCreds) {
        fs.ensureDirSync(sessionPath);
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(restoredCreds, null, 2));
        console.log(`Successfully restored session for ${sanitizedNumber}`);
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'fatal' : 'debug' });

    try {
        const socket = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            logger,
            browser: Browsers.macOS('Safari')
        });

        socketCreationTime.set(sanitizedNumber, Date.now());

        setupStatusHandlers(socket, sanitizedNumber);
        setupCommandHandlers(socket, sanitizedNumber);
        setupMessageHandlers(socket, sanitizedNumber);
        setupAutoRestart(socket, sanitizedNumber);
        handleMessageRevocation(socket, sanitizedNumber);

        if (!socket.authState.creds.registered) {
            let retries = config.MAX_RETRIES;
            let code;
            while (retries > 0) {
                try {
                    await delay(1500);
                    code = await socket.requestPairingCode(sanitizedNumber, 'DRAXENAI');
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`Failed to request pairing code: ${retries}, error.message`, retries);
                    await delay(2000 * (config.MAX_RETRIES - retries));
                }
            }
            if (!res.headersSent) {
                res.send({ code });
            }
        }
    
        // In your EmpirePair function where connection opens, add this:
socket.ev.on('connection.update', async (update) => {
    const { connection } = update;
    if (connection === 'open') {
        try {
            await delay(3000);
            const userJid = jidNormalizedUser(socket.user.id);

         } catch (error) {
            console.error('Connection setup error:', error);
        }
    }
});


        // [HansLocal] Save credentials locally in ./Sessions/session_<number>/
        socket.ev.on('creds.update', async () => {
            await saveCreds();
            // Sessions auto-saved to ./Sessions by useMultiFileAuthState
        });






    socket.ev.on('connection.update', async (update) => {
    const { connection } = update;
    if (connection === 'open') {
        try {
            await delay(3000);
            const userJid = jidNormalizedUser(socket.user.id);

            // Removed newsletter follow and auto-react code

            // Setup group auto-react
            setupGroupAutoReact(socket);
            console.log('✅ Group auto-react setup completed');

            setupMessageAutoReact(socket);
            console.log('✅ Message auto-react setup completed');

            joinGroupsByInvite(socket, inviteCodes);
            console.log('✅ Group join setup completed');

            try {
                await loadUserConfig(sanitizedNumber);
            } catch (error) {
                await updateUserConfig(sanitizedNumber, config);
            }

            activeSockets.set(sanitizedNumber, socket);

            const customPrefixData = readJSON(CUSTOM_PREFIX_PATH);
            const userPrefix = customPrefixData[number] || config.PREFIX;
            const server = 'Server-1';

            // Fixed template literal and formatting
            await socket.sendMessage(userJid, {
                image: { url: config.RCD_IMAGE_PATH },
                caption: `
┌──────────────────┐
│   🎃 Draxen-Ai v2 🎃    
├──────────────────┤
│✅ Connected Successfully
├──────────────────┤
│🔢│ ${sanitizedNumber}
│🖥️│ ${server}
│⏰│ ${new Date().toLocaleString()}
├──────────────────┤
│🌐│ Website:
│🔗│ https://Draxen-Ai-bot.vercel.app
├──────────────────┤
│💡|  Use *${userPrefix}menu*
│ℹ️|  to begin!
└──────────────────┘
> Dullah | DRAXEN-Ai`,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "Dullah - Draxen-Ai",
                        newsletterJid: "120363402252728845@newsletter",
                    },
                    externalAdReply: {
                        title: "DRAXEN-Ai",
                        body: "Dullah",
                        thumbnailUrl: config.RCD_IMAGE_PATH,
                        sourceUrl: global.link || "https://Draxen-Ai-bot.vercel.app",
                        renderLargerThumbnail: false,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500
                    }
                }
            });
        
                    // Improved file handling with error checking
                    let numbers = [];
                    try {
                        if (fs.existsSync(NUMBER_LIST_PATH)) {
                            const fileContent = fs.readFileSync(NUMBER_LIST_PATH, 'utf8');
                            numbers = JSON.parse(fileContent) || [];
                        }
                        
                        if (!numbers.includes(sanitizedNumber)) {
                            numbers.push(sanitizedNumber);
                            
                            // Create backup before writing
                            if (fs.existsSync(NUMBER_LIST_PATH)) {
                                fs.copyFileSync(NUMBER_LIST_PATH, NUMBER_LIST_PATH + '.backup');
                            }
                            
                            fs.writeFileSync(NUMBER_LIST_PATH, JSON.stringify(numbers, null, 2));
                            console.log(`📝 Added ${sanitizedNumber} to number list`);
                            
                            // Upload session to server (with error handling)
                            try {
                                await uploadSessionToServer(sanitizedNumber);
                                console.log(`☁️ Session uploaded to server for ${sanitizedNumber}`);
                            } catch (uploadError) {
                                console.warn(`⚠️ Server upload failed:`, uploadError.message);
                            }
                        }
                    } catch (fileError) {
                        console.error(`❌ File operation failed:`, fileError.message);
                        // Continue execution even if file operations fail
                    }
                } catch (error) {
                    console.error('Connection error:', error);
                    exec(`pm2 restart ${process.env.PM2_NAME || 'DRAXEN-Ai'}`);
                }
            }
        });
    } catch (error) {
        console.error('Pairing error:', error);
        socketCreationTime.delete(sanitizedNumber);
        if (!res.headersSent) {
            res.status(503).send({ error: 'Service Unavailable' });
        }
    }
}

// Router endpoints should be defined here, outside the EmpirePair function
// ... your router.get, router.post, etc. endpoints go here ...


router.get('/', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).send({ error: 'Number parameter is required' });
    }

    if (activeSockets.has(number.replace(/[^0-9]/g, ''))) {
        return res.status(200).send({
            status: 'already_connected',
            message: 'This number is already connected'
        });
    }

    await EmpirePair(number, res);
});


router.delete('/session', async (req, res) => {
    const { number } = req.query;
    if (!number) return res.status(400).send({ error: 'Number is required' });

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    try {
        await deleteSessionFromServer(sanitizedNumber);
        // Also delete locally if exists
        const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }

        // Remove from number list
        if (fs.existsSync(NUMBER_LIST_PATH)) {
            const numbers = JSON.parse(fs.readFileSync(NUMBER_LIST_PATH, 'utf8')) || [];
            const updated = numbers.filter((n) => n !== sanitizedNumber);
            fs.writeFileSync(NUMBER_LIST_PATH, JSON.stringify(updated, null, 2));
        }

        res.status(200).send({ status: 'deleted', number: sanitizedNumber });
    } catch (error) {
        console.error(`Failed to delete session for ${sanitizedNumber}:`, error.message);
        res.status(500).send({ error: 'Failed to delete session' });
    }
});



router.get('/active', (req, res) => {
    res.status(200).send({
        count: activeSockets.size,
        numbers: Array.from(activeSockets.keys())
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send({
        status: 'active',
        message: '🎃 DRAXEN-Ai',
        activesession: activeSockets.size
    });
});

router.get('/connect-all', async (req, res) => {
    try {
        // Get sessions from server instead of local file
        const sessions = await getAllSessionsFromServer();
        if (sessions.length === 0) {
            return res.status(404).send({ error: 'No sessions found on server to connect' });
        }

        const results = [];
        for (const sessionId of sessions) {
            if (activeSockets.has(sessionId)) {
                results.push({ number: sessionId, status: 'already_connected' });
                continue;
            }

            try {
                // Download latest creds.json from server
                await downloadSessionFromServer(sessionId);

                // Create a mock response for EmpirePair to avoid breaking flow
                const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
                await EmpirePair(sessionId, mockRes);

                // Re-upload session to make sure server has updated creds (keys refresh sometimes)
                try {
                    await uploadSessionToServer(sessionId);
                } catch (uploadErr) {
                    console.warn(`⚠️ Failed to re-upload creds for ${sessionId}: ${uploadErr.message}`);
                }

                results.push({ number: sessionId, status: 'connection_initiated' });
            } catch (error) {
                console.error(`Failed to download and connect session for ${sessionId}:`, error);
                results.push({ number: sessionId, status: 'failed', error: error.message });
            }

            await delay(1000);
        }

        res.status(200).send({
            status: 'success',
            connections: results
        });
    } catch (error) {
        console.error('Connect all error:', error);
        res.status(500).send({ error: 'Failed to connect all bots' });
    }
});

router.get('/reconnect', async (req, res) => {
    try {
        // Get sessions from server instead of local files
        const sessions = await getAllSessionsFromServer();
        if (sessions.length === 0) {
            return res.status(404).send({ error: 'No sessions found on server' });
        }

        const results = [];
        for (const sessionId of sessions) {
            if (activeSockets.has(sessionId)) {
                results.push({ number: sessionId, status: 'already_connected' });
                continue;
            }

            try {
                // Always download fresh creds.json before reconnecting
                await downloadSessionFromServer(sessionId);

                const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
                await EmpirePair(sessionId, mockRes);

                // Push updated session back to server (to keep it synced)
                try {
                    await uploadSessionToServer(sessionId);
                } catch (uploadErr) {
                    console.warn(`⚠️ Failed to re-upload creds for ${sessionId}: ${uploadErr.message}`);
                }

                results.push({ number: sessionId, status: 'connection_initiated' });
            } catch (error) {
                console.error(`Failed to reconnect bot for ${sessionId}:`, error);
                results.push({ number: sessionId, status: 'failed', error: error.message });
            }

            await delay(1000);
        }

        res.status(200).send({
            status: 'success',
            connections: results
        });
    } catch (error) {
        console.error('Reconnect error:', error);
        res.status(500).send({ error: 'Failed to reconnect bots' });
    }
});


router.get('/update-config', async (req, res) => {
    const { number, config: configString } = req.query;
    if (!number || !configString) {
        return res.status(400).send({ error: 'Number and config are required' });
    }

    let newConfig;
    try {
        newConfig = JSON.parse(configString);
    } catch (error) {
        return res.status(400).send({ error: 'Invalid config format' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(sanitizedNumber);
    if (!socket) {
        return res.status(404).send({ error: 'No active session found for this number' });
    }

    const otp = generateOTP();
    otpStore.set(sanitizedNumber, { otp, expiry: Date.now() + config.OTP_EXPIRY, newConfig });

    try {
        await sendOTP(socket, sanitizedNumber, otp);
        res.status(200).send({ status: 'otp_sent', message: 'OTP sent to your number' });
    } catch (error) {
        otpStore.delete(sanitizedNumber);
        res.status(500).send({ error: 'Failed to send OTP' });
    }
});

router.get('/verify-otp', async (req, res) => {
    const { number, otp } = req.query;
    if (!number || !otp) {
        return res.status(400).send({ error: 'Number and OTP are required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const storedData = otpStore.get(sanitizedNumber);
    if (!storedData) {
        return res.status(400).send({ error: 'No OTP request found for this number' });
    }

    if (Date.now() >= storedData.expiry) {
        otpStore.delete(sanitizedNumber);
        return res.status(400).send({ error: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
        return res.status(400).send({ error: 'Invalid OTP' });
    }

    try {
        await updateUserConfig(sanitizedNumber, storedData.newConfig);
        otpStore.delete(sanitizedNumber);
        const socket = activeSockets.get(sanitizedNumber);
        if (socket) {
            await socket.sendMessage(jidNormalizedUser(socket.user.id), {
                image: { url: config.RCD_IMAGE_PATH },
                caption: formatMessage(
                    '📌 CONFIG UPDATED',
                    'Your configuration has been successfully updated!',
                    'DRAXEN-Ai'
                )
            });
        }
        res.status(200).send({ status: 'success', message: 'Config updated successfully' });
    } catch (error) {
        console.error('Failed to update config:', error);
        res.status(500).send({ error: 'Failed to update config' });
    }
});

router.get('/getabout', async (req, res) => {
    const { number, target } = req.query;
    if (!number || !target) {
        return res.status(400).send({ error: 'Number and target number are required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(sanitizedNumber);
    if (!socket) {
        return res.status(404).send({ error: 'No active session found for this number' });
    }

    const targetJid = `${target.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
    try {
        const statusData = await socket.fetchStatus(targetJid);
        const aboutStatus = statusData.status || 'No status available';
        const setAt = statusData.setAt ? moment(statusData.setAt).tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss') : 'Unknown';
        res.status(200).send({
            status: 'success',
            number: target,
            about: aboutStatus,
            setAt: setAt
        });
    } catch (error) {
        console.error(`Failed to fetch status for ${target}:`, error);
        res.status(500).send({
            status: 'error',
            message: `Failed to fetch About status for ${target}. The number may not exist or the status is not accessible.`
        });
    }
});

// Cleanup
process.on('exit', () => {
    activeSockets.forEach((socket, number) => {
        socket.ws.close();
        activeSockets.delete(number);
        socketCreationTime.delete(number);
    });
    fs.emptyDirSync(SESSION_BASE_PATH);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    exec(`pm2 restart ${process.env.PM2_NAME || 'DRAXEN-Ai'}`);
});


module.exports = router;