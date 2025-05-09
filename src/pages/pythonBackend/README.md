
# Jarvis Threat Detection System

A Python-based system that monitors news sources for potential security threats and sends WhatsApp alerts when threats are detected.

## Features

- Integrates with NewsAPI to fetch real-time news articles
- Detects threats based on customizable keywords
- Sends WhatsApp alerts using Twilio when threats are detected
- Configurable monitoring intervals and news sources
- Comprehensive logging and error handling

## Requirements

- Python 3.7 or higher
- NewsAPI key (sign up at https://newsapi.org)
- Twilio account with WhatsApp capabilities (sign up at https://www.twilio.com)

## Installation

1. Install the required packages:

```
pip install -r requirements.txt
```

2. Create a `.env` file with your API keys and configuration:

```
# NewsAPI configuration
NEWS_API_KEY=your_news_api_key_here
NEWS_SOURCES=bbc-news,cnn,reuters,associated-press

# Twilio configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+13205300568
PERSONAL_WHATSAPP_NUMBER=whatsapp:+your_number_here

# Threat detection configuration
THREAT_KEYWORDS=attack,explosion,terrorism,military operation,threat,security breach
CHECK_INTERVAL=900
```

## Usage

### Basic Usage

Run the threat detection system:

```
python threat_detection.py
```

This will start continuous monitoring based on your configured interval.

### Command Line Options

- `--test`: Send a test WhatsApp message and exit
- `--once`: Run a single monitoring cycle and exit
- `--config /path/to/config.json`: Use a JSON configuration file instead of environment variables

Examples:

```
# Send a test WhatsApp message
python threat_detection.py --test

# Run a single monitoring cycle
python threat_detection.py --once

# Use a custom configuration file
python threat_detection.py --config my_config.json
```

### Configuration File Format

If you prefer using a JSON configuration file instead of environment variables, create a file with this format:

```json
{
    "news_api_key": "your_api_key",
    "twilio_account_sid": "your_sid",
    "twilio_auth_token": "your_token",
    "twilio_whatsapp_number": "whatsapp:+13205300568",
    "personal_whatsapp_number": "whatsapp:+your_number",
    "threat_keywords": ["attack", "explosion", "terrorism", "military operation", "threat", "security breach"],
    "check_interval": 900,
    "news_sources": "bbc-news,cnn,reuters,associated-press"
}
```

## Setting Up Twilio WhatsApp

1. Create a Twilio account at https://www.twilio.com
2. Navigate to the WhatsApp sandbox in your Twilio console
3. Follow the instructions to connect your WhatsApp account to the sandbox
4. Send the provided code to the Twilio WhatsApp number to confirm the connection

## Deployment Recommendations

For a production environment:
- Deploy on a server with reliable internet access
- Set up a service manager (like systemd) to ensure the script runs continuously
- Implement additional security measures for API key storage
- Consider implementing more advanced threat analysis algorithms

## Security and Ethical Considerations

This system is designed to:
- Only use publicly available news data (OSINT)
- Respect API rate limits
- Focus on legitimate security concerns
- Not store sensitive personal data

Always use this tool responsibly and in compliance with all applicable laws and regulations.
