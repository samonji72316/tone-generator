const frequencyRange = document.getElementById('frequencyRange');
const frequencyValue = document.getElementById('frequencyValue'); 
const volumeRange = document.getElementById('volumeRange');
const volumeValue = document.getElementById('volumeValue'); 
const sineWaveButton = document.getElementById('sineWave');
const squareWaveButton = document.getElementById('squareWave');
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');
const frequencyInput = document.getElementById('frequencyInput');
const volumeInput = document.getElementById('volumeInput');

let audioCtx;
let oscillator;
let gainNode;
let waveform = 'sine';

// 周波数スライダーの処理
frequencyRange.addEventListener('input', () => {
  const frequency = frequencyRange.value;
  frequencyValue.textContent = frequency;
  frequencyInput.value = frequency; // 入力ボックスの値も更新
  if (oscillator) {
    oscillator.frequency.value = frequency;
  }
});

// 音量スライダーの処理
volumeRange.addEventListener('input', () => {
  const volume = volumeRange.value;
  const volumePercent = Math.round(volume * 100);
  volumeValue.textContent = volumePercent;
  volumeInput.value = volumePercent; // 入力ボックスの値も更新
  if (gainNode) {
    gainNode.gain.value = volume; 
  }
});
// 波形ボタンの処理
sineWaveButton.addEventListener('click', () => {
  waveform = 'sine';
  sineWaveButton.classList.add('active');
  squareWaveButton.classList.remove('active');
  if (oscillator) {
    oscillator.type = waveform;
  }
});

squareWaveButton.addEventListener('click', () => {
  waveform = 'square';
  squareWaveButton.classList.add('active');
  sineWaveButton.classList.remove('active');
  if (oscillator) {
    oscillator.type = waveform;
  }
});

// 周波数入力欄の処理
frequencyInput.addEventListener('input', () => {
  let frequency = frequencyInput.value;
  // 入力値の範囲を制限
  frequency = Math.min(4000, Math.max(0, frequency));
  frequencyInput.value = frequency; 
  frequencyRange.value = frequency;
  frequencyValue.textContent = frequency;
  if (oscillator) {
    oscillator.frequency.value = frequency;
  }
});

// 音量入力欄の処理
volumeInput.addEventListener('input', () => {
  let volume = volumeInput.value;
  // 入力値の範囲を制限
  volume = Math.min(100, Math.max(0, volume));
  volumeInput.value = volume;
  volumeRange.value = volume / 100; 
  volumeValue.textContent = volume;
  if (gainNode) {
    gainNode.gain.value = volume / 100; 
  }
});

// 再生・停止ボタンの処理
function startAudio() {
  // 既に再生中の場合は処理を中断
  if (audioCtx && audioCtx.state === 'running') return;

  // 再生開始
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  oscillator.type = waveform;
  oscillator.frequency.value = frequencyRange.value; 
  gainNode.gain.value = volumeRange.value;    

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();

  // ボタンの無効化・有効化
  playButton.disabled = true;
  stopButton.disabled = false;
}

function stopAudio() {
  if (audioCtx) {
    audioCtx.close().then(() => {
      // AudioContextの停止処理が完了したら、
      // oscillatorとgainNodeをnullに戻す
      oscillator = null;
      gainNode = null;
    });

    // ボタンの無効化・有効化
    playButton.disabled = false;
    stopButton.disabled = true;
  }
}

playButton.addEventListener('click', startAudio);
stopButton.addEventListener('click', stopAudio);

// ページ読み込み時に停止ボタンを無効化
window.addEventListener('load', () => {
  stopButton.disabled = true;
});