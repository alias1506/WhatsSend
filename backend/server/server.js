import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/send-message', (req, res) => {
    const { receiverNumbers, totalMessages, delay, message } = req.body;

    if (!receiverNumbers || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Path to the Python script (now in backend/scripts/)
    const scriptPath = path.join(__dirname, '..', 'scripts', 'send_message.py');

    // Path to the Python executable in the virtual environment
    // .venv is in the root of the project (two levels up from server.js)
    const venvPythonPath = path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe');

    // Fallback to global python if venv not found (though venv is recommended)
    const pythonExecutable = fs.existsSync(venvPythonPath) ? venvPythonPath : 'python';

    console.log(`Using Python executable: ${pythonExecutable}`);
    console.log(`Running script: ${scriptPath}`);

    const pythonProcess = spawn(pythonExecutable, [
        scriptPath,
        JSON.stringify({
            receiverNumbers,
            totalMessages,
            delay,
            message
        })
    ]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
        console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        console.log(`Python stdout: ${dataString}`);
        console.log(`Python stderr: ${errorString}`);

        if (code === 0) {
            try {
                const result = JSON.parse(dataString);
                if (result.status === 'success') {
                    res.json({ success: true, message: result.message || 'Messages sent successfully' });
                } else {
                    res.status(500).json({ error: result.message || 'Unknown error from Python script' });
                }
            } catch (e) {
                // If output isn't JSON, check if there's an error
                if (errorString) {
                    res.status(500).json({ error: 'Python script error', details: errorString });
                } else {
                    res.json({ success: true, message: 'Messages queued successfully' });
                }
            }
        } else {
            res.status(500).json({
                error: 'Failed to send messages',
                details: errorString || dataString,
                exitCode: code
            });
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Network access: http://<your-ip-address>:${PORT}`);
});
