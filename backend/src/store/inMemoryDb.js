import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', '..', 'sessions_store.json');

class SessionDatabase {
  constructor() {
    this.sessions = new Map();
    this.history = [];
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (data.sessions) {
          Object.entries(data.sessions).forEach(([id, sess]) => {
            this.sessions.set(id, sess);
          });
        }
        if (Array.isArray(data.history)) {
          this.history = data.history;
        }
      }
    } catch (err) {
      console.warn("[SessionDatabase] Could not load persisted data:", err.message);
    }
  }

  saveToFile() {
    try {
      const obj = {
        sessions: Object.fromEntries(this.sessions),
        history: this.history
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      console.warn("[SessionDatabase] Could not persist data:", err.message);
    }
  }

  createSession(sessionData) {
    this.sessions.set(sessionData.id, sessionData);
    this.saveToFile();
    return sessionData;
  }

  getSession(id) {
    return this.sessions.get(id) || null;
  }

  updateSession(id, updates) {
    const session = this.sessions.get(id);
    if (!session) return null;
    const updated = { ...session, ...updates, updatedAt: new Date().toISOString() };
    this.sessions.set(id, updated);
    this.saveToFile();
    return updated;
  }

  recordHistory(summary) {
    this.history.unshift(summary);
    if (this.history.length > 50) this.history.pop();
    this.saveToFile();
  }

  getHistory() {
    return this.history;
  }
}

export const db = new SessionDatabase();
