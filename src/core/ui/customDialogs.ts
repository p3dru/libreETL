/**
 * customDialogs.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Sistema de diálogos customizados que respeita o tema do sistema (dark/light)
 * via CSS custom properties, com hierarquia visual de título/subtítulo/info/ação.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Injeta os keyframes de animação uma única vez ──────────────────────────── */
function injectAnimations() {
  if (document.getElementById('libreetl-dialog-styles')) return;
  const style = document.createElement('style');
  style.id = 'libreetl-dialog-styles';
  style.textContent = `
    @keyframes libreetl-overlay-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes libreetl-box-in {
      from { opacity: 0; transform: scale(0.92) translateY(12px); }
      to   { opacity: 1; transform: scale(1)    translateY(0);    }
    }
    @keyframes libreetl-overlay-out {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    @keyframes libreetl-box-out {
      from { opacity: 1; transform: scale(1)    translateY(0);    }
      to   { opacity: 0; transform: scale(0.92) translateY(12px); }
    }
    .libreetl-btn-primary:hover {
      filter: brightness(1.15);
      transform: translateY(-1px);
    }
    .libreetl-btn-secondary:hover {
      background: var(--secondary-hover) !important;
    }
    .libreetl-btn-danger:hover {
      filter: brightness(1.15);
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
}

/* ── Overlay ────────────────────────────────────────────────────────────────── */
function createOverlay(): HTMLDivElement {
  injectAnimations();
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'libreetl-overlay-in 0.2s ease forwards',
    fontFamily: 'inherit',
  });
  return overlay;
}

/* ── Dismiss helper (animates out, then removes) ────────────────────────────── */
function dismiss(overlay: HTMLDivElement, box: HTMLDivElement, cb: () => void) {
  overlay.style.animation = 'libreetl-overlay-out 0.18s ease forwards';
  box.style.animation     = 'libreetl-box-out 0.18s ease forwards';
  setTimeout(() => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    cb();
  }, 160);
}

/* ── Dialog box ─────────────────────────────────────────────────────────────── */
function createDialogBox(): HTMLDivElement {
  const box = document.createElement('div');
  Object.assign(box.style, {
    background: 'var(--background, #09090b)',
    border: '1px solid var(--surface-border, rgba(255,255,255,0.1))',
    borderRadius: 'var(--radius-lg, 16px)',
    padding: '0',
    width: '92%',
    maxWidth: '420px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--surface-border, rgba(255,255,255,0.06))',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    color: 'var(--foreground, #fafafa)',
    fontFamily: 'inherit',
    animation: 'libreetl-box-in 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards',
  });
  return box;
}

/* ── Header band (coloured top stripe + icon area) ─────────────────────────── */
type DialogVariant = 'default' | 'danger' | 'success' | 'warning' | 'info';

interface HeaderConfig {
  title: string;
  subtitle?: string;
  variant: DialogVariant;
  icon?: string; // emoji or single char
}

const VARIANT_COLORS: Record<DialogVariant, { accent: string; bg: string }> = {
  default: { accent: 'var(--primary, #6366f1)',  bg: 'rgba(99,102,241,0.08)' },
  danger:  { accent: 'var(--error, #ef4444)',    bg: 'rgba(239,68,68,0.08)'  },
  success: { accent: 'var(--success, #10b981)',  bg: 'rgba(16,185,129,0.08)' },
  warning: { accent: 'var(--warning, #f59e0b)',  bg: 'rgba(245,158,11,0.08)' },
  info:    { accent: 'var(--info, #3b82f6)',     bg: 'rgba(59,130,246,0.08)' },
};

const VARIANT_ICONS: Record<DialogVariant, string> = {
  default: '💬',
  danger:  '⚠️',
  success: '✅',
  warning: '⚡',
  info:    'ℹ️',
};

function createHeader({ title, subtitle, variant, icon }: HeaderConfig): HTMLDivElement {
  const { accent, bg } = VARIANT_COLORS[variant];
  const displayIcon = icon ?? VARIANT_ICONS[variant];

  const header = document.createElement('div');
  Object.assign(header.style, {
    padding: '1.5rem 1.5rem 1.25rem',
    borderBottom: '1px solid var(--surface-border, rgba(255,255,255,0.08))',
    background: bg,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  });

  // Icon badge
  const iconBadge = document.createElement('div');
  Object.assign(iconBadge.style, {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md, 10px)',
    background: accent,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    flexShrink: '0',
    boxShadow: `0 0 16px ${accent}44`,
  });
  iconBadge.textContent = displayIcon;

  // Text block
  const textBlock = document.createElement('div');
  Object.assign(textBlock.style, { flex: '1', minWidth: '0' });

  const titleEl = document.createElement('h3');
  Object.assign(titleEl.style, {
    fontSize: '1rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: 'var(--foreground, #fafafa)',
    margin: '0 0 0.15rem',
    lineHeight: '1.3',
  });
  titleEl.textContent = title;

  textBlock.appendChild(titleEl);

  if (subtitle) {
    const subtitleEl = document.createElement('p');
    Object.assign(subtitleEl.style, {
      fontSize: '0.78rem',
      color: accent,
      margin: '0',
      fontWeight: '500',
      letterSpacing: '0.01em',
    });
    subtitleEl.textContent = subtitle;
    textBlock.appendChild(subtitleEl);
  }

  header.appendChild(iconBadge);
  header.appendChild(textBlock);
  return header;
}

/* ── Body (message text) ────────────────────────────────────────────────────── */
function createBody(message: string): HTMLDivElement {
  const body = document.createElement('div');
  Object.assign(body.style, {
    padding: '1.25rem 1.5rem',
    fontSize: '0.9rem',
    lineHeight: '1.65',
    color: 'var(--foreground, #fafafa)',
    opacity: '0.85',
  });
  body.textContent = message;
  return body;
}

/* ── Input (for prompt) ─────────────────────────────────────────────────────── */
function createInput(defaultValue: string): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = defaultValue;
  Object.assign(input.style, {
    display: 'block',
    width: '100%',
    padding: '0.6rem 0.875rem',
    borderRadius: 'var(--radius-md, 10px)',
    border: '1.5px solid var(--surface-border, rgba(255,255,255,0.12))',
    background: 'var(--surface, rgba(24,24,27,0.6))',
    color: 'var(--foreground, #fafafa)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  });
  input.onfocus = () => {
    input.style.borderColor = 'var(--primary, #6366f1)';
    input.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
  };
  input.onblur = () => {
    input.style.borderColor = 'var(--surface-border, rgba(255,255,255,0.12))';
    input.style.boxShadow = 'none';
  };
  return input;
}

/* ── Input wrapper (inside body area) ──────────────────────────────────────── */
function createInputBody(message: string, defaultValue: string): { wrapper: HTMLDivElement; input: HTMLInputElement } {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, { padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' });

  const label = document.createElement('label');
  Object.assign(label.style, { fontSize: '0.85rem', color: 'var(--foreground, #fafafa)', opacity: '0.75', lineHeight: '1.5' });
  label.textContent = message;

  const input = createInput(defaultValue);

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  return { wrapper, input };
}

/* ── Footer (action buttons) ────────────────────────────────────────────────── */
function createFooter(): HTMLDivElement {
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    padding: '1rem 1.5rem 1.25rem',
    borderTop: '1px solid var(--surface-border, rgba(255,255,255,0.08))',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.6rem',
  });
  return footer;
}

/* ── Button factory ─────────────────────────────────────────────────────────── */
function createButton(text: string, role: 'primary' | 'secondary' | 'danger'): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = text;

  const baseStyles: Partial<CSSStyleDeclaration> = {
    padding: '0.5rem 1.1rem',
    borderRadius: 'var(--radius-md, 10px)',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    border: 'none',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
  };

  if (role === 'primary') {
    Object.assign(btn.style, {
      ...baseStyles,
      background: 'var(--primary, #6366f1)',
      color: '#ffffff',
      boxShadow: '0 0 20px rgba(99,102,241,0.35)',
    });
    btn.className = 'libreetl-btn-primary';
  } else if (role === 'danger') {
    Object.assign(btn.style, {
      ...baseStyles,
      background: 'var(--error, #ef4444)',
      color: '#ffffff',
      boxShadow: '0 0 20px rgba(239,68,68,0.35)',
    });
    btn.className = 'libreetl-btn-danger';
  } else {
    Object.assign(btn.style, {
      ...baseStyles,
      background: 'var(--secondary, #27272a)',
      color: 'var(--foreground, #fafafa)',
      border: '1px solid var(--surface-border, rgba(255,255,255,0.1))',
    });
    btn.className = 'libreetl-btn-secondary';
  }

  return btn;
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * PUBLIC API
 * ═══════════════════════════════════════════════════════════════════════════════ */

export interface AlertOptions {
  title?: string;
  subtitle?: string;
  variant?: DialogVariant;
  icon?: string;
  okLabel?: string;
}

export const customAlert = (
  message: string,
  options: AlertOptions = {}
): Promise<void> => {
  const {
    title = 'Aviso',
    subtitle,
    variant = 'default',
    icon,
    okLabel = 'OK',
  } = options;

  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    const header = createHeader({ title, subtitle, variant, icon });
    const body = createBody(message);
    const footer = createFooter();
    const btnOk = createButton(okLabel, 'primary');

    const close = () => dismiss(overlay, box, resolve);
    btnOk.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        document.removeEventListener('keydown', esc);
        close();
      }
    });

    footer.appendChild(btnOk);
    box.appendChild(header);
    box.appendChild(body);
    box.appendChild(footer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    setTimeout(() => btnOk.focus(), 50);
  });
};

export interface ConfirmOptions {
  title?: string;
  subtitle?: string;
  variant?: DialogVariant;
  icon?: string;
  okLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

export const customConfirm = (
  message: string,
  isDanger: boolean = false,
  options: ConfirmOptions = {}
): Promise<boolean> => {
  const {
    title = isDanger ? 'Confirmar ação' : 'Confirmar',
    subtitle = isDanger ? 'Esta ação não pode ser desfeita' : undefined,
    variant = isDanger ? 'danger' : 'default',
    icon,
    okLabel = isDanger ? 'Confirmar' : 'OK',
    cancelLabel = 'Cancelar',
  } = options;

  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    const header = createHeader({ title, subtitle, variant, icon });
    const body = createBody(message);
    const footer = createFooter();
    const btnCancel = createButton(cancelLabel, 'secondary');
    const btnOk = createButton(okLabel, isDanger ? 'danger' : 'primary');

    const closeWith = (val: boolean) => dismiss(overlay, box, () => resolve(val));
    btnCancel.onclick = () => closeWith(false);
    btnOk.onclick = () => closeWith(true);
    overlay.onclick = (e) => { if (e.target === overlay) closeWith(false); };
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { document.removeEventListener('keydown', esc); closeWith(false); }
    });

    footer.appendChild(btnCancel);
    footer.appendChild(btnOk);
    box.appendChild(header);
    box.appendChild(body);
    box.appendChild(footer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    setTimeout(() => btnOk.focus(), 50);
  });
};

export interface PromptOptions {
  title?: string;
  subtitle?: string;
  variant?: DialogVariant;
  icon?: string;
  okLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
}

export const customPrompt = (
  message: string,
  defaultValue: string = '',
  options: PromptOptions = {}
): Promise<string | null> => {
  const {
    title = 'Entrada de dados',
    subtitle,
    variant = 'default',
    icon,
    okLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
  } = options;

  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    const header = createHeader({ title, subtitle, variant, icon });
    const { wrapper, input } = createInputBody(message, defaultValue);
    const footer = createFooter();
    const btnCancel = createButton(cancelLabel, 'secondary');
    const btnOk = createButton(okLabel, 'primary');

    const submit = () => dismiss(overlay, box, () => resolve(input.value || null));
    const cancel = () => dismiss(overlay, box, () => resolve(null));

    btnCancel.onclick = cancel;
    btnOk.onclick = submit;
    overlay.onclick = (e) => { if (e.target === overlay) cancel(); };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') submit();
      if (e.key === 'Escape') cancel();
    };

    footer.appendChild(btnCancel);
    footer.appendChild(btnOk);
    box.appendChild(header);
    box.appendChild(wrapper);
    box.appendChild(footer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    setTimeout(() => { input.focus(); input.select(); }, 50);
  });
};

export interface ChoiceOption {
  label: string;
  value: string;
  isPrimary?: boolean;
  isDanger?: boolean;
}

export interface ChoiceOptions {
  title?: string;
  subtitle?: string;
  variant?: DialogVariant;
  icon?: string;
}

export const customChoice = (
  message: string,
  options: ChoiceOption[],
  dialogOptions: ChoiceOptions = {}
): Promise<string | null> => {
  const {
    title = 'Escolha uma opção',
    subtitle,
    variant = 'default',
    icon,
  } = dialogOptions;

  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    const header = createHeader({ title, subtitle, variant, icon });
    const body = createBody(message);
    const footer = createFooter();
    footer.style.flexWrap = 'wrap';

    const closeWith = (val: string | null) => dismiss(overlay, box, () => resolve(val));
    overlay.onclick = (e) => { if (e.target === overlay) closeWith(null); };
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { document.removeEventListener('keydown', esc); closeWith(null); }
    });

    options.forEach(opt => {
      const role: 'primary' | 'secondary' | 'danger' = opt.isDanger ? 'danger' : opt.isPrimary ? 'primary' : 'secondary';
      const btn = createButton(opt.label, role);
      btn.onclick = () => closeWith(opt.value);
      footer.appendChild(btn);
    });

    box.appendChild(header);
    box.appendChild(body);
    box.appendChild(footer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
};
