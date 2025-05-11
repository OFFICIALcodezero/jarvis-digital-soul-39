
import { toast } from '@/components/ui/sonner';

export type DeviceType = 'light' | 'sensor' | 'speaker' | 'relay' | 'camera' | 'custom';
export type DeviceStatus = 'online' | 'offline' | 'error' | 'connecting';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  connected: boolean;
  capabilities: string[];
  data: Record<string, any>;
  lastUpdated: Date;
}

export interface DeviceCommand {
  deviceId: string;
  action: string;
  parameters?: Record<string, any>;
}

export interface DeviceControlOptions {
  timeout?: number;
  retryCount?: number;
  silent?: boolean;
}

class DeviceControlService {
  private devices: Map<string, Device> = new Map();
  private bluetoothSupported: boolean = false;
  private wifiDirectSupported: boolean = false;
  
  constructor() {
    console.log('Device Control Service initialized');
    this.checkSupportedFeatures();
  }
  
  private async checkSupportedFeatures(): Promise<void> {
    // Check for Bluetooth support
    if (navigator.bluetooth) {
      this.bluetoothSupported = true;
      console.log('Bluetooth API supported');
    } else {
      console.log('Bluetooth API not supported');
    }
    
    // Check for WiFi Direct (limited browser support)
    // This is a simplified check - actual implementation would be more complex
    this.wifiDirectSupported = !!(navigator.getNetworkInformation);
    
    // For demo purposes, register some mock devices
    this.registerMockDevices();
  }
  
  private registerMockDevices(): void {
    // Add some mock devices for demonstration
    const mockDevices: Device[] = [
      {
        id: 'light-001',
        name: 'Living Room Light',
        type: 'light',
        status: 'online',
        connected: true,
        capabilities: ['toggle', 'brightness', 'color'],
        data: {
          state: 'off',
          brightness: 80,
          color: '#FFFFFF',
        },
        lastUpdated: new Date()
      },
      {
        id: 'sensor-001',
        name: 'Front Door Sensor',
        type: 'sensor',
        status: 'online',
        connected: true,
        capabilities: ['motion', 'temperature', 'humidity'],
        data: {
          motion: false,
          temperature: 22.5,
          humidity: 45,
        },
        lastUpdated: new Date()
      },
      {
        id: 'speaker-001',
        name: 'Office Speaker',
        type: 'speaker',
        status: 'online',
        connected: true,
        capabilities: ['play', 'volume', 'mute'],
        data: {
          state: 'idle',
          volume: 60,
          muted: false,
        },
        lastUpdated: new Date()
      },
      {
        id: 'camera-001',
        name: 'Security Camera',
        type: 'camera',
        status: 'online',
        connected: true,
        capabilities: ['stream', 'record', 'motion'],
        data: {
          streaming: false,
          recording: false,
          motionDetected: false,
        },
        lastUpdated: new Date()
      }
    ];
    
    mockDevices.forEach(device => {
      this.devices.set(device.id, device);
    });
    
    console.log(`Registered ${mockDevices.length} mock devices`);
  }
  
  public getDevice(id: string): Device | undefined {
    return this.devices.get(id);
  }
  
  public getAllDevices(): Device[] {
    return Array.from(this.devices.values());
  }
  
  public getDevicesByType(type: DeviceType): Device[] {
    return Array.from(this.devices.values()).filter(device => device.type === type);
  }
  
  public async scanForDevices(): Promise<Device[]> {
    console.log('Scanning for devices...');
    
    // In a real implementation, this would use Bluetooth/WiFi APIs
    // For demo purposes, we'll simulate finding devices
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast("Device Scan Complete", {
      description: `Found ${this.devices.size} devices on the network.`,
    });
    
    return this.getAllDevices();
  }
  
  public async connectDevice(id: string): Promise<boolean> {
    const device = this.getDevice(id);
    if (!device) {
      console.error(`Device ${id} not found`);
      return false;
    }
    
    console.log(`Connecting to device: ${device.name} (${id})`);
    
    // In a real implementation, this would use Bluetooth/WiFi APIs
    // For demo purposes, we'll simulate connecting
    device.status = 'connecting';
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.2; // 80% success rate for demo
    
    if (success) {
      device.status = 'online';
      device.connected = true;
      device.lastUpdated = new Date();
      
      toast("Device Connected", {
        description: `Successfully connected to ${device.name}.`,
      });
      
      console.log(`Connected to device: ${device.name} (${id})`);
      return true;
    } else {
      device.status = 'error';
      device.connected = false;
      
      toast("Connection Failed", {
        description: `Failed to connect to ${device.name}.`,
        variant: 'destructive',
      });
      
      console.error(`Failed to connect to device: ${device.name} (${id})`);
      return false;
    }
  }
  
  public async disconnectDevice(id: string): Promise<boolean> {
    const device = this.getDevice(id);
    if (!device) {
      console.error(`Device ${id} not found`);
      return false;
    }
    
    console.log(`Disconnecting from device: ${device.name} (${id})`);
    
    // In a real implementation, this would use Bluetooth/WiFi APIs
    // For demo purposes, we'll simulate disconnecting
    await new Promise(resolve => setTimeout(resolve, 800));
    
    device.status = 'offline';
    device.connected = false;
    device.lastUpdated = new Date();
    
    toast("Device Disconnected", {
      description: `Disconnected from ${device.name}.`,
    });
    
    console.log(`Disconnected from device: ${device.name} (${id})`);
    return true;
  }
  
  public async sendCommand(command: DeviceCommand, options?: DeviceControlOptions): Promise<boolean> {
    const device = this.getDevice(command.deviceId);
    if (!device) {
      console.error(`Device ${command.deviceId} not found`);
      return false;
    }
    
    if (!device.connected) {
      console.error(`Device ${device.name} is not connected`);
      return false;
    }
    
    console.log(`Sending command to ${device.name}: ${command.action}`, command.parameters);
    
    // In a real implementation, this would use Bluetooth/WiFi APIs
    // For demo purposes, we'll simulate sending a command
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      // Update device data based on command
      this.updateDeviceState(device, command);
      
      if (!options?.silent) {
        toast("Command Sent", {
          description: `Successfully sent ${command.action} to ${device.name}.`,
        });
      }
      
      console.log(`Command ${command.action} sent successfully to ${device.name}`);
      return true;
    } else {
      if (!options?.silent) {
        toast("Command Failed", {
          description: `Failed to send ${command.action} to ${device.name}.`,
          variant: 'destructive',
        });
      }
      
      console.error(`Failed to send command ${command.action} to ${device.name}`);
      return false;
    }
  }
  
  private updateDeviceState(device: Device, command: DeviceCommand): void {
    switch (device.type) {
      case 'light':
        if (command.action === 'toggle') {
          device.data.state = device.data.state === 'on' ? 'off' : 'on';
        } else if (command.action === 'setBrightness' && command.parameters?.brightness !== undefined) {
          device.data.brightness = command.parameters.brightness;
        } else if (command.action === 'setColor' && command.parameters?.color !== undefined) {
          device.data.color = command.parameters.color;
        }
        break;
        
      case 'speaker':
        if (command.action === 'play') {
          device.data.state = 'playing';
        } else if (command.action === 'pause') {
          device.data.state = 'paused';
        } else if (command.action === 'stop') {
          device.data.state = 'idle';
        } else if (command.action === 'setVolume' && command.parameters?.volume !== undefined) {
          device.data.volume = command.parameters.volume;
        } else if (command.action === 'mute') {
          device.data.muted = true;
        } else if (command.action === 'unmute') {
          device.data.muted = false;
        }
        break;
        
      case 'camera':
        if (command.action === 'startStream') {
          device.data.streaming = true;
        } else if (command.action === 'stopStream') {
          device.data.streaming = false;
        } else if (command.action === 'startRecording') {
          device.data.recording = true;
        } else if (command.action === 'stopRecording') {
          device.data.recording = false;
        }
        break;
      
      // Add cases for other device types
    }
    
    device.lastUpdated = new Date();
  }
  
  // Bluetooth specific methods
  public async requestBluetoothDevice(): Promise<boolean> {
    if (!this.bluetoothSupported) {
      console.error('Bluetooth not supported on this device');
      toast("Bluetooth Error", {
        description: "Bluetooth is not supported on this device.",
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });
      
      console.log('Bluetooth device selected:', device.name);
      
      // In a real implementation, you would connect to the device and register it
      // For demo purposes, we'll just show a toast
      toast("Bluetooth Device", {
        description: `Selected device: ${device.name || 'Unknown device'}`,
      });
      
      return true;
    } catch (error) {
      console.error('Bluetooth device request error:', error);
      
      toast("Bluetooth Error", {
        description: "Failed to select a Bluetooth device.",
        variant: 'destructive',
      });
      
      return false;
    }
  }
  
  public isBluetoothSupported(): boolean {
    return this.bluetoothSupported;
  }
  
  public isWiFiDirectSupported(): boolean {
    return this.wifiDirectSupported;
  }
}

export const deviceControl = new DeviceControlService();

// Example usage:
// deviceControl.scanForDevices().then(devices => console.log(devices));
// deviceControl.sendCommand({ deviceId: 'light-001', action: 'toggle' });
