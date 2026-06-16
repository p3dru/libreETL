function createOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  return overlay;
}

function createDialogBox() {
  const box = document.createElement('div');
  box.style.background = '#1e293b';
  box.style.border = '1px solid #334155';
  box.style.padding = '1.5rem';
  box.style.borderRadius = '0.5rem';
  box.style.width = '90%';
  box.style.maxWidth = '400px';
  box.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
  box.style.display = 'flex';
  box.style.flexDirection = 'column';
  box.style.gap = '1.25rem';
  box.style.color = '#f8fafc';
  box.style.fontFamily = 'inherit';
  return box;
}

function createButton(text: string, isPrimary: boolean, isDanger: boolean = false) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.padding = '0.5rem 1rem';
  btn.style.borderRadius = '0.375rem';
  
  if (isPrimary) {
    btn.style.background = isDanger ? '#ef4444' : '#6366f1';
    btn.style.color = '#ffffff';
    btn.style.border = 'none';
  } else {
    btn.style.background = 'transparent';
    btn.style.color = '#e2e8f0';
    btn.style.border = '1px solid #334155';
  }
  
  btn.style.cursor = 'pointer';
  btn.style.fontWeight = '500';
  btn.style.transition = 'all 0.2s';
  return btn;
}

function createInput(defaultValue: string) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = defaultValue;
  input.style.width = '100%';
  input.style.padding = '0.6rem 0.75rem';
  input.style.borderRadius = '0.375rem';
  input.style.border = '1px solid #334155';
  input.style.background = 'rgba(0,0,0,0.2)';
  input.style.color = '#f8fafc';
  input.style.outline = 'none';
  input.style.fontFamily = 'inherit';
  
  input.onfocus = () => {
    input.style.borderColor = '#6366f1';
  };
  input.onblur = () => {
    input.style.borderColor = '#334155';
  };
  
  return input;
}

export const customAlert = (message: string): Promise<void> => {
  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    
    const text = document.createElement('div');
    text.textContent = message;
    text.style.lineHeight = '1.5';
    
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';
    
    const btnOk = createButton('OK', true);
    btnOk.onclick = () => {
      document.body.removeChild(overlay);
      resolve();
    };
    
    actions.appendChild(btnOk);
    box.appendChild(text);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    btnOk.focus();
  });
};

export const customConfirm = (message: string, isDanger: boolean = false): Promise<boolean> => {
  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    
    const text = document.createElement('div');
    text.textContent = message;
    text.style.lineHeight = '1.5';
    
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';
    actions.style.gap = '0.75rem';
    
    const btnCancel = createButton('Cancel', false);
    const btnOk = createButton('OK', true, isDanger);
    
    btnCancel.onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };
    btnOk.onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };
    
    actions.appendChild(btnCancel);
    actions.appendChild(btnOk);
    box.appendChild(text);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
};

export const customPrompt = (message: string, defaultValue: string = ''): Promise<string | null> => {
  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    
    const text = document.createElement('div');
    text.textContent = message;
    
    const input = createInput(defaultValue);
    
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';
    actions.style.gap = '0.75rem';
    
    const btnCancel = createButton('Cancel', false);
    const btnOk = createButton('OK', true);
    
    const submit = () => {
      document.body.removeChild(overlay);
      resolve(input.value);
    };
    
    btnCancel.onclick = () => {
      document.body.removeChild(overlay);
      resolve(null);
    };
    btnOk.onclick = submit;
    
    input.onkeydown = (e) => {
      if (e.key === 'Enter') submit();
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        resolve(null);
      }
    };
    
    actions.appendChild(btnCancel);
    actions.appendChild(btnOk);
    box.appendChild(text);
    box.appendChild(input);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      input.focus();
      input.select();
    }, 10);
  });
};

export const customChoice = (message: string, options: {label: string, value: string, isPrimary?: boolean}[]): Promise<string | null> => {
  return new Promise(resolve => {
    const overlay = createOverlay();
    const box = createDialogBox();
    
    const text = document.createElement('div');
    text.textContent = message;
    text.style.lineHeight = '1.5';
    
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';
    actions.style.gap = '0.75rem';
    actions.style.flexWrap = 'wrap';
    
    options.forEach(opt => {
      const btn = createButton(opt.label, !!opt.isPrimary);
      btn.onclick = () => {
        document.body.removeChild(overlay);
        resolve(opt.value);
      };
      actions.appendChild(btn);
    });
    
    box.appendChild(text);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
};
