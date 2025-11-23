import sys
import json
import time
from urllib.parse import quote
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# Force UTF-8 encoding for console output (Windows compatibility)
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


def send_messages(data: dict):
    """Send WhatsApp messages using Playwright.
    Expected keys in *data*:
        receiverNumbers (str or list) – phone numbers in E.164 format
        message (str) – text to send
        totalMessages (int) – how many times to repeat per receiver
        delay (float) – seconds between messages
    """
    # ------------------------------------------------------------------
    # Parse input
    # ------------------------------------------------------------------
    raw_receivers = data.get('receiverNumbers', '')
    if isinstance(raw_receivers, list):
        receivers = raw_receivers
    else:
        receivers = [r.strip() for r in raw_receivers.split(',') if r.strip()]

    message = data.get('message', '')
    total = int(data.get('totalMessages', 1))
    delay = float(data.get('delay', 2))

    if not receivers:
        print(json.dumps({"status": "error", "message": "No receiver numbers provided"}), file=sys.stderr)
        sys.exit(1)

    successful = 0

    # ------------------------------------------------------------------
    # Playwright – open ONE browser window and keep it alive
    # ------------------------------------------------------------------
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        # 1️⃣ Load WhatsApp Web and wait for QR login (once)
        print("Opening WhatsApp Web – scan QR code if needed...")
        page.goto("https://web.whatsapp.com")
        try:
            page.wait_for_selector('div[contenteditable="true"][data-tab="3"]', timeout=120_000)
            print("Logged in successfully!")
        except PlaywrightTimeout:
            print("Error: Timeout waiting for login – QR code not scanned.", file=sys.stderr)
            sys.exit(1)

        # 2️⃣ Process each receiver
        for r_idx, receiver in enumerate(receivers, start=1):
            print(f"\n>>> Processing receiver {r_idx}/{len(receivers)}: {receiver}")
            encoded_msg = quote(message)
            chat_url = f"https://web.whatsapp.com/send?phone={receiver}&text={encoded_msg}"
            page.goto(chat_url)
            try:
                page.wait_for_selector('div[contenteditable="true"][data-tab="10"]', timeout=30_000)
            except PlaywrightTimeout:
                print(f"Warning: Could not open chat for {receiver}, skipping.", file=sys.stderr)
                continue

            # 3️⃣ Send the required number of messages
            for i in range(total):
                try:
                    print(f"  Sending message {i+1}/{total}...")
                    print(f"  Message content: {message}")
                    
                    input_box = page.locator('div[contenteditable="true"][data-tab="10"]')
                    input_box.fill(message)
                    page.keyboard.press('Enter')
                    time.sleep(0.5)  # give WhatsApp UI time to process the send
                    successful += 1
                    print(f"  Sent message {i+1}/{total}")
                except Exception as e:
                    print(f"Error sending message to {receiver}: {e}", file=sys.stderr)
                    break
                if i < total - 1:
                    print(f"  Waiting {delay} seconds before next message...")
                    time.sleep(delay)

        # 4️⃣ Summary & cleanup
        print("\n" + "=" * 50)
        print(f"COMPLETED: {successful} messages sent successfully")
        print("Browser will stay open – close it manually when done.")
        print("=" * 50)
        # Optional: wait for user input before closing the browser (uncomment to enable)
        # input("Press ENTER to close the browser…")
        browser.close()
        # Return JSON for the caller (e.g., Node backend)
        print(json.dumps({"status": "success", "successful_messages": successful}))

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            payload = json.loads(sys.argv[1])
            send_messages(payload)
        else:
            print(json.dumps({"status": "error", "message": "No arguments provided"}), file=sys.stderr)
            sys.exit(1)
    except json.JSONDecodeError as e:
        print(json.dumps({"status": "error", "message": f"Invalid JSON: {e}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}), file=sys.stderr)
        sys.exit(1)
