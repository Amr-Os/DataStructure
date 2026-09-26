(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const t = function (key, vars) { return window.I18n.t(key, vars); };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined && text !== null) {
      node.textContent = String(text);
    }
    return node;
  }

  function svgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  const ROLE_TAGS = {
    top: 'tag.top',
    front: 'tag.front',
    rear: 'tag.rear',
    frontrear: 'tag.frontRear',
    wasted: 'tag.wasted',
    used: '',
    empty: '',
    leaving: 'tag.leaving'
  };

  // One line under the diagram telling what peek() just read, plus the outline
  // on the element itself.
  function applyPeek(items, model) {
    if (typeof model.peekIndex !== 'number') {
      return;
    }
    items.forEach(function (item, position) {
      if (position === model.peekIndex && !item.leaving) {
        item.peeked = true;
      }
    });
  }

  function buildPeekReadout(model, items) {
    if (typeof model.peekIndex !== 'number') {
      return null;
    }
    const box = el('div', 'peek-readout');
    const hit = items[model.peekIndex];
    box.appendChild(el('span', 'peek-readout-tag', t('tag.peek')));
    box.appendChild(el('span', 'peek-readout-text',
      t('viz.peekReadout', { value: hit && hit.value !== null ? hit.value : '·' })));
    return box;
  }

  function withGhostCells(model) {
    const cells = model.cells.slice();
    if (!model.ghost || typeof model.ghost.atIndex !== 'number') {
      return cells;
    }
    const at = model.ghost.atIndex;
    if (at < 0 || at >= cells.length) {
      return cells;
    }
    // The slot still exists in the array, so the leaving value takes over that
    // slot instead of adding an extra one.
    cells[at] = {
      index: at,
      value: model.ghost.value,
      role: model.ghost.role || 'leaving',
      leaving: true
    };
    return cells;
  }

  function withGhostNodes(model) {
    const nodes = model.nodes.slice();
    if (!model.ghost || typeof model.ghost.atIndex !== 'number') {
      return nodes;
    }
    const at = model.ghost.atIndex;
    const ghost = {
      id: 'ghost',
      value: model.ghost.value,
      leaving: true
    };
    if (at <= 0) {
      nodes.unshift(ghost);
    } else if (at >= nodes.length) {
      nodes.push(ghost);
    } else {
      nodes.splice(at, 0, ghost);
    }
    return nodes;
  }

  function markEntering(items, index) {
    if (typeof index !== 'number' || index < 0 || index >= items.length) {
      return;
    }
    items.forEach(function (item, position) {
      if (!item.leaving && position === index) {
        item.entering = true;
      }
    });
  }

  function buildCell(cell, extraClass) {
    const classes = ['cell', 'is-' + cell.role];
    if (cell.entering) {
      classes.push('is-entering');
    }
    if (cell.leaving) {
      classes.push('is-leaving');
    }
    if (cell.peeked) {
      classes.push('is-peek');
    }
    if (extraClass) {
      classes.push(extraClass);
    }
    const node = el('div', classes.join(' '));

    const tagKey = ROLE_TAGS[cell.role];
    if (tagKey) {
      node.appendChild(el('span', 'cell-tag', t(tagKey)));
    }
    if (cell.peeked) {
      node.appendChild(el('span', 'cell-tag is-peek', t('tag.peek')));
    }
    node.appendChild(el('span', 'cell-idx', cell.index));
    node.appendChild(el('span', 'cell-val', cell.value === null ? '·' : cell.value));
    return node;
  }

  function renderCells(model) {
    const cells = withGhostCells(model);
    cells.forEach(function (cell) { cell.slot = cell.index; });
    markEntering(cells, model.enteringIndex);
    applyPeek(cells, model);

    const vertical = model.orientation === 'vertical';
    const root = el('div', 'viz viz-cells ' + (vertical ? 'is-vertical' : 'is-horizontal'));
    const holder = vertical ? el('div', 'viz-stack') : root;

    cells.forEach(function (cell) {
      holder.appendChild(buildCell(cell));
    });

    if (vertical) {
      root.appendChild(holder);
      const axis = el('div', 'viz-axis');
      axis.appendChild(el('span', 'viz-axis-label', 'arr[0]'));
      axis.appendChild(el('span', 'viz-axis-line'));
      axis.appendChild(el('span', 'viz-axis-label', 'arr[' + (model.capacity - 1) + ']'));
      root.appendChild(axis);
    } else {
      root.appendChild(el('div', 'viz-caption', t('viz.linearCaption')));
    }
    const readout = buildPeekReadout(model, cells);
    if (readout) {
      root.appendChild(readout);
    }
    return root;
  }

  function angleFor(index, capacity) {
    return (-90 + (360 / capacity) * index) * Math.PI / 180;
  }

  function renderStrip(cells) {
    const strip = el('div', 'strip');
    strip.appendChild(el('div', 'strip-title', t('viz.stripTitle')));
    const row = el('div', 'strip-row');
    cells.forEach(function (cell) {
      row.appendChild(buildCell(cell, 'is-strip'));
    });
    strip.appendChild(row);
    return strip;
  }

  function renderRing(model) {
    const cells = withGhostCells(model);
    cells.forEach(function (cell) { cell.slot = cell.index; });
    markEntering(cells, model.enteringIndex);
    applyPeek(cells, model);

    const capacity = model.capacity;
    const size = 380;
    const radius = 138;
    const cx = size / 2;
    const cy = size / 2;

    const frontCell = cells.find(function (c) { return c.role === 'front' || c.role === 'frontrear'; });
    const rearCell = cells.find(function (c) { return c.role === 'rear' || c.role === 'frontrear'; });
    const usedCount = cells.filter(function (c) { return c.role !== 'empty'; }).length;

    const svg = svgEl('svg', { viewBox: '0 0 ' + size + ' ' + size, class: 'ring-svg' });
    svg.appendChild(svgEl('circle', {
      cx: cx, cy: cy, r: radius, class: 'ring-track'
    }));

    if (frontCell && rearCell && usedCount > 1) {
      const start = angleFor(frontCell.index, capacity);
      const sweepDegrees = ((rearCell.index - frontCell.index + capacity) % capacity) * (360 / capacity);
      const end = start + sweepDegrees * Math.PI / 180;
      const x1 = cx + radius * Math.cos(start);
      const y1 = cy + radius * Math.sin(start);
      const x2 = cx + radius * Math.cos(end);
      const y2 = cy + radius * Math.sin(end);
      const largeArc = sweepDegrees > 180 ? 1 : 0;

      const arc = svgEl('path', {
        d: 'M ' + x1 + ' ' + y1 + ' A ' + radius + ' ' + radius + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2,
        class: 'ring-arc'
      });
      svg.appendChild(arc);

      if (usedCount < capacity) {
        const defs = svgEl('defs', {});
        const marker = svgEl('marker', {
          id: 'ring-arrow',
          viewBox: '0 0 10 10',
          refX: 6,
          refY: 5,
          markerWidth: 5,
          markerHeight: 5,
          orient: 'auto-start-reverse'
        });
        marker.appendChild(svgEl('path', { d: 'M 0 1 L 9 5 L 0 9 z', class: 'ring-arrow-head' }));
        defs.appendChild(marker);
        svg.appendChild(defs);
        arc.setAttribute('marker-end', 'url(#ring-arrow)');
      }
    }

    const ring = el('div', 'viz-ring');
    ring.appendChild(svg);

    cells.forEach(function (cell) {
      const angle = angleFor(cell.index, capacity);
      const cellEl = buildCell(cell, 'is-ring');
      cellEl.style.left = (cx + radius * Math.cos(angle)) + 'px';
      cellEl.style.top = (cy + radius * Math.sin(angle)) + 'px';
      ring.appendChild(cellEl);
    });

    const center = el('div', 'ring-center');
    center.appendChild(el('span', 'ring-count', usedCount + ' / ' + capacity));
    const ringLabel = usedCount === capacity ? 'viz.ringFull'
      : (usedCount === 0 ? 'viz.ringEmpty' : 'viz.ringUsed');
    center.appendChild(el('span', 'ring-label', t(ringLabel)));
    ring.appendChild(center);

    const wrap = el('div', 'viz viz-ring-wrap');
    wrap.appendChild(ring);
    wrap.appendChild(el('div', 'viz-caption', t('viz.ringCaption', { last: capacity - 1 })));
    const readout = buildPeekReadout(model, cells);
    if (readout) {
      wrap.appendChild(readout);
    }
    wrap.appendChild(renderStrip(cells));
    return wrap;
  }

  function slot(kind, value) {
    return el('span', 'slot slot-' + kind, value === null || value === undefined ? '·' : value);
  }

  function makeNode(node, options) {
    const classes = ['node'];
    if (options.mode === 'backward') {
      classes.push('is-reversed');
    }
    if (node.entering) {
      classes.push('is-entering');
    }
    if (node.leaving) {
      classes.push('is-leaving');
    }
    if (options.focused) {
      classes.push('is-focused');
    }
    const box = el('div', classes.join(' '));

    // A pointer field that names another node becomes a link you can click, so
    // the diagram can be walked by following the pointers one hop at a time.
    let ptrSlot;
    if (options.pointerPos) {
      ptrSlot = slot('ptr', options.pointerLabel);
      ptrSlot.classList.add('is-followable');
      ptrSlot.setAttribute('role', 'button');
      ptrSlot.tabIndex = 0;
      ptrSlot.title = t('viz.followPointer', { target: 'n' + options.pointerPos });
      ptrSlot.setAttribute('aria-label', t('viz.followPointer', { target: 'n' + options.pointerPos }));
      const follow = function (event) {
        event.stopPropagation();
        if (options.onFollow) {
          options.onFollow(options.pointerPos);
        }
      };
      ptrSlot.addEventListener('click', follow);
      ptrSlot.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          follow(event);
        }
      });
    } else {
      ptrSlot = slot('ptr', options.pointerLabel);
    }

    if (options.mode === 'backward') {
      box.appendChild(ptrSlot);
      box.appendChild(slot('data', node.value));
    } else {
      box.appendChild(slot('data', node.value));
      box.appendChild(ptrSlot);
    }
    if (options.addrLabel) {
      box.appendChild(el('span', 'node-addr', options.addrLabel));
    }
    return box;
  }

  function makeArrow(direction, tag, target, isNull) {
    const classes = ['link', direction === 'left' ? 'is-left' : 'is-right'];
    if (isNull) {
      classes.push('is-null');
    }
    const link = el('div', classes.join(' '));
    link.appendChild(el('span', 'link-tag', tag));
    link.appendChild(el('span', 'link-shaft'));
    link.appendChild(el('span', 'link-head'));
    if (isNull) {
      link.appendChild(el('span', 'link-target', target));
    }
    return link;
  }

  function badge(kind) {
    return el('span', 'badge badge-' + kind, t('badge.' + kind));
  }

  // Position of every displayed node among the real nodes, so the head node is
  // always called n1 no matter which order values were inserted in.
  function positions(nodes) {
    const map = [];
    let position = 0;
    nodes.forEach(function (node) {
      if (node.leaving) {
        map.push(0);
      } else {
        position++;
        map.push(position);
      }
    });
    return map;
  }

  // Display position of whatever a pointer points at, or 0 when it is null or
  // pointing at a node that is on its way out.
  function pointerPos(nodes, pos, target) {
    if (target < 0 || target >= nodes.length) {
      return 0;
    }
    return pos[target] || 0;
  }

  function pointerTo(nodes, pos, target) {
    if (target < 0 || target >= nodes.length) {
      return 'nullptr';
    }
    return pos[target] === 0 ? '—' : 'n' + pos[target];
  }

  function renderList(model) {
    const nodes = withGhostNodes(model);
    markEntering(nodes, model.enteringIndex);

    const root = el('div', 'viz viz-list');
    if (nodes.length === 0) {
      const empty = el('div', 'viz-empty');
      empty.appendChild(el('span', 'viz-empty-title', t('viz.emptyList')));
      empty.appendChild(el('span', 'viz-empty-sub', 'head = tail = nullptr'));
      root.appendChild(empty);
      return root;
    }

    const pos = positions(nodes);
    const row = el('div', 'list-row');
    row.appendChild(badge('head'));
    nodes.forEach(function (node, index) {
      if (index > 0) {
        row.appendChild(makeArrow('right', 'next', pointerTo(nodes, pos, index), node.leaving || nodes[index - 1].leaving));
      }
      row.appendChild(makeNode(node, {
        mode: 'forward',
        pointerLabel: node.leaving ? '·' : pointerTo(nodes, pos, index + 1),
        pointerPos: node.leaving ? 0 : pointerPos(nodes, pos, index + 1),
        focused: model.focusPos === pos[index] && pos[index] !== 0,
        onFollow: model.onFollow,
        addrLabel: pos[index] === 0 ? null : 'n' + pos[index]
      }));
    });
    row.appendChild(badge('tail'));
    root.appendChild(row);
    root.appendChild(el('div', 'viz-caption', t('viz.listCaption')));
    return root;
  }

  function renderDoublyList(model) {
    const nodes = withGhostNodes(model);
    markEntering(nodes, model.enteringIndex);

    const root = el('div', 'viz viz-dlist');
    if (nodes.length === 0) {
      const empty = el('div', 'viz-empty');
      empty.appendChild(el('span', 'viz-empty-title', t('viz.emptyList')));
      empty.appendChild(el('span', 'viz-empty-sub', 'head = tail = nullptr'));
      root.appendChild(empty);
      return root;
    }

    const pos = positions(nodes);

    const forward = el('div', 'list-row is-forward');
    forward.appendChild(badge('head'));
    nodes.forEach(function (node, index) {
      if (index > 0) {
        forward.appendChild(makeArrow('right', 'next', pointerTo(nodes, pos, index), node.leaving || nodes[index - 1].leaving));
      }
      forward.appendChild(makeNode(node, {
        mode: 'forward',
        pointerLabel: node.leaving ? '·' : pointerTo(nodes, pos, index + 1),
        pointerPos: node.leaving ? 0 : pointerPos(nodes, pos, index + 1),
        focused: model.focusPos === pos[index] && pos[index] !== 0,
        onFollow: model.onFollow,
        addrLabel: pos[index] === 0 ? null : 'n' + pos[index]
      }));
    });
    forward.appendChild(badge('tail'));

    const backward = el('div', 'list-row is-backward');
    backward.appendChild(badge('head'));
    nodes.forEach(function (node, index) {
      if (index > 0) {
        backward.appendChild(makeArrow('left', 'prev', pointerTo(nodes, pos, index), node.leaving || nodes[index - 1].leaving));
      }
      backward.appendChild(makeNode(node, {
        mode: 'backward',
        pointerLabel: node.leaving ? '·' : pointerTo(nodes, pos, index - 1),
        pointerPos: node.leaving ? 0 : pointerPos(nodes, pos, index - 1),
        focused: model.focusPos === pos[index] && pos[index] !== 0,
        onFollow: model.onFollow,
        addrLabel: pos[index] === 0 ? null : 'n' + pos[index]
      }));
    });
    backward.appendChild(badge('tail'));

    root.appendChild(el('div', 'dlist-label is-forward', t('viz.dlistForward')));
    root.appendChild(forward);
    root.appendChild(el('div', 'dlist-label is-backward', t('viz.dlistBackward')));
    root.appendChild(backward);
    return root;
  }

  // ---------------------------------------------------------------- searching
  // A search plays back its comparison trace one step at a time, so the cells
  // light up in the same order the C++ loop would visit them.
  function searchRoleFor(variant, step, index, count) {
    if (!step) {
      return null;
    }

    if (variant === 'linear') {
      if (step.done) {
        if (step.found && index === step.index) {
          return 'hit';
        }
        return index < count ? 'checked' : null;
      }
      if (index < step.index) {
        return 'checked';
      }
      if (index === step.index) {
        return step.hit ? 'hit' : 'comparing';
      }
      return null;
    }

    if (step.done) {
      return step.found && index === step.mid ? 'hit' : 'out';
    }
    if (index >= step.low && index <= step.high) {
      return index === step.mid ? 'comparing' : 'inrange';
    }
    return 'out';
  }

  function searchTagsFor(variant, step, index) {
    const tags = [];
    if (!step) {
      return tags;
    }
    if (variant === 'linear') {
      if (!step.done && index === step.index) {
        tags.push({ text: t('tag.compare'), kind: 'compare' });
      }
      if (step.done && step.found && index === step.index) {
        tags.push({ text: t('tag.hit'), kind: 'hit' });
      }
      return tags;
    }
    if (step.done) {
      if (step.found && index === step.mid) {
        tags.push({ text: t('tag.hit'), kind: 'hit' });
      }
      return tags;
    }
    if (index === step.low) {
      tags.push({ text: t('tag.low'), kind: 'low' });
    }
    if (index === step.mid) {
      tags.push({ text: t('tag.compare'), kind: 'compare' });
      tags.push({ text: t('tag.mid'), kind: 'mid' });
    }
    if (index === step.high) {
      tags.push({ text: t('tag.high'), kind: 'high' });
    }
    return tags;
  }

  function searchStepText(variant, trace) {
    const step = trace.step;
    if (!step) {
      return t('viz.searchLegend' + (variant === 'binary' ? 'Binary' : 'Linear'));
    }
    if (step.done) {
      if (step.found) {
        return t('viz.searchDoneFound', {
          key: trace.key,
          index: step.index !== undefined ? step.index : step.mid,
          checks: trace.checks
        });
      }
      return t('viz.searchDoneMiss', { key: trace.key });
    }
    if (variant === 'linear') {
      return t('viz.searchLinearStep', {
        index: step.index,
        value: step.value !== undefined ? step.value : '·',
        key: trace.key
      });
    }
    if (step.outcome === 'right') {
      return t('viz.searchGoRight', { value: step.value, key: trace.key });
    }
    if (step.outcome === 'left') {
      return t('viz.searchGoLeft', { value: step.value, key: trace.key });
    }
    return t('viz.searchBinaryStep', {
      low: step.low,
      high: step.high,
      mid: step.mid,
      value: step.value
    });
  }

  function buildSearchCell(cell, tags) {
    const node = el('div', 'cell' + (cell.entering ? ' is-entering' : '') + ' is-' + cell.role);
    node.appendChild(el('span', 'cell-idx', cell.index));
    node.appendChild(el('span', 'cell-val', cell.value === null ? '·' : cell.value));

    const ordered = tags.filter(function (tag) { return tag.kind !== 'mid' && tag.kind !== 'compare'; });
    const above = tags.filter(function (tag) { return tag.kind === 'mid' || tag.kind === 'compare'; });
    ordered.forEach(function (tag) {
      node.appendChild(el('span', 'cell-tag is-' + tag.kind, tag.text));
    });
    above.forEach(function (tag) {
      node.appendChild(el('span', 'cell-tag is-top-tag is-' + tag.kind, tag.text));
    });
    return node;
  }

  function renderSearch(model) {
    const cells = model.cells.slice();
    const state = model.search;
    const step = state ? state.step : null;
    const trace = state ? state.trace : null;
    const count = model.size;

    cells.forEach(function (cell) { cell.slot = cell.index; });
    markEntering(cells, model.enteringIndex);

    const root = el('div', 'viz viz-search is-' + model.variant);

    cells.forEach(function (cell, index) {
      const role = searchRoleFor(model.variant, step, index, count);
      const shaped = role ? Object.assign({}, cell, { role: role }) : cell;
      root.appendChild(buildSearchCell(shaped, searchTagsFor(model.variant, step, index)));
    });

    root.appendChild(el('div', 'viz-caption', searchStepText(model.variant, {
      step: step,
      key: trace ? trace.key : null,
      checks: trace ? trace.checks : 0
    })));

    if (trace && step && step.done) {
      const box = el('div', 'peek-readout is-' + (step.found ? 'ok' : 'miss'));
      box.appendChild(el('span', 'peek-readout-tag', t('op.search')));
      box.appendChild(el('span', 'peek-readout-text', searchStepText(model.variant, {
        step: step,
        key: trace.key,
        checks: trace.checks
      })));
      root.appendChild(box);
    }

    return root;
  }

  window.Renderers = {
    render: function (model) {
      if (model.kind === 'cells') {
        return renderCells(model);
      }
      if (model.kind === 'ring') {
        return renderRing(model);
      }
      if (model.kind === 'dlist') {
        return renderDoublyList(model);
      }
      if (model.kind === 'search') {
        return renderSearch(model);
      }
      return renderList(model);
    }
  };
})();
