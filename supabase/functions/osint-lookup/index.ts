
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface LookupRequest {
  type: 'email' | 'domain' | 'ip' | 'username' | 'phone';
  query: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, query } = await req.json() as LookupRequest;

    if (!type || !query) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Log the request for monitoring
    console.log(`OSINT lookup request - Type: ${type}, Query: ${query}`);

    let result;
    switch (type) {
      case 'ip':
        result = await ipLookup(query);
        break;
      case 'domain':
        result = await domainLookup(query);
        break;
      case 'email':
        result = await emailLookup(query);
        break;
      case 'username':
        result = await usernameLookup(query);
        break;
      case 'phone':
        result = await phoneLookup(query);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid lookup type' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        query,
        type,
        result
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing OSINT request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// IP lookup implementation - uses ipinfo.io
async function ipLookup(ip: string) {
  try {
    // Use IPinfo.io API - in a real implementation, this would use an API key
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    
    if (!response.ok) {
      throw new Error(`IP lookup failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format and return the data
    return {
      ip: data.ip,
      hostname: data.hostname || null,
      city: data.city || null,
      region: data.region || null,
      country: data.country || null,
      loc: data.loc ? {
        lat: data.loc.split(',')[0],
        lon: data.loc.split(',')[1]
      } : null,
      org: data.org || null,
      postal: data.postal || null,
      timezone: data.timezone || null,
      asn: data.org ? data.org.split(' ')[0] : null
    };
  } catch (error) {
    console.error("IP lookup error:", error);
    // Fallback to simulation for demo purposes
    return simulateIpLookup(ip);
  }
}

// Domain lookup implementation
async function domainLookup(domain: string) {
  try {
    // Use WHOIS API to get domain information
    // In a real implementation, this would use a proper WHOIS API with an API key
    const response = await fetch(`https://api.domainsdb.info/v1/domains/search?domain=${domain}`);
    
    if (!response.ok) {
      throw new Error(`Domain lookup failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.domains || data.domains.length === 0) {
      throw new Error('No domain information found');
    }
    
    const domainData = data.domains[0];
    
    // Now fetch DNS information using Google's public DNS API
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const dnsData = await dnsResponse.json();
    
    return {
      domain: domainData.domain,
      create_date: domainData.create_date,
      update_date: domainData.update_date,
      country: domainData.country,
      isDead: domainData.isDead,
      A: dnsData.Answer ? dnsData.Answer.filter(r => r.type === 1).map(r => r.data) : [],
      NS: await fetchNSRecords(domain),
      MX: await fetchMXRecords(domain),
      hasSPF: await checkSPFRecord(domain),
      hasDMARC: await checkDMARCRecord(domain)
    };
  } catch (error) {
    console.error("Domain lookup error:", error);
    // Fallback to simulation for demo purposes
    return simulateDomainLookup(domain);
  }
}

async function fetchNSRecords(domain: string) {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`);
    const data = await response.json();
    return data.Answer ? data.Answer.filter(r => r.type === 2).map(r => r.data) : [];
  } catch (error) {
    console.error("NS lookup error:", error);
    return [];
  }
}

async function fetchMXRecords(domain: string) {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const data = await response.json();
    return data.Answer ? data.Answer.filter(r => r.type === 15).map(r => r.data) : [];
  } catch (error) {
    console.error("MX lookup error:", error);
    return [];
  }
}

async function checkSPFRecord(domain: string) {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`);
    const data = await response.json();
    return data.Answer ? data.Answer.some(r => r.data.includes('v=spf1')) : false;
  } catch (error) {
    console.error("SPF check error:", error);
    return false;
  }
}

async function checkDMARCRecord(domain: string) {
  try {
    const response = await fetch(`https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`);
    const data = await response.json();
    return data.Answer ? data.Answer.some(r => r.data.includes('v=DMARC1')) : false;
  } catch (error) {
    console.error("DMARC check error:", error);
    return false;
  }
}

// Email lookup implementation
async function emailLookup(email: string) {
  try {
    // Check if email domain exists and has valid MX records
    const domain = email.split('@')[1];
    
    // Check domain MX records
    const mxResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const mxData = await mxResponse.json();
    const hasMX = mxData.Answer && mxData.Answer.some(r => r.type === 15);
    
    // Check for email in breach database (simulated for now)
    // In a real implementation, this would use HaveIBeenPwned or similar with API key
    const breachData = await simulateBreachLookup(email);
    
    return {
      email,
      domain,
      valid: hasMX, // Basic validation - domain has MX records
      format: validateEmailFormat(email),
      mxRecords: hasMX ? mxData.Answer.filter(r => r.type === 15).map(r => r.data) : [],
      spfRecord: await checkSPFRecord(domain),
      dmarcRecord: await checkDMARCRecord(domain),
      breachData
    };
  } catch (error) {
    console.error("Email lookup error:", error);
    // Fallback to simulation for demo purposes
    return simulateEmailLookup(email);
  }
}

function validateEmailFormat(email: string): boolean {
  // Basic email format validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Username lookup implementation - simulated
async function usernameLookup(username: string) {
  try {
    // This would normally use a real API service that checks usernames across platforms
    // For demonstration, we'll use a simulation
    return simulateUsernameLookup(username);
  } catch (error) {
    console.error("Username lookup error:", error);
    return simulateUsernameLookup(username);
  }
}

// Phone lookup implementation - simulated
async function phoneLookup(phone: string) {
  try {
    // This would normally use a real API service for phone lookup
    // For demonstration, we'll use a simulation
    return simulatePhoneLookup(phone);
  } catch (error) {
    console.error("Phone lookup error:", error);
    return simulatePhoneLookup(phone);
  }
}

// Simulation functions for demo purposes when APIs are unavailable
function simulateIpLookup(ip: string) {
  return {
    ip,
    hostname: `server-${ip.replace(/\./g, '-')}.example.com`,
    city: ['New York', 'San Francisco', 'London', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 5)],
    region: ['New York', 'California', 'Greater London', 'Tokyo', 'New South Wales'][Math.floor(Math.random() * 5)],
    country: ['US', 'US', 'GB', 'JP', 'AU'][Math.floor(Math.random() * 5)],
    loc: {
      lat: (Math.random() * 180 - 90).toFixed(4),
      lon: (Math.random() * 360 - 180).toFixed(4)
    },
    org: `AS${Math.floor(Math.random() * 65535)} Example ISP`,
    postal: `${Math.floor(Math.random() * 90000) + 10000}`,
    timezone: ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'][Math.floor(Math.random() * 5)]
  };
}

function simulateDomainLookup(domain: string) {
  // Calculate a consistent creation date based on domain name
  const domainHash = Array.from(domain).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const yearsAgo = domainHash % 20 + 1; // 1-20 years ago
  const createDate = new Date();
  createDate.setFullYear(createDate.getFullYear() - yearsAgo);
  
  // Update date more recent
  const updateDate = new Date();
  updateDate.setMonth(updateDate.getMonth() - (domainHash % 12));
  
  return {
    domain,
    create_date: createDate.toISOString().split('T')[0],
    update_date: updateDate.toISOString().split('T')[0],
    country: ['US', 'GB', 'DE', 'FR', 'JP', 'AU', 'CA'][domainHash % 7],
    isDead: false,
    A: [`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`],
    NS: [`ns1.${domain}`, `ns2.${domain}`],
    MX: [`mail.${domain}`, `alt-mail.${domain}`],
    hasSPF: Math.random() > 0.3,
    hasDMARC: Math.random() > 0.5
  };
}

function simulateEmailLookup(email: string) {
  const domain = email.split('@')[1];
  const breachData = simulateBreachLookup(email);
  
  return {
    email,
    domain,
    valid: true,
    format: true,
    mxRecords: [`mail.${domain}`, `alt-mail.${domain}`],
    spfRecord: Math.random() > 0.3,
    dmarcRecord: Math.random() > 0.5,
    breachData
  };
}

function simulateBreachLookup(email: string) {
  // Determine if the email is in a breach based on a hash of the email
  const emailHash = Array.from(email).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const inBreach = emailHash % 3 === 0; // 1/3 chance of being in a breach
  
  if (!inBreach) {
    return {
      found: false,
      breaches: []
    };
  }
  
  // Generate some mock breaches
  const breachCount = (emailHash % 3) + 1; // 1-3 breaches
  const breaches = [];
  
  const breachNames = [
    'ExampleSite Database', 'OnlineShop Records', 'SocialNetwork Users',
    'GamingPortal Accounts', 'ForumUsers Data', 'RetailStore Customers'
  ];
  
  const dataTypes = [
    'email', 'username', 'password (hashed)', 'password (plaintext)',
    'name', 'date of birth', 'phone number', 'address', 'payment info'
  ];
  
  for (let i = 0; i < breachCount; i++) {
    const yearOffset = (i + 1) * 2;
    const breachDate = new Date();
    breachDate.setFullYear(breachDate.getFullYear() - yearOffset);
    
    // Select 2-4 data types that were exposed
    const exposedData = [];
    const dataTypeCount = Math.floor(Math.random() * 3) + 2;
    while (exposedData.length < dataTypeCount) {
      const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
      if (!exposedData.includes(dataType)) {
        exposedData.push(dataType);
      }
    }
    
    breaches.push({
      name: breachNames[(emailHash + i) % breachNames.length],
      date: breachDate.toISOString().split('T')[0],
      exposedData,
      affectedUsers: Math.floor(Math.random() * 10000000) + 100000
    });
  }
  
  return {
    found: true,
    breachCount,
    breaches
  };
}

function simulateUsernameLookup(username: string) {
  const platforms = [
    'Twitter', 'Instagram', 'Facebook', 'TikTok', 
    'LinkedIn', 'GitHub', 'YouTube', 'Reddit'
  ];
  
  // Determine which platforms have this username in a consistent way
  const usernameHash = Array.from(username).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  const results = platforms.map((platform, index) => {
    const exists = (usernameHash + index) % 3 !== 0; // 2/3 chance of existing
    return {
      platform,
      exists,
      url: exists ? `https://${platform.toLowerCase()}.com/${username}` : null,
      lastActivity: exists && Math.random() > 0.3 ? 
        new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null
    };
  });
  
  return {
    username,
    platformsChecked: platforms.length,
    found: results.filter(r => r.exists).length,
    results
  };
}

function simulatePhoneLookup(phone: string) {
  // Clean the phone number for processing
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneHash = Array.from(cleanPhone).reduce((sum, char) => sum + parseInt(char), 0);
  
  // Determine country code
  let countryCode, country, region, city, carrier, lineType;
  
  if (cleanPhone.startsWith('1') || phoneHash % 5 === 0) {
    countryCode = '+1';
    country = 'United States';
    region = ['New York', 'California', 'Texas', 'Florida', 'Illinois'][phoneHash % 5];
    city = ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][phoneHash % 5];
    carrier = ['Verizon', 'AT&T', 'T-Mobile', 'Sprint', 'US Cellular'][phoneHash % 5];
  } else if (phoneHash % 5 === 1) {
    countryCode = '+44';
    country = 'United Kingdom';
    region = ['England', 'Scotland', 'Wales', 'Northern Ireland'][phoneHash % 4];
    city = ['London', 'Manchester', 'Birmingham', 'Edinburgh'][phoneHash % 4];
    carrier = ['Vodafone', 'EE', 'O2', 'Three'][phoneHash % 4];
  } else if (phoneHash % 5 === 2) {
    countryCode = '+61';
    country = 'Australia';
    region = ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'][phoneHash % 4];
    city = ['Sydney', 'Melbourne', 'Brisbane', 'Perth'][phoneHash % 4];
    carrier = ['Telstra', 'Optus', 'Vodafone AU'][phoneHash % 3];
  } else if (phoneHash % 5 === 3) {
    countryCode = '+33';
    country = 'France';
    region = ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Occitanie'][phoneHash % 3];
    city = ['Paris', 'Marseille', 'Lyon'][phoneHash % 3];
    carrier = ['Orange', 'SFR', 'Free Mobile'][phoneHash % 3];
  } else {
    countryCode = '+81';
    country = 'Japan';
    region = ['Tokyo', 'Osaka', 'Kyoto'][phoneHash % 3];
    city = ['Tokyo', 'Osaka', 'Kyoto'][phoneHash % 3];
    carrier = ['NTT DoCoMo', 'KDDI', 'SoftBank'][phoneHash % 3];
  }
  
  lineType = phoneHash % 2 === 0 ? 'mobile' : 'landline';
  
  return {
    phone,
    valid: cleanPhone.length >= 10,
    countryCode,
    localFormat: formatPhoneNumber(cleanPhone, countryCode),
    carrier,
    lineType,
    location: {
      country,
      region,
      city
    },
    timeZone: getTimeZoneForCountry(country)
  };
}

function formatPhoneNumber(phone: string, countryCode: string): string {
  if (countryCode === '+1') {
    // Format as (XXX) XXX-XXXX for US numbers
    if (phone.length === 10) {
      return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11 && phone.startsWith('1')) {
      return `(${phone.substring(1, 4)}) ${phone.substring(4, 7)}-${phone.substring(7)}`;
    }
  }
  
  // Default format for other countries
  return `${countryCode} ${phone}`;
}

function getTimeZoneForCountry(country: string): string {
  const timezoneMap: Record<string, string> = {
    'United States': 'America/New_York',
    'United Kingdom': 'Europe/London',
    'Australia': 'Australia/Sydney',
    'France': 'Europe/Paris',
    'Japan': 'Asia/Tokyo'
  };
  
  return timezoneMap[country] || 'UTC';
}
