
#!/usr/bin/env python3
"""
Jarvis Threat Detection System

This script monitors news sources for potential security threats and sends
WhatsApp alerts when threats are detected.

Usage:
    python threat_detection.py

Requirements:
    - Python 3.7+
    - NewsAPI key (https://newsapi.org)
    - Twilio account with WhatsApp capabilities
"""

import os
import json
import time
import logging
import argparse
import requests
from datetime import datetime, timedelta
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("threat_detection.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("threat_detection")

# Load environment variables from .env file if it exists
load_dotenv()

class ThreatDetection:
    """Main class for the Jarvis Threat Detection System."""
    
    def __init__(self, config=None):
        """Initialize the threat detection system.
        
        Args:
            config (dict, optional): Configuration dictionary with API keys and settings.
                                    If not provided, will try to load from environment.
        """
        # Load configuration
        self.config = config or self._load_config_from_env()
        
        # Validate configuration
        self._validate_config()
        
        # Initialize Twilio client
        self.twilio_client = Client(
            self.config['twilio_account_sid'],
            self.config['twilio_auth_token']
        )
        
        # Track processed articles to avoid duplicate alerts
        self.processed_articles = set()
        
        # Initialize time of last API call
        self.last_api_call = None

        logger.info("Threat Detection System initialized")
    
    def _load_config_from_env(self):
        """Load configuration from environment variables."""
        return {
            'news_api_key': os.getenv('NEWS_API_KEY'),
            'twilio_account_sid': os.getenv('TWILIO_ACCOUNT_SID'),
            'twilio_auth_token': os.getenv('TWILIO_AUTH_TOKEN'),
            'twilio_whatsapp_number': os.getenv('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+13205300568'),
            'personal_whatsapp_number': os.getenv('PERSONAL_WHATSAPP_NUMBER'),
            'threat_keywords': os.getenv('THREAT_KEYWORDS', 'attack,explosion,terrorism,military operation,threat,security breach').split(','),
            'check_interval': int(os.getenv('CHECK_INTERVAL', '900')),  # Default: 15 minutes
            'news_sources': os.getenv('NEWS_SOURCES', 'bbc-news,cnn,reuters,associated-press')
        }
    
    def _validate_config(self):
        """Validate that all required configuration is present."""
        required_keys = [
            'news_api_key', 
            'twilio_account_sid', 
            'twilio_auth_token', 
            'personal_whatsapp_number'
        ]
        
        missing_keys = [key for key in required_keys if not self.config.get(key)]
        
        if missing_keys:
            error_msg = f"Missing required configuration keys: {', '.join(missing_keys)}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # Verify WhatsApp numbers are properly formatted
        for num_key in ['twilio_whatsapp_number', 'personal_whatsapp_number']:
            if not self.config[num_key].startswith('whatsapp:+'):
                logger.warning(f"{num_key} should start with 'whatsapp:+'. Fixing format...")
                self.config[num_key] = f"whatsapp:+{self.config[num_key].lstrip('whatsapp:+')}"
    
    def fetch_news(self):
        """Fetch recent news articles from the NewsAPI.
        
        Returns:
            list: List of news articles, each as a dictionary.
        """
        # Rate limiting check (NewsAPI free tier allows 100 requests/day)
        if self.last_api_call and (datetime.now() - self.last_api_call).total_seconds() < 60:
            logger.warning("Rate limiting: Waiting to avoid exceeding NewsAPI limits")
            time.sleep(60)
        
        # Calculate time period (last 6 hours)
        time_from = (datetime.now() - timedelta(hours=6)).strftime('%Y-%m-%dT%H:%M:%S')
        
        # Prepare search query with threat-related terms
        # We use OR between terms to get more comprehensive results
        # Additional qualifiers like 'breaking', 'emergency' increase relevance
        query_terms = " OR ".join(self.config['threat_keywords'])
        query = f"({query_terms}) AND (breaking OR emergency OR urgent OR alert)"
        
        # Define API URL and parameters
        url = 'https://newsapi.org/v2/everything'
        params = {
            'q': query,
            'sources': self.config['news_sources'],
            'from': time_from,
            'sortBy': 'publishedAt',
            'language': 'en',
            'apiKey': self.config['news_api_key']
        }
        
        try:
            logger.info(f"Fetching news with query: {query}")
            self.last_api_call = datetime.now()
            response = requests.get(url, params=params)
            
            # Check for successful response
            if response.status_code != 200:
                logger.error(f"Error fetching news: {response.status_code} - {response.text}")
                return []
            
            # Parse the response
            data = response.json()
            articles = data.get('articles', [])
            logger.info(f"Fetched {len(articles)} articles")
            
            return articles
        
        except Exception as e:
            logger.error(f"Error while fetching news: {str(e)}")
            return []
    
    def detect_threats(self, articles):
        """Analyze news articles to detect potential threats.
        
        Args:
            articles (list): List of news articles to analyze.
        
        Returns:
            list: Articles that were identified as potential threats.
        """
        threats = []
        keywords = [k.strip().lower() for k in self.config['threat_keywords']]
        
        for article in articles:
            # Skip if we've already processed this article
            article_id = article.get('url')
            if article_id in self.processed_articles:
                continue
            
            self.processed_articles.add(article_id)
            
            # Extract text content to analyze
            title = article.get('title', '').lower()
            description = article.get('description', '').lower()
            content = article.get('content', '').lower()
            
            # Combine all text for keyword matching
            all_text = f"{title} {description} {content}"
            
            # Check for keywords
            matched_keywords = [keyword for keyword in keywords if keyword.lower() in all_text]
            
            # If keywords found, consider it a potential threat
            if matched_keywords:
                logger.info(f"Potential threat detected: '{article.get('title')}'")
                article['matched_keywords'] = matched_keywords
                threats.append(article)
        
        return threats
    
    def send_alert(self, threat):
        """Send a WhatsApp alert about a detected threat.
        
        Args:
            threat (dict): The article with threat information.
        
        Returns:
            bool: True if the alert was sent successfully, False otherwise.
        """
        try:
            # Format the message with relevant information
            message = f"""
🚨 *JARVIS THREAT ALERT* 🚨

*{threat.get('title', 'Breaking News')}*

{threat.get('description', 'Potential security threat detected.')}

Source: {threat.get('source', {}).get('name', 'Unknown')}
Published: {threat.get('publishedAt', 'Unknown')}
Keywords: {', '.join(threat.get('matched_keywords', []))}

Read more: {threat.get('url', '')}
            """
            
            # Send the WhatsApp message
            message = self.twilio_client.messages.create(
                body=message,
                from_=self.config['twilio_whatsapp_number'],
                to=self.config['personal_whatsapp_number']
            )
            
            logger.info(f"Alert sent successfully. SID: {message.sid}")
            return True
            
        except TwilioRestException as e:
            logger.error(f"Error sending Twilio WhatsApp message: {e}")
            return False
        
        except Exception as e:
            logger.error(f"Unexpected error sending alert: {e}")
            return False
    
    def test_whatsapp(self):
        """Send a test WhatsApp message to verify functionality.
        
        Returns:
            bool: True if the test message was sent successfully, False otherwise.
        """
        try:
            # Format a simple test message
            test_message = f"""
🔍 *JARVIS THREAT DETECTION - TEST MESSAGE* 🔍

This is a test alert from your Jarvis Threat Detection System.
System is operational and ready to monitor for threats.

Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            # Send the test message
            message = self.twilio_client.messages.create(
                body=test_message,
                from_=self.config['twilio_whatsapp_number'],
                to=self.config['personal_whatsapp_number']
            )
            
            logger.info(f"Test message sent successfully. SID: {message.sid}")
            return True
            
        except TwilioRestException as e:
            logger.error(f"Error sending test WhatsApp message: {e}")
            return False
        
        except Exception as e:
            logger.error(f"Unexpected error sending test message: {e}")
            return False
    
    def run_monitoring_cycle(self):
        """Run a single cycle of the threat monitoring process."""
        try:
            logger.info("Starting monitoring cycle")
            
            # Fetch recent news
            articles = self.fetch_news()
            
            # Detect threats
            threats = self.detect_threats(articles)
            
            # Send alerts for detected threats
            alerts_sent = 0
            for threat in threats:
                if self.send_alert(threat):
                    alerts_sent += 1
            
            logger.info(f"Monitoring cycle complete. Found {len(threats)} threats, sent {alerts_sent} alerts")
            
        except Exception as e:
            logger.error(f"Error in monitoring cycle: {e}")
    
    def run(self):
        """Run the threat detection system continuously."""
        logger.info(f"Starting continuous monitoring. Check interval: {self.config['check_interval']} seconds")
        
        try:
            while True:
                self.run_monitoring_cycle()
                
                logger.info(f"Sleeping for {self.config['check_interval']} seconds")
                time.sleep(self.config['check_interval'])
                
        except KeyboardInterrupt:
            logger.info("Monitoring stopped by user")
        
        except Exception as e:
            logger.error(f"Unexpected error in monitoring loop: {e}")
            raise


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(description='Jarvis Threat Detection System')
    parser.add_argument('--test', action='store_true', help='Send a test WhatsApp message and exit')
    parser.add_argument('--config', type=str, help='Path to configuration file (JSON)')
    parser.add_argument('--once', action='store_true', help='Run a single monitoring cycle and exit')
    args = parser.parse_args()
    
    # Load config from file if specified
    config = None
    if args.config:
        try:
            with open(args.config, 'r') as f:
                config = json.load(f)
        except Exception as e:
            logger.error(f"Error loading config file: {e}")
            return 1
    
    # Initialize the threat detection system
    try:
        system = ThreatDetection(config)
        
        # Handle test mode
        if args.test:
            logger.info("Running in test mode - sending test WhatsApp message")
            success = system.test_whatsapp()
            return 0 if success else 1
        
        # Handle single-run mode
        elif args.once:
            logger.info("Running a single monitoring cycle")
            system.run_monitoring_cycle()
            return 0
        
        # Normal operation - continuous monitoring
        else:
            system.run()
            
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        return 1
    
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
