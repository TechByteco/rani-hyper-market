import re

def patch_file(filepath):
    print(f"Patching {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update outdated numbers
    html = html.replace('17,547</b>', '21,651</b>')
    html = html.replace('30,31,972</span>', '37,02,626</span>')
    html = html.replace('7,179 Items', '7,522 Items')
    html = html.replace('7,179 items', '7,522 items')
    html = html.replace('7,179 Products', '7,522 Products')
    html = html.replace('7,179+ inventory items', '7,522+ inventory items')
    html = html.replace('7,179+ items', '7,522+ items')
    html = html.replace("prodCount = allProducts.length ? allProducts.length.toLocaleString('en-IN') : '7,179'", "prodCount = allProducts.length ? allProducts.length.toLocaleString('en-IN') : '7,522'")
    html = html.replace("const salesVal = raniAnalytics ? '₹' + (raniAnalytics.totalSales / 10000000).toFixed(2) + ' Cr' : '₹2.84 Cr';", "const salesVal = raniAnalytics ? '₹' + (raniAnalytics.totalSales / 100000).toFixed(2) + ' L' : '₹37.02 L';")
    html = html.replace("const ordersCount = raniAnalytics ? raniAnalytics.totalOrders.toLocaleString('en-IN') : (allOrders.length.toLocaleString('en-IN') || '3,485');", "const ordersCount = raniAnalytics ? raniAnalytics.totalOrders.toLocaleString('en-IN') : '21,651';")

    # 2. Add Gemini Key button to AI Studio Hero Header
    old_studio_hero_actions = '''            <div class="flex items-center gap-2 flex-wrap">
              <button type="button" onclick="sendWhatsAppDailyBriefing()" class="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer" title="Send WhatsApp Briefing to Rani (+91 77088 34547)">
                <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp Briefing (Rani)
              </button>'''

    new_studio_hero_actions = '''            <div class="flex items-center gap-2 flex-wrap">
              <button type="button" onclick="openGeminiApiKeyModal()" class="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer" title="Configure Google Gemini API Key">
                <i class="fa-solid fa-key text-amber-300"></i> <span id="studio-gemini-btn-text">Gemini API Key</span>
              </button>
              <button type="button" onclick="sendWhatsAppDailyBriefing()" class="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer" title="Send WhatsApp Briefing to Rani (+91 77088 34547)">
                <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp Briefing (Rani)
              </button>'''

    if old_studio_hero_actions in html:
        html = html.replace(old_studio_hero_actions, new_studio_hero_actions, 1)

    # 3. Add Auto-Speak Voice Toggle and Gemini Key button to Copilot Chat header in Module 6
    old_copilot_header_right = '''              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">Voice-Enabled</span>
            </div>'''

    new_copilot_header_right = '''              <div class="flex items-center gap-2">
                <button type="button" id="btn-toggle-auto-speak" onclick="toggleAutoSpeak()" class="px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 cursor-pointer" title="Automatically speak AI answers aloud">
                  <i class="fa-solid fa-volume-high text-xs" id="auto-speak-icon"></i>
                  <span id="auto-speak-label">Speak Aloud: OFF</span>
                </button>
                <button type="button" id="btn-stop-speech" onclick="stopAiSpeech()" class="hidden px-2 py-0.5 rounded-full text-[10px] font-bold transition items-center gap-1 bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 cursor-pointer" title="Stop current voice speech">
                  <i class="fa-solid fa-stop text-xs"></i> Stop Voice
                </button>
                <button type="button" onclick="openGeminiApiKeyModal()" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border border-indigo-200 flex items-center gap-1 cursor-pointer" title="Manage Gemini API key">
                  <i class="fa-solid fa-gear"></i> AI Key
                </button>
              </div>
            </div>'''

    if old_copilot_header_right in html:
        html = html.replace(old_copilot_header_right, new_copilot_header_right, 1)

    # 4. Add Gemini key button & Auto-speak to the floating widget header
    old_widget_header_tools = '''        <button type="button" onclick="clearAdminAiChat()" title="Reset Chat" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-rotate-left"></i>
        </button>'''

    new_widget_header_tools = '''        <button type="button" onclick="openGeminiApiKeyModal()" title="Gemini AI Settings" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-key"></i>
        </button>
        <button type="button" onclick="toggleAutoSpeak()" id="widget-btn-speak" title="Auto-Speak Voice Answers" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-volume-high"></i>
        </button>
        <button type="button" onclick="clearAdminAiChat()" title="Reset Chat" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-rotate-left"></i>
        </button>'''

    if old_widget_header_tools in html:
        html = html.replace(old_widget_header_tools, new_widget_header_tools, 1)

    # 5. Insert Modal before </body> if not present
    if 'id="modal-gemini-key"' not in html:
        modal_html = """
  <!-- GEMINI API KEY & AI ENGINE CONFIG MODAL -->
  <div id="modal-gemini-key" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden animate-ai-slide">
    <div class="glass p-6 sm:p-7 rounded-3xl border border-purple-300 shadow-2xl max-w-lg w-full bg-white/95 space-y-5">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center text-lg shadow-md">
            <i class="fa-solid fa-brain"></i>
          </div>
          <div>
            <h3 class="font-black text-gray-900 text-base">Gemini AI Engine Settings</h3>
            <p class="text-xs text-gray-500">Autonomous Copilot & Voice Assistant Configuration</p>
          </div>
        </div>
        <button type="button" onclick="closeGeminiApiKeyModal()" class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center text-sm transition">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Active Status Card -->
      <div id="gemini-modal-status-card" class="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5">
          <span id="gemini-status-indicator" class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <div class="font-black text-gray-900" id="gemini-status-title">Active AI Engine</div>
            <div class="text-[11px] text-gray-600" id="gemini-status-desc">POS Grounded + Gemini Autonomous Reasoning</div>
          </div>
        </div>
        <span id="gemini-status-pill" class="px-2.5 py-1 rounded-full font-black text-[10px] uppercase bg-emerald-200 text-emerald-900">Connected</span>
      </div>

      <!-- Input Form -->
      <div class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-gray-800 mb-1 flex items-center justify-between">
            <span>Google Gemini API Key</span>
            <a href="https://aistudio.google.com/apikey" target="_blank" class="text-purple-600 hover:underline flex items-center gap-1 font-semibold">
              Get Free Key <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </label>
          <div class="relative">
            <input type="password" id="input-gemini-api-key" placeholder="AIzaSy..." class="glass-input w-full py-2.5 pl-3 pr-10 rounded-xl border border-gray-300 font-mono text-xs outline-none" />
            <button type="button" onclick="toggleGeminiKeyVisibility()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs">
              <i class="fa-solid fa-eye" id="icon-toggle-key-vis"></i>
            </button>
          </div>
          <p class="text-[11px] text-gray-500 mt-1">Saved securely in browser memory and local server config. Used exclusively to analyze Rani Hyper Market store records.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-gray-800 mb-1">Gemini AI Model</label>
            <select id="select-gemini-model" class="glass-input w-full py-2 px-3 rounded-xl border border-gray-300 text-xs font-semibold outline-none">
              <option value="gemini-2.5-flash" selected>gemini-2.5-flash (Balanced & Smart)</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash (High Reasoning)</option>
              <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Ultra Fast)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash (Legacy)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-gray-800 mb-1">Voice Accent & Language</label>
            <select id="select-voice-lang" onchange="onVoiceLangChanged(this.value)" class="glass-input w-full py-2 px-3 rounded-xl border border-gray-300 text-xs font-semibold outline-none">
              <option value="en-IN" selected>Indian English (en-IN)</option>
              <option value="ta-IN">Tamil (ta-IN / தமிழ்)</option>
              <option value="en-US">US English (en-US)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Feedback Message Box -->
      <div id="gemini-test-result-box" class="hidden p-3 rounded-xl text-xs font-medium"></div>

      <!-- Actions -->
      <div class="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
        <button type="button" onclick="testGeminiConnection()" id="btn-test-gemini" class="px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-vial"></i> Test Connection
        </button>
        <div class="flex items-center gap-2">
          <button type="button" onclick="closeGeminiApiKeyModal()" class="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition cursor-pointer">
            Cancel
          </button>
          <button type="button" onclick="saveGeminiApiKeySettings()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:opacity-95 text-white text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-floppy-disk"></i> Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
"""
        html = html.replace('</body>', modal_html + '\n</body>', 1)

    # 6. Add the Gemini Key & Voice Assistant JavaScript Logic
    js_block = """
    /* ══════════════════════════════════════════════════════════════════
       GEMINI API & VOICE ASSISTANT CLIENT CONTROLLER (RANI HYPER MARKET)
       ══════════════════════════════════════════════════════════════════ */
    let raniGeminiKey = localStorage.getItem('rani_gemini_api_key') || '';
    let raniGeminiModel = localStorage.getItem('rani_gemini_model') || 'gemini-2.5-flash';
    let isAutoSpeakActive = localStorage.getItem('rani_auto_speak') === 'true';
    let currentSpeechUtterance = null;
    let wasVoiceInput = false;

    function openGeminiApiKeyModal() {
      const modal = document.getElementById('modal-gemini-key');
      if (!modal) return;
      const input = document.getElementById('input-gemini-api-key');
      const selModel = document.getElementById('select-gemini-model');
      if (input) input.value = raniGeminiKey || '';
      if (selModel) selModel.value = raniGeminiModel || 'gemini-2.5-flash';
      updateGeminiModalStatus();
      modal.classList.remove('hidden');
    }

    function closeGeminiApiKeyModal() {
      const modal = document.getElementById('modal-gemini-key');
      if (modal) modal.classList.add('hidden');
    }

    function toggleGeminiKeyVisibility() {
      const input = document.getElementById('input-gemini-api-key');
      const icon = document.getElementById('icon-toggle-key-vis');
      if (!input || !icon) return;
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
      }
    }

    function updateGeminiModalStatus() {
      const card = document.getElementById('gemini-modal-status-card');
      const title = document.getElementById('gemini-status-title');
      const desc = document.getElementById('gemini-status-desc');
      const pill = document.getElementById('gemini-status-pill');
      const indicator = document.getElementById('gemini-status-indicator');

      if (raniGeminiKey) {
        if (card) card.className = 'p-4 rounded-2xl border border-purple-200 bg-purple-50/70 flex items-center justify-between gap-3 text-xs';
        if (title) title.textContent = 'Google Gemini Cloud AI Active';
        if (desc) desc.textContent = `Model: ${raniGeminiModel} • Full autonomous reasoning grounded in store data`;
        if (pill) {
          pill.className = 'px-2.5 py-1 rounded-full font-black text-[10px] uppercase bg-purple-200 text-purple-900';
          pill.textContent = 'Cloud AI';
        }
        if (indicator) indicator.className = 'w-3 h-3 rounded-full bg-purple-500 animate-pulse';
      } else {
        if (card) card.className = 'p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between gap-3 text-xs';
        if (title) title.textContent = 'Live POS Records Analytics Engine';
        if (desc) desc.textContent = '21,651 bills • ₹37.02L sales • Add Gemini Key for free-form conversation';
        if (pill) {
          pill.className = 'px-2.5 py-1 rounded-full font-black text-[10px] uppercase bg-emerald-200 text-emerald-900';
          pill.textContent = 'POS Analytics';
        }
        if (indicator) indicator.className = 'w-3 h-3 rounded-full bg-emerald-500';
      }
    }

    function updateStudioAiEngineBadges() {
      const badgeText = document.getElementById('studio-ai-engine-text');
      const pulseDot = document.getElementById('studio-ai-pulse-dot');
      const btnText = document.getElementById('studio-gemini-btn-text');

      if (raniGeminiKey) {
        if (badgeText) badgeText.textContent = `Active: Gemini AI (${raniGeminiModel})`;
        if (pulseDot) pulseDot.className = 'w-2 h-2 rounded-full bg-purple-500 animate-pulse';
        if (btnText) btnText.textContent = 'Gemini Active';
      } else {
        if (badgeText) badgeText.textContent = 'Active: Live POS Analytics';
        if (pulseDot) pulseDot.className = 'w-2 h-2 rounded-full bg-emerald-500';
        if (btnText) btnText.textContent = 'Connect Gemini';
      }
    }

    async function testGeminiConnection() {
      const input = document.getElementById('input-gemini-api-key');
      const selModel = document.getElementById('select-gemini-model');
      const resBox = document.getElementById('gemini-test-result-box');
      const btn = document.getElementById('btn-test-gemini');
      const key = input ? input.value.trim() : '';
      const model = selModel ? selModel.value : 'gemini-2.5-flash';

      if (!key) {
        if (resBox) {
          resBox.className = 'p-3 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 block';
          resBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Please paste a Gemini API Key to test.';
        }
        return;
      }

      if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing...';
      if (resBox) resBox.className = 'hidden';

      try {
        const res = await fetch('/api/ai/test-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: key, model: model })
        });
        const data = await res.json();
        if (btn) btn.innerHTML = '<i class="fa-solid fa-vial"></i> Test Connection';

        if (data.success) {
          if (resBox) {
            resBox.className = 'p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 block';
            resBox.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> <b>Success!</b> Google Gemini API connected with <b>${data.model || model}</b>.`;
          }
        } else {
          if (resBox) {
            resBox.className = 'p-3 rounded-xl text-xs font-medium bg-red-50 text-red-800 border border-red-200 block';
            resBox.innerHTML = `<i class="fa-solid fa-circle-xmark text-red-600 mr-1.5"></i> <b>Test Failed:</b> ${data.error || 'Invalid API key or network error'}`;
          }
        }
      } catch (e) {
        if (btn) btn.innerHTML = '<i class="fa-solid fa-vial"></i> Test Connection';
        if (resBox) {
          resBox.className = 'p-3 rounded-xl text-xs font-medium bg-red-50 text-red-800 border border-red-200 block';
          resBox.innerHTML = `<i class="fa-solid fa-circle-xmark text-red-600 mr-1.5"></i> <b>Connection error:</b> ${e.message}`;
        }
      }
    }

    async function saveGeminiApiKeySettings() {
      const input = document.getElementById('input-gemini-api-key');
      const selModel = document.getElementById('select-gemini-model');
      const key = input ? input.value.trim() : '';
      const model = selModel ? selModel.value : 'gemini-2.5-flash';

      raniGeminiKey = key;
      raniGeminiModel = model;
      localStorage.setItem('rani_gemini_api_key', key);
      localStorage.setItem('rani_gemini_model', model);

      try {
        await fetch('/api/ai/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ geminiApiKey: key, model: model, enabled: true })
        });
      } catch (e) {}

      updateGeminiModalStatus();
      updateStudioAiEngineBadges();
      closeGeminiApiKeyModal();

      if (typeof showAdminNotification === 'function') {
        showAdminNotification(key ? 'Gemini AI Engine Connected!' : 'Switched to Local Analytics Engine', 'success');
      } else {
        alert(key ? 'Gemini API Settings Saved & Connected!' : 'Local POS Analytics Engine Active.');
      }
    }

    /* ══════════════════════════════════════════════════════════════════
       TEXT-TO-SPEECH (TTS) VOICE ASSISTANT ENGINE
       ══════════════════════════════════════════════════════════════════ */
    function speakAiText(rawText) {
      if (!('speechSynthesis' in window)) return;
      stopAiSpeech();

      if (!rawText) return;
      let clean = rawText
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#*`_~]/g, '')
        .replace(/\|/g, ', ')
        .replace(/-{3,}/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/₹/g, 'Rupees ')
        .replace(/Rs\./gi, 'Rupees ')
        .replace(/\n+/g, '. ')
        .trim();

      if (clean.length > 400) {
        clean = clean.slice(0, 400) + '... Please check the screen for complete details.';
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      const lang = localStorage.getItem('rani_voice_lang') || 'en-IN';
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.slice(0, 2)));
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onstart = () => {
        document.getElementById('btn-stop-speech')?.classList.remove('hidden');
        document.getElementById('btn-stop-speech')?.classList.add('flex');
      };
      utterance.onend = utterance.onerror = () => {
        document.getElementById('btn-stop-speech')?.classList.add('hidden');
        document.getElementById('btn-stop-speech')?.classList.remove('flex');
        currentSpeechUtterance = null;
      };

      currentSpeechUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }

    function stopAiSpeech() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        currentSpeechUtterance = null;
        document.getElementById('btn-stop-speech')?.classList.add('hidden');
        document.getElementById('btn-stop-speech')?.classList.remove('flex');
      }
    }

    function toggleAutoSpeak() {
      isAutoSpeakActive = !isAutoSpeakActive;
      localStorage.setItem('rani_auto_speak', isAutoSpeakActive);
      updateAutoSpeakUI();
    }

    function updateAutoSpeakUI() {
      const label = document.getElementById('auto-speak-label');
      const icon = document.getElementById('auto-speak-icon');
      const btn = document.getElementById('btn-toggle-auto-speak');
      const widgetBtn = document.getElementById('widget-btn-speak');

      if (label) label.textContent = isAutoSpeakActive ? 'Speak Aloud: ON' : 'Speak Aloud: OFF';
      if (icon) icon.className = isAutoSpeakActive ? 'fa-solid fa-volume-high text-emerald-600' : 'fa-solid fa-volume-xmark text-gray-400';
      if (widgetBtn) widgetBtn.innerHTML = isAutoSpeakActive ? '<i class="fa-solid fa-volume-high text-amber-300"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
      if (btn) {
        if (isAutoSpeakActive) {
          btn.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 border border-emerald-300 text-emerald-800 bg-emerald-100 cursor-pointer shadow-2xs';
        } else {
          btn.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 border border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 cursor-pointer';
        }
      }
    }

    function onVoiceLangChanged(lang) {
      localStorage.setItem('rani_voice_lang', lang);
    }

    // Call badge and speak update on window load
    setTimeout(() => {
      updateStudioAiEngineBadges();
      updateAutoSpeakUI();
    }, 300);
"""

    if '/* GEMINI API & VOICE ASSISTANT CLIENT CONTROLLER' not in html:
        insert_marker = 'let isAiChatOpen = false;'
        if insert_marker in html:
            html = html.replace(insert_marker, js_block + '\n    ' + insert_marker, 1)

    # 7. Update handleSendAdminAiMessage to send API key and speak response
    old_handle_send = '''      showAiTypingIndicator();

      try {
        const res = await fetch('/api/ai-analytics/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q })
        });
        const data = await res.json();
        removeAiTypingIndicator();
        if (data && data.answer) {
          appendAiBotMessage(formatAdminAiMarkdown(data.answer));
          return;
        }
      } catch (err) {
        console.warn('API chat fallback:', err);
      }

      removeAiTypingIndicator();
      const replyHtml = AdminDataCopilot.analyze(q);
      appendAiBotMessage(replyHtml);'''

    new_handle_send = '''      showAiTypingIndicator();
      const currentWasVoice = wasVoiceInput;
      wasVoiceInput = false;

      try {
        const payload = {
          question: q,
          apiKey: raniGeminiKey || localStorage.getItem('rani_gemini_api_key') || '',
          model: raniGeminiModel || localStorage.getItem('rani_gemini_model') || 'gemini-2.5-flash',
          history: aiChatHistory.slice(-6)
        };
        const res = await fetch('/api/ai-analytics/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        removeAiTypingIndicator();
        if (data && data.answer) {
          const isGem = data.engine === 'gemini' || (data.source && data.source.includes('Gemini'));
          const engineTag = isGem
            ? `<div class="flex items-center justify-between text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg mb-1 border border-purple-200"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Google Gemini AI (${data.model || '2.5 Flash'})</span><button type="button" onclick="speakAiText(this.closest('.space-y-2').innerText)" title="Listen" class="text-purple-600 hover:text-purple-900 cursor-pointer flex items-center gap-1 font-bold"><i class="fa-solid fa-volume-high"></i> Listen</button></div>`
            : `<div class="flex items-center justify-between text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg mb-1 border border-emerald-200"><span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live POS Database &amp; Analytics Records</span><button type="button" onclick="speakAiText(this.closest('.space-y-2').innerText)" title="Listen" class="text-emerald-700 hover:text-emerald-950 cursor-pointer flex items-center gap-1 font-bold"><i class="fa-solid fa-volume-high"></i> Listen</button></div>`;
          appendAiBotMessage(engineTag + formatAdminAiMarkdown(data.answer));
          if (isAutoSpeakActive || currentWasVoice) {
            speakAiText(data.answer);
          }
          return;
        }
      } catch (err) {
        console.warn('API chat fallback:', err);
      }

      removeAiTypingIndicator();
      const replyHtml = AdminDataCopilot.analyze(q);
      appendAiBotMessage(replyHtml);
      if (isAutoSpeakActive || currentWasVoice) {
        speakAiText(replyHtml);
      }'''

    if old_handle_send in html:
        html = html.replace(old_handle_send, new_handle_send, 1)

    # 8. Update sendStudioAiMessage in Module 6
    old_studio_send = '''      let replyHtml = '';
      try {
        const res = await fetch('/api/ai-analytics/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q })
        });
        const data = await res.json();
        if (data && data.answer) {
          replyHtml = formatAdminAiMarkdown(data.answer);
        }
      } catch (err) {
        console.warn('Studio AI fetch error, falling back to local copilot:', err);
      }

      if (!replyHtml) {
        replyHtml = AdminDataCopilot.analyze(q);
      }'''

    new_studio_send = '''      let replyHtml = '';
      let rawBotAnswer = '';
      const currentWasVoice = wasVoiceInput;
      wasVoiceInput = false;

      try {
        const payload = {
          question: q,
          apiKey: raniGeminiKey || localStorage.getItem('rani_gemini_api_key') || '',
          model: raniGeminiModel || localStorage.getItem('rani_gemini_model') || 'gemini-2.5-flash',
          history: aiChatHistory.slice(-6)
        };
        const res = await fetch('/api/ai-analytics/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data && data.answer) {
          rawBotAnswer = data.answer;
          const isGem = data.engine === 'gemini' || (data.source && data.source.includes('Gemini'));
          const engineTag = isGem
            ? `<div class="flex items-center justify-between text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl mb-1.5 border border-purple-200"><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Google Gemini AI (${data.model || '2.5 Flash'})</span><button type="button" onclick="speakAiText(this.closest('.space-y-2').innerText)" title="Listen" class="text-purple-600 hover:text-purple-900 cursor-pointer flex items-center gap-1 font-bold text-[10px]"><i class="fa-solid fa-volume-high"></i> Listen</button></div>`
            : `<div class="flex items-center justify-between text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl mb-1.5 border border-emerald-200"><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Live POS Database &amp; Analytics Records</span><button type="button" onclick="speakAiText(this.closest('.space-y-2').innerText)" title="Listen" class="text-emerald-700 hover:text-emerald-950 cursor-pointer flex items-center gap-1 font-bold text-[10px]"><i class="fa-solid fa-volume-high"></i> Listen</button></div>`;
          replyHtml = engineTag + formatAdminAiMarkdown(data.answer);
        }
      } catch (err) {
        console.warn('Studio AI fetch error, falling back to local copilot:', err);
      }

      if (!replyHtml) {
        replyHtml = AdminDataCopilot.analyze(q);
        rawBotAnswer = replyHtml;
      }'''

    if old_studio_send in html:
        html = html.replace(old_studio_send, new_studio_send, 1)

    # 9. Also in sendStudioAiMessage: speak if was voice or auto-speak active
    old_studio_append = '''      msgBox.appendChild(botEl);
      msgBox.scrollTop = msgBox.scrollHeight;
      if (typeof playPosBeep === 'function') playPosBeep();
    }'''

    new_studio_append = '''      msgBox.appendChild(botEl);
      msgBox.scrollTop = msgBox.scrollHeight;
      if (typeof playPosBeep === 'function') playPosBeep();
      if (rawBotAnswer && (isAutoSpeakActive || currentWasVoice)) {
        speakAiText(rawBotAnswer);
      }
    }'''

    if old_studio_append in html:
        html = html.replace(old_studio_append, new_studio_append, 1)

    # 10. Set wasVoiceInput = true when speech recognition triggers
    html = html.replace("aiSpeechRecognition.onresult = (event) => {", "aiSpeechRecognition.onresult = (event) => {\n          wasVoiceInput = true;")
    html = html.replace("studioSpeechRecognition.onresult = (evt) => {", "studioSpeechRecognition.onresult = (evt) => {\n          wasVoiceInput = true;")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Patched {filepath} successfully!")

if __name__ == '__main__':
    for path in ['public/admin.html', 'admin.html']:
        patch_file(path)
