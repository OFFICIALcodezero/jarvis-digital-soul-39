import { getWeatherResponse } from './weatherService';
import { getNewsResponse } from './newsService';
import { getTimeCalendarResponse } from './timeCalendarService';
import { getDailyBriefing } from './dailyBriefingService';
import { parseImageRequest } from './imagePromptParser';
import { generateImage } from './imageGenerationService';

export interface SkillResponse {
  text: string;
  data?: any;
  shouldSpeak: boolean;
  skillType: 'weather' | 'news' | 'time' | 'calendar' | 'briefing' | 'image' | 'system' | 'security' | 'analysis' | 'combat' | 'flight' | 'power' | 'general' | 'unknown';
}

// Enhanced system status simulation
const getSystemStatus = () => {
  return {
    cpu: Math.round(Math.random() * 30 + 70),
    memory: Math.round(Math.random() * 40 + 60),
    network: Math.round(Math.random() * 20 + 80),
    temperature: Math.round(Math.random() * 10 + 35),
    power: {
      arc_reactor: {
        output: Math.round(Math.random() * 20 + 80) + '%',
        efficiency: Math.round(Math.random() * 10 + 90) + '%',
        status: 'Optimal'
      }
    },
    defense_systems: {
      shields: 'Active',
      countermeasures: 'Armed',
      threat_detection: 'Online'
    }
  };
};

// Enhanced security protocols
const securityProtocols = [
  'Mark VII Deployment Protocol',
  'House Party Protocol',
  'Clean Slate Protocol',
  'Safe House Protocol',
  'Barn Door Protocol',
  'Silent Night Protocol',
  'Doomsday Protocol',
  'Ultron Contingency'
];

// New combat systems simulation
const getCombatReadiness = () => {
  return {
    weapons: {
      repulsors: 'Online',
      unibeam: 'Charged',
      missiles: 'Armed'
    },
    targeting: 'Active',
    combat_ai: 'Engaged',
    threat_assessment: 'Active'
  };
};

// New flight systems simulation
const getFlightStatus = () => {
  return {
    stabilizers: 'Online',
    thrusters: 'Operational',
    altitude: Math.round(Math.random() * 30000) + ' ft',
    speed: Math.round(Math.random() * 500) + ' mph',
    navigation: 'Active'
  };
};

// New power systems simulation
const getPowerStatus = () => {
  return {
    arc_reactor_output: Math.round(Math.random() * 20 + 80) + '%',
    backup_power: 'Standing by',
    power_distribution: 'Optimal',
    energy_signature: 'Minimal'
  };
};

export const processSkillCommand = async (command: string): Promise<SkillResponse> => {
  const lowerCommand = command.toLowerCase();
  
  try {
    // System Analysis & Diagnostics
    if (lowerCommand.includes('system status') || 
        lowerCommand.includes('diagnostics') || 
        lowerCommand.includes('system health')) {
      const status = getSystemStatus();
      return {
        text: `System diagnostics complete:\n- Arc Reactor output at ${status.power.arc_reactor.output}\n- Core systems: CPU ${status.cpu}%, Memory ${status.memory}%\n- Defense systems: ${status.defense_systems.shields}\n- All primary systems operational, sir.`,
        data: status,
        shouldSpeak: true,
        skillType: 'system'
      };
    }
    
    // Combat Systems
    else if (lowerCommand.includes('combat') ||
             lowerCommand.includes('weapons') ||
             lowerCommand.includes('battle')) {
      const combat = getCombatReadiness();
      return {
        text: `Combat systems check:\n- Weapons systems: ${combat.weapons.repulsors}\n- Targeting system: ${combat.targeting}\n- Combat AI: ${combat.combat_ai}\n- Ready for engagement, sir.`,
        data: combat,
        shouldSpeak: true,
        skillType: 'combat'
      };
    }
    
    // Flight Systems
    else if (lowerCommand.includes('flight') ||
             lowerCommand.includes('thrusters') ||
             lowerCommand.includes('stabilizers')) {
      const flight = getFlightStatus();
      return {
        text: `Flight systems status:\n- Thrusters: ${flight.thrusters}\n- Current altitude: ${flight.altitude}\n- Speed: ${flight.speed}\n- All systems green for flight, sir.`,
        data: flight,
        shouldSpeak: true,
        skillType: 'flight'
      };
    }
    
    // Power Systems
    else if (lowerCommand.includes('power') ||
             lowerCommand.includes('reactor') ||
             lowerCommand.includes('energy')) {
      const power = getPowerStatus();
      return {
        text: `Power systems analysis:\n- Arc Reactor output: ${power.arc_reactor_output}\n- Backup power: ${power.backup_power}\n- Power distribution: ${power.power_distribution}\n- All power systems functioning normally, sir.`,
        data: power,
        shouldSpeak: true,
        skillType: 'power'
      };
    }
    
    // Security Protocols
    else if (lowerCommand.includes('security protocol') || 
             lowerCommand.includes('protocols') ||
             lowerCommand.includes('security status')) {
      const protocol = securityProtocols[Math.floor(Math.random() * securityProtocols.length)];
      return {
        text: `Security systems engaged. ${protocol} is active and ready. Defense matrix online. Countermeasures standing by, sir.`,
        data: { activeProtocol: protocol },
        shouldSpeak: true,
        skillType: 'security'
      };
    }
    
    // Weather related queries
    else if (lowerCommand.includes('weather') || 
             lowerCommand.includes('rain') || 
             lowerCommand.includes('temperature') ||
             lowerCommand.includes('forecast')) {
      const response = await getWeatherResponse(command);
      return {
        text: response.text,
        data: response.data,
        shouldSpeak: true,
        skillType: 'weather'
      };
    }
    
    // News related queries
    else if (lowerCommand.includes('news') || 
             lowerCommand.includes('headlines') || 
             lowerCommand.includes('happening') ||
             lowerCommand.includes('latest stories')) {
      const response = await getNewsResponse(command);
      return {
        text: response.text,
        data: response.articles,
        shouldSpeak: true,
        skillType: 'news'
      };
    }
    
    // Time related queries
    else if (lowerCommand.includes('time') || 
             lowerCommand.includes('date') ||
             lowerCommand.includes('day')) {
      const response = await getTimeCalendarResponse(command);
      return {
        text: response.text,
        data: response.data,
        shouldSpeak: true,
        skillType: 'time'
      };
    }
    
    // Calendar/schedule related queries
    else if (lowerCommand.includes('schedule') || 
             lowerCommand.includes('calendar') || 
             lowerCommand.includes('event') ||
             lowerCommand.includes('meeting')) {
      const response = await getTimeCalendarResponse(command);
      return {
        text: response.text,
        data: response.data,
        shouldSpeak: true,
        skillType: 'calendar'
      };
    }
    
    // Daily briefing
    else if (lowerCommand.includes('briefing') || 
             lowerCommand.includes('update me') || 
             lowerCommand.includes('what\'s up') ||
             lowerCommand.includes('daily update') ||
             lowerCommand.includes('good morning')) {
      const response = await getDailyBriefing();
      return {
        text: response.text,
        data: response.briefing,
        shouldSpeak: true,
        skillType: 'briefing'
      };
    }
    
    // Image generation queries
    else if (lowerCommand.includes('generate image') || 
             lowerCommand.includes('create image') || 
             lowerCommand.includes('make image') ||
             lowerCommand.includes('draw') ||
             (lowerCommand.includes('generate') && lowerCommand.includes('picture')) ||
             (lowerCommand.includes('create') && lowerCommand.includes('picture'))) {
      const imageParams = parseImageRequest(command);
      const generatedImage = await generateImage(imageParams);
      
      return {
        text: `Here is the image I created based on your prompt: "${imageParams.prompt}"`,
        data: generatedImage,
        shouldSpeak: true,
        skillType: 'image'
      };
    }
    
    // Fall back to general query
    return {
      text: "Very well, sir. I'll process that request through my general query system.",
      shouldSpeak: false,
      skillType: 'general'
    };
    
  } catch (error) {
    console.error('Error processing skill command:', error);
    return {
      text: "I apologize, sir, but I've encountered an error processing your request. Shall I run a diagnostic?",
      shouldSpeak: true,
      skillType: 'unknown'
    };
  }
};

// Update isSkillCommand to include new commands
export const isSkillCommand = (command: string): boolean => {
  const lowerCommand = command.toLowerCase();
  
  return lowerCommand.includes('weather') ||
         lowerCommand.includes('rain') ||
         lowerCommand.includes('temperature') ||
         lowerCommand.includes('forecast') ||
         lowerCommand.includes('news') ||
         lowerCommand.includes('headlines') ||
         lowerCommand.includes('happening') ||
         lowerCommand.includes('time') ||
         lowerCommand.includes('date') ||
         lowerCommand.includes('day') ||
         lowerCommand.includes('schedule') ||
         lowerCommand.includes('calendar') ||
         lowerCommand.includes('event') ||
         lowerCommand.includes('briefing') ||
         lowerCommand.includes('update me') ||
         lowerCommand.includes('what\'s up') ||
         lowerCommand.includes('good morning') ||
         lowerCommand.includes('generate image') ||
         lowerCommand.includes('create image') ||
         lowerCommand.includes('make image') ||
         lowerCommand.includes('draw') ||
         lowerCommand.includes('system status') ||
         lowerCommand.includes('diagnostics') ||
         lowerCommand.includes('security protocol') ||
         lowerCommand.includes('analyze') ||
         lowerCommand.includes('scan') ||
         lowerCommand.includes('combat') ||
         lowerCommand.includes('weapons') ||
         lowerCommand.includes('battle') ||
         lowerCommand.includes('flight') ||
         lowerCommand.includes('thrusters') ||
         lowerCommand.includes('stabilizers') ||
         lowerCommand.includes('power') ||
         lowerCommand.includes('reactor') ||
         lowerCommand.includes('energy') ||
         (lowerCommand.includes('generate') && lowerCommand.includes('picture')) ||
         (lowerCommand.includes('create') && lowerCommand.includes('picture'));
};
