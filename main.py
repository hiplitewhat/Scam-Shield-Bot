import discord
import aiohttp
from discord.ext import commands
from PIL import Image
from io import BytesIO
import pytesseract

# Discord bot token (use environment variables in production!)
DISCORD_TOKEN = "YOUR_DISCORD_BOT_TOKEN"

# AI endpoint (Cloudflare Workers LLaMA-3)
AI_ENDPOINT = "https://ai-chat.pastefyuser1231.workers.dev/api/chat"

# Discord bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)


# -------------------------------
# OCR helper
# -------------------------------
async def ocr_from_image(url: str) -> str:
    """Download an image and extract text using Tesseract OCR"""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            img_bytes = await resp.read()

    image = Image.open(BytesIO(img_bytes))
    return pytesseract.image_to_string(image)


# -------------------------------
# AI scam detection
# -------------------------------
async def detect_scam(message_content: str) -> bool:
    """Send text to LLaMA-3 endpoint for YES/NO scam classification"""
    payload = {
        "model": "@cf/meta/llama-3-8b-instruct",
        "system": (
            "You are a cybersecurity classifier. "
            "Reply ONLY with YES or NO."
        ),
        "messages": [
            {
                "role": "user",
                "content": f"Is this message a scam or fraudulent?\n\n{message_content}"
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "DiscordBot/ScamDetector"
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(AI_ENDPOINT, json=payload, headers=headers) as resp:
            data = await resp.json()
            # API returns choices[0].message.content
            reply = data["choices"][0]["message"]["content"].strip().lower()
            return reply == "yes"


# -------------------------------
# Discord event
# -------------------------------
@bot.event
async def on_message(message):
    if message.author.bot:
        return

    text_to_check = message.content

    # OCR for image attachments
    if message.attachments:
        for attachment in message.attachments:
            if attachment.filename.lower().endswith((".png", ".jpg", ".jpeg")):
                try:
                    ocr_text = await ocr_from_image(attachment.url)
                    text_to_check += "\n" + ocr_text
                except Exception as e:
                    print("OCR failed:", e)

    # Scam detection
    if text_to_check.strip():
        try:
            is_scam = await detect_scam(text_to_check)
            if is_scam:
                await message.channel.send("🚨 Scam detected! 🚨")
        except Exception as e:
            print("AI error:", e)

    await bot.process_commands(message)


# -------------------------------
# Run bot
# -------------------------------
bot.run(DISCORD_TOKEN)