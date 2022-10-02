// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});

(function mockChromeUserAgent() {
  const originalVoices = window.speechSynthesis.getVoices()
  window.speechSynthesis.getVoices = function getVoices() {
    return [
      {
        voiceURI: 'Google US English',
        name: 'Google US English',
        lang: 'en-US',
        localService: false,
        default: false,
      },
    ]
  }

  // wait some time before cleaning up the mess we did previously
  setTimeout(() => {
    window.speechSynthesis.getVoices = function getVoices() {
      return originalVoices
    }
  }, 10_000)
}())
