(function () {
  'use strict';

  const CATALOG = window.Catalog;
  const I18n = window.I18n;
  const t = function (key, vars) { return I18n.t(key, vars); };
  const META = {};
  CATALOG.forEach(function (item) { META[item.id] = item; });

  const state = {
    activeId: CATALOG[0].id,
    instances: {},
    autoValue: 10,
    settleTimer: null,
    focusPos: null,
    search: null,
    searchTimer: null,
    logEntries: []
  };

  const dom = {};

  function cacheDom() {
    dom.tabs = document.getElementById('tabs');
    dom.opButtons = document.getElementById('op-buttons');
    dom.opGroups = document.querySelectorAll('.op-group');
    dom.value = document.getElementById('value');
    dom.capacityRow = document.getElementById('capacity-row');
    dom.capacity = document.getElementById('capacity');
    dom.viz = document.getElementById('viz');
    dom.stage = document.getElementById('stage');
    dom.stageTitle = document.getElementById('stage-title');
    dom.stageTagline = document.getElementById('stage-tagline');
    dom.insight = document.getElementById('insight');
    dom.chips = document.getElementById('chips');
    dom.raw = document.getElementById('raw');
    dom.log = document.getElementById('log');
    dom.cpp = document.getElementById('cpp-source');
    dom.fill = document.getElementById('fill');
    dom.clear = document.getElementById('clear');
    dom.langToggle = document.getElementById('lang-toggle');
  }

  function currentMeta() {
    return META[state.activeId];
  }

  function currentInstance() {
    const meta = currentMeta();
    if (!state.instances[meta.id]) {
      state.instances[meta.id] = meta.create(meta.defaultCapacity);
    }
    return state.instances[meta.id];
  }

  function buildTabs() {
    CATALOG.forEach(function (item) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.id = 'tab-' + item.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'panel-stage');
      tab.dataset.id = item.id;

      const name = document.createElement('span');
      name.className = 'tab-name';
      name.dataset.i18n = item.nameKey;
      name.textContent = t(item.nameKey);

      const short = document.createElement('span');
      short.className = 'tab-short';
      short.dataset.i18n = item.shortKey;
      short.textContent = t(item.shortKey);

      tab.appendChild(name);
      tab.appendChild(short);
      tab.addEventListener('click', function () {
        selectStructure(item.id);
      });
      dom.tabs.appendChild(tab);
    });
  }

  function selectStructure(id) {
    if (!META[id]) {
      return;
    }
    state.activeId = id;
    state.focusPos = null;
    clearSearch();
    renderTabs();
    buildControls();
    refresh();
    if (window.location.hash.slice(1) !== id) {
      window.location.hash = id;
    }
  }

  function renderTabs() {
    const tabs = dom.tabs.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      const active = tab.dataset.id === state.activeId;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });
  }

  function buildControls() {
    const meta = currentMeta();

    dom.opGroups.forEach(function (group) {
      const kind = group.dataset.kind;
      const container = group.querySelector('.op-buttons');
      container.innerHTML = '';
      group.hidden = !meta.ops.some(function (op) { return op.kind === kind; });
      meta.ops.filter(function (op) { return op.kind === kind; }).forEach(function (op) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'op op-' + kind;
        button.dataset.i18n = op.labelKey;
        button.dataset.i18nAttr = 'title:' + op.hintKey;
        button.textContent = t(op.labelKey);
        button.title = t(op.hintKey);
        button.addEventListener('click', function () { runOp(op.id); });
        container.appendChild(button);
      });
    });

    if (meta.usesCapacity) {
      dom.capacityRow.hidden = false;
      dom.capacity.value = String(currentInstance().capacity);
    } else {
      dom.capacityRow.hidden = true;
    }

    dom.cpp.textContent = meta.cpp;
    dom.stageTitle.textContent = t(meta.nameKey);
    dom.stageTagline.textContent = t(meta.taglineKey);
    dom.value.placeholder = t('value.placeholder', { n: state.autoValue });
  }

  function resolveValue(op) {
    const takesValue = op.kind === 'add' || op.needsValue === true;
    const raw = dom.value.value.trim();

    if (!takesValue) {
      return { value: null };
    }

    if (raw === '') {
      if (op.needsValue) {
        return { errorKey: 'err.needsValue' };
      }
      const generated = state.autoValue;
      state.autoValue += 10;
      dom.value.placeholder = t('value.placeholder', { n: state.autoValue });
      return { value: generated, auto: true };
    }

    const parsed = Number(raw);
    if (!Number.isInteger(parsed)) {
      return { errorKey: 'err.notInteger', errorVars: { raw: raw } };
    }
    return { value: parsed };
  }

  function runOp(opId) {
    const meta = currentMeta();
    const ds = currentInstance();
    const op = meta.ops.find(function (candidate) { return candidate.id === opId; });
    if (!op) {
      return;
    }

    const resolved = resolveValue(op);
    if (resolved.errorKey) {
      pushLog(op.labelKey, resolved.errorKey, resolved.errorVars, false);
      flashError();
      return;
    }

    const takesValue = op.kind === 'add' || op.needsValue === true;
    const result = takesValue ? ds[opId](resolved.value) : ds[opId]();
    state.focusPos = null;

    const autoFilled = resolved.auto && result.ok;
    pushLog(
      op.labelKey,
      result.key,
      result.vars,
      result.ok,
      autoFilled ? 'log.autoFilled' : null,
      autoFilled ? { value: resolved.value } : null
    );

    // A search miss is a real answer, not a failure, so the trace plays even
    // when result.ok is false.
    if (result.trace) {
      clearSearch();
      playSearch(result.trace);
      return;
    }

    if (!result.ok) {
      flashError();
      refresh();
      return;
    }

    clearSearch();
    if (typeof result.peekIndex === 'number') {
      refresh({ peekIndex: result.peekIndex });
    } else if (typeof result.removedIndex === 'number') {
      refresh({
        ghost: {
          atIndex: result.removedIndex,
          value: result.removedValue,
          role: result.removedRole || 'leaving'
        }
      });
      scheduleSettle();
    } else if (typeof result.addedIndex === 'number') {
      refresh({ enteringIndex: result.addedIndex });
    } else {
      refresh();
    }
  }

  // Clicking a pointer field walks the list one hop. Clicking the same target
  // again clears the highlight.
  function followPointer(pos) {
    state.focusPos = state.focusPos === pos ? null : pos;
    refresh();
  }

  // A search result is not a single new state like the other operations, it is a
  // run of comparisons. Replay them on a timer so the cells light up in the same
  // order the C++ loop would visit them, then leave the last frame on screen.
  function playSearch(trace) {
    state.search = { trace: trace, step: null };
    const frames = trace.steps.concat([{
      done: true,
      found: trace.found,
      index: trace.index,
      mid: trace.mid,
      checks: trace.checks
    }]);

    let i = 0;
    function advance() {
      if (i >= frames.length) {
        state.searchTimer = null;
        return;
      }
      state.search.step = frames[i];
      i++;
      refresh();
      state.searchTimer = i < frames.length ? setTimeout(advance, 620) : null;
    }
    advance();
  }

  function clearSearch() {
    if (state.searchTimer) {
      clearTimeout(state.searchTimer);
      state.searchTimer = null;
    }
    state.search = null;
  }

  function scheduleSettle() {
    if (state.settleTimer) {
      clearTimeout(state.settleTimer);
    }
    state.settleTimer = setTimeout(function () {
      state.settleTimer = null;
      refresh();
    }, 480);
  }

  function flashError() {
    dom.stage.classList.remove('is-error');
    void dom.stage.offsetWidth;
    dom.stage.classList.add('is-error');
    setTimeout(function () { dom.stage.classList.remove('is-error'); }, 600);
  }

  function fillRandom() {
    const meta = currentMeta();
    const ds = currentInstance();
    const addOp = meta.ops.find(function (op) { return op.kind === 'add'; });
    if (!addOp) {
      return;
    }

    const target = meta.usesCapacity ? Math.max(2, ds.capacity - 2) : 4;
    let added = 0;
    for (let i = 0; i < target * 3 && added < target; i++) {
      const value = 1 + Math.floor(Math.random() * 99);
      const result = ds[addOp.id](value);
      if (result.ok) {
        added++;
      }
    }
    pushLog('log.fill', 'log.fillMsg', { count: added }, added > 0);
    refresh();
  }

  function clearStructure() {
    state.focusPos = null;
    clearSearch();
    currentInstance().reset();
    pushLog('log.clear', 'log.clearMsg', null, true);
    refresh();
  }

  function setCapacity(next) {
    const meta = currentMeta();
    state.focusPos = null;
    state.instances[meta.id] = meta.create(next);
    clearSearch();
    pushLog('log.capacity', 'log.capacityMsg', { nameKey: meta.nameKey, capacity: next }, true);
    refresh();
  }

  function refresh(options) {
    const opts = options || {};
    const ds = currentInstance();
    const model = ds.describe();

    if (opts.ghost) {
      model.ghost = opts.ghost;
    }
    if (typeof opts.enteringIndex === 'number') {
      model.enteringIndex = opts.enteringIndex;
    }
    if (typeof opts.peekIndex === 'number') {
      model.peekIndex = opts.peekIndex;
    }
    if (state.search) {
      model.search = state.search;
    }
    model.focusPos = state.focusPos;
    model.onFollow = followPointer;

    dom.viz.innerHTML = '';
    dom.viz.appendChild(window.Renderers.render(model));

    renderChips(model);
    dom.raw.textContent = ds.toText();
    dom.insight.textContent = t(model.noteKey, model.noteVars);
    dom.value.placeholder = t('value.placeholder', { n: state.autoValue });

    if (currentMeta().usesCapacity) {
      dom.capacity.value = String(ds.capacity);
    }
  }

  function renderChips(model) {
    const chips = [{ labelKey: 'chip.size', value: model.size }];

    if (model.capacity !== undefined) {
      chips.push({ labelKey: 'chip.capacity', value: model.capacity });
    }
    if (model.top !== undefined) {
      chips.push({ labelKey: 'chip.top', value: model.top });
    }
    if (model.front !== undefined) {
      chips.push({ labelKey: 'chip.front', value: model.front });
    }
    if (model.rear !== undefined) {
      chips.push({ labelKey: 'chip.rear', value: model.rear });
    }
    if (model.nodes) {
      chips.push({
        labelKey: 'chip.head',
        value: model.nodes.length ? model.nodes[0].value : 'nullptr'
      });
      chips.push({
        labelKey: 'chip.tail',
        value: model.nodes.length ? model.nodes[model.nodes.length - 1].value : 'nullptr'
      });
    }

    dom.chips.innerHTML = '';
    chips.forEach(function (chip) {
      const node = document.createElement('div');
      node.className = 'chip';
      const label = document.createElement('span');
      label.className = 'chip-label';
      label.textContent = t(chip.labelKey);
      const value = document.createElement('span');
      value.className = 'chip-value';
      value.textContent = String(chip.value);
      node.appendChild(label);
      node.appendChild(value);
      dom.chips.appendChild(node);
    });
  }

  function pushLog(labelKey, messageKey, vars, ok, extraKey, extraVars) {
    state.logEntries.unshift({
      labelKey: labelKey,
      messageKey: messageKey,
      vars: vars || null,
      ok: ok,
      extraKey: extraKey || null,
      extraVars: extraVars || null,
      time: new Date()
    });
    if (state.logEntries.length > 60) {
      state.logEntries.pop();
    }
    renderLog();
  }

  function renderLog() {
    dom.log.innerHTML = '';
    state.logEntries.forEach(function (entry) {
      const item = document.createElement('li');
      item.className = 'log-item ' + (entry.ok ? 'is-ok' : 'is-error');

      const head = document.createElement('div');
      head.className = 'log-head';
      head.appendChild(elText('span', 'log-op', t(entry.labelKey)));
      head.appendChild(elText('span', 'log-time', formatTime(entry.time)));

      const vars = entry.vars ? Object.assign({}, entry.vars) : null;
      if (vars && vars.nameKey) {
        vars.name = t(vars.nameKey);
        delete vars.nameKey;
      }

      item.appendChild(head);
      item.appendChild(elText(
        'p',
        'log-message',
        t(entry.messageKey, vars) + (entry.extraKey ? t(entry.extraKey, entry.extraVars) : '')
      ));
      dom.log.appendChild(item);
    });

    if (state.logEntries.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'log-empty';
      empty.textContent = t('log.empty');
      dom.log.appendChild(empty);
    }
  }

  function elText(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function formatTime(date) {
    // Latin digits in both languages so times match the numbers shown elsewhere.
    const locale = I18n.getLang() === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB';
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  function bindEvents() {
    dom.value.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') {
        return;
      }
      const meta = currentMeta();
      const addOp = meta.ops.find(function (op) { return op.kind === 'add'; });
      if (addOp) {
        runOp(addOp.id);
      }
    });

    dom.capacity.addEventListener('change', function () {
      const next = Number(dom.capacity.value);
      if (Number.isInteger(next) && next >= 2 && next <= 12) {
        setCapacity(next);
      } else {
        dom.capacity.value = String(currentInstance().capacity);
      }
    });

    dom.fill.addEventListener('click', fillRandom);
    dom.clear.addEventListener('click', clearStructure);

    dom.langToggle.addEventListener('click', function () {
      I18n.toggle();
    });

    document.addEventListener('languagechange', function () {
      I18n.translateStatic();
      buildControls();
      renderLog();
      refresh();
    });

    dom.tabs.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
      }
      event.preventDefault();
      const index = CATALOG.findIndex(function (item) { return item.id === state.activeId; });
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = (index + step + CATALOG.length) % CATALOG.length;
      selectStructure(CATALOG[next].id);
      document.getElementById('tab-' + CATALOG[next].id).focus();
    });
  }

  function init() {
    I18n.init();
    I18n.translateStatic();
    cacheDom();
    buildTabs();
    bindEvents();
    const fromHash = window.location.hash.slice(1);
    selectStructure(META[fromHash] ? fromHash : state.activeId);
    window.addEventListener('hashchange', function () {
      const id = window.location.hash.slice(1);
      if (META[id] && id !== state.activeId) {
        selectStructure(id);
      }
    });
    pushLog('log.ready', 'log.readyMsg', null, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
