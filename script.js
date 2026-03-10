// Configure Monaco Editor AMD loader path
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs' }});

let sourceEditor;
let targetEditor;

// Define themes and initialize editors
require(['vs/editor/editor.main'], function () {
    // Custom Hacker Dark Theme
    monaco.editor.defineTheme('github-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { background: '0d1117' }
        ],
        colors: {
            'editor.background': '#0d1117',
            'editor.lineHighlightBackground': '#161b22',
        }
    });

    sourceEditor = monaco.editor.create(document.getElementById('source-editor'), {
        value: '# Write some Python code here\nprint("Hello, world!")\n\ndef calculate_sum(a, b):\n    return a + b\n',
        language: 'python',
        theme: 'github-dark',
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 16 }
    });

    targetEditor = monaco.editor.create(document.getElementById('target-editor'), {
        value: '// Converted code will appear here',
        language: 'cpp',
        theme: 'github-dark',
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        automaticLayout: true,
        readOnly: true,
        scrollBeyondLastLine: false,
        padding: { top: 16 }
    });
});

// UI Elements
const sourceLangSelect = document.getElementById('source-lang');
const targetLangSelect = document.getElementById('target-lang');
const convertBtn = document.getElementById('convert-btn');
const btnText = convertBtn.querySelector('span');
const loader = convertBtn.querySelector('.loader');
const errorToast = document.getElementById('error-message');

// Event Listeners for language change
sourceLangSelect.addEventListener('change', (e) => {
    if (e.target.value !== 'auto' && sourceEditor) {
        monaco.editor.setModelLanguage(sourceEditor.getModel(), e.target.value);
    }
});

targetLangSelect.addEventListener('change', (e) => {
    if (targetEditor) {
        monaco.editor.setModelLanguage(targetEditor.getModel(), e.target.value);
    }
});

// Convert Button Click
convertBtn.addEventListener('click', async () => {
    const sourceCode = sourceEditor.getValue().trim();
    if (!sourceCode) {
        showError("Please enter some code to convert");
        return;
    }

    // UI Loading state
    convertBtn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    errorToast.classList.add('hidden');
    targetEditor.setValue('// Translating...');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source_code: sourceCode,
                target_language: targetLangSelect.options[targetLangSelect.selectedIndex].text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to convert code');
        }

        targetEditor.setValue(data.converted_code);
    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
        targetEditor.setValue('// Error occurred during translation');
    } finally {
        // Reset UI state
        convertBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
});

function showError(message) {
    errorToast.textContent = message;
    errorToast.classList.remove('hidden');
    setTimeout(() => {
        errorToast.classList.add('hidden');
    }, 5000);
}
