// Request pointer lock only from a real click in active gameplay.
(() => {
  const canvas = document.getElementById('canvas');
  let wanted = false;
  let ready = false;
  let pending = false;
  const locked = () => document.pointerLockElement === canvas;
  function request(event) {
    if (!wanted || !ready || locked() || pending) return;
    // Consume the capture click so it does not also use the held tool.
    event.preventDefault();
    event.stopImmediatePropagation();
    canvas.focus();
    if (!canvas.requestPointerLock) return;
    pending = true;
    try {
      const result = canvas.requestPointerLock();
      result?.catch(error => { pending = false; console.warn('Mouse capture:', error.message); });
    } catch (error) { pending = false; console.warn('Mouse capture:', error.message); }
  }
  canvas.addEventListener('mousedown', request, true);
  document.addEventListener('pointerlockchange', () => { pending = false; });
  document.addEventListener('pointerlockerror', () => { pending = false; });
  window.FTNPointer = {
    isLocked: locked,
    setReady(value) { ready = !!value; },
    setWanted(value) {
      wanted = !!value;
      if (!wanted && locked()) document.exitPointerLock();
    }
  };
})();
