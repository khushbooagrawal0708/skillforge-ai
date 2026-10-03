const API_BASE = '/api';

export const api = {
  // Check backend and Gemini status
  async getStatus() {
    const res = await fetch(`${API_BASE}/system/status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  // Test custom Gemini API key
  async verifyApiKey(apiKey) {
    const res = await fetch(`${API_BASE}/system/verify-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    return res.json();
  },

  // Get topics and baseline presets
  async getTopics() {
    const res = await fetch(`${API_BASE}/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics');
    return res.json();
  },

  // Start a new adaptive exam
  async startExam({ topic, customTopic, targetQuestions, initialDifficulty, apiKey }) {
    const res = await fetch(`${API_BASE}/exams/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        customTopic,
        targetQuestions,
        initialDifficulty,
        apiKey
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to start exam' }));
      throw new Error(err.error || 'Failed to start exam');
    }
    return res.json();
  },

  // Submit answer for active question
  async submitAnswer({ sessionId, answer, timeSpentSeconds, apiKey }) {
    const res = await fetch(`${API_BASE}/exams/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, timeSpentSeconds, apiKey })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit answer' }));
      throw new Error(err.error || 'Failed to submit answer');
    }
    return res.json();
  },

  // Force finish exam early
  async finishExam(sessionId) {
    const res = await fetch(`${API_BASE}/exams/${sessionId}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to finish exam');
    return res.json();
  },

  // Get results
  async getResults(sessionId) {
    const res = await fetch(`${API_BASE}/exams/${sessionId}/results`);
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  // Get exam history
  async getHistory() {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  }
};
