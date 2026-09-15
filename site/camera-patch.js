{
  const patchToast = (message) => {
    try { toast(message); return; } catch (_) {}
    const el = document.querySelector('#toast');
    if (el) { el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 3200); }
  };

  const cameraErrorMessage = (err) => {
    const name = err?.name || '';
    if (name === 'NotAllowedError' || name === 'SecurityError') return 'دسترسی دوربین مسدود شده؛ اجازه Camera را برای این سایت فعال کن.';
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'دوربینی روی این دستگاه پیدا نشد.';
    if (name === 'NotReadableError' || name === 'TrackStartError') return 'دوربین در برنامه دیگری در حال استفاده است؛ آن برنامه را ببند و دوباره امتحان کن.';
    if (name === 'OverconstrainedError') return 'تنظیمات دوربین با این دستگاه سازگار نیست؛ دوباره تلاش کن.';
    return `دوربین باز نشد${name ? ` (${name})` : ''}.`;
  };

  const resetCameraUi = () => {
    const stage = document.querySelector('#cameraStage');
    const button = document.querySelector('#cameraBtn');
    const pause = document.querySelector('#pauseBtn');
    stage?.classList.remove('camera-on');
    if (button) { button.disabled = false; button.textContent = 'فعال‌کردن دوربین'; }
    if (pause) { pause.disabled = true; pause.textContent = 'توقف اسکن'; }
  };

  const patchStopCamera = () => {
    try {
      if (state.timer) clearTimeout(state.timer);
      state.timer = null;
      state.scanning = false;
      if (state.stream) state.stream.getTracks().forEach(track => track.stop());
      state.stream = null;
      const video = document.querySelector('#video');
      if (video) { video.pause(); video.srcObject = null; }
    } catch (err) { console.warn('camera stop:', err); }
    resetCameraUi();
  };

  const waitForVideo = (video) => new Promise((resolve) => {
    if (video.readyState >= 2 && video.videoWidth > 0) return resolve();
    let settled = false;
    const done = () => { if (settled) return; settled = true; video.removeEventListener('loadedmetadata', done); resolve(); };
    video.addEventListener('loadedmetadata', done, { once: true });
    setTimeout(done, 2500);
  });

  const requestStream = async () => {
    const preferred = {
      audio: false,
      video: {
        facingMode: { ideal: state.facing || 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
    try {
      return await navigator.mediaDevices.getUserMedia(preferred);
    } catch (firstError) {
      // Some desktop browsers reject facingMode even when a webcam exists.
      if (firstError?.name === 'NotAllowedError' || firstError?.name === 'SecurityError') throw firstError;
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
  };

  const patchStartCamera = async () => {
    const button = document.querySelector('#cameraBtn');
    const heroButton = document.querySelector('#startCameraHero');
    const video = document.querySelector('#video');
    if (!video) return;

    if (!window.isSecureContext) {
      patchToast('برای دوربین باید سایت با HTTPS باز شود.');
      return;
    }
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      patchToast('این مرورگر دسترسی استاندارد به دوربین را پشتیبانی نمی‌کند.');
      return;
    }

    if (state.stream) { patchStopCamera(); return; }

    if (button) { button.disabled = true; button.textContent = 'در حال اتصال به دوربین…'; }
    if (heroButton) heroButton.disabled = true;
    patchToast('درخواست دسترسی به دوربین…');

    try {
      if (state.timer) clearTimeout(state.timer);
      state.scanning = false;
      const stream = await requestStream();
      state.stream = stream;

      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.muted = true;
      video.autoplay = true;
      video.srcObject = stream;
      await waitForVideo(video);
      try { await video.play(); } catch (playError) { console.warn('video.play:', playError); }

      document.querySelector('#cameraStage')?.classList.add('camera-on');
      if (button) { button.disabled = false; button.textContent = 'خاموش کردن دوربین'; }
      if (heroButton) heroButton.disabled = false;
      const pause = document.querySelector('#pauseBtn');
      if (pause) { pause.disabled = false; pause.textContent = 'توقف اسکن'; }

      state.scanning = true;
      scheduleScan(250);
      patchToast(state.session ? 'دوربین و اسکن AI فعال شد' : 'دوربین فعال شد؛ مدل AI در حال آماده‌سازی است');
    } catch (err) {
      console.error('Camera start failed:', err);
      if (state.stream) state.stream.getTracks().forEach(track => track.stop());
      state.stream = null;
      resetCameraUi();
      if (heroButton) heroButton.disabled = false;
      patchToast(cameraErrorMessage(err));
    }
  };

  const patchToggle = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    patchStartCamera();
  };

  const cameraButton = document.querySelector('#cameraBtn');
  const heroButton = document.querySelector('#startCameraHero');
  cameraButton?.addEventListener('click', patchToggle, true);
  heroButton?.addEventListener('click', patchToggle, true);

  document.querySelector('#cameraSwitchBtn')?.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    state.facing = state.facing === 'environment' ? 'user' : 'environment';
    if (state.stream) {
      patchStopCamera();
      await patchStartCamera();
    } else {
      patchToast(state.facing === 'environment' ? 'دوربین پشت انتخاب شد' : 'دوربین جلو انتخاب شد');
    }
  }, true);

  // Make the pause control resilient as well.
  document.querySelector('#pauseBtn')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!state.stream) return;
    state.scanning = !state.scanning;
    event.currentTarget.textContent = state.scanning ? 'توقف اسکن' : 'ادامه اسکن';
    if (state.scanning) scheduleScan(50); else if (state.timer) clearTimeout(state.timer);
  }, true);

  window.addEventListener('pagehide', () => {
    if (state.stream) state.stream.getTracks().forEach(track => track.stop());
  });

  console.info('Car Mechanic AR camera compatibility patch active');
}