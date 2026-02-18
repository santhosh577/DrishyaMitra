export interface PhotoMetadata {
  objects: string[];
  faces: string[];
  scene: string;
  text: string;
  location?: string;
  timestamp: string;
  isSensitive: boolean;
  riskReason?: string;
  riskClassification?: string;
  dominantEmotion: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Photo {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  metadata?: PhotoMetadata;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
}

export interface MemoryAlbum {
  id: string;
  title: string;
  description: string;
  photoIds: string[];
  category: 'event' | 'timeline' | 'emotion' | 'privacy';
  coverPhotoUrl: string;
}

export interface AgentLog {
  id: string;
  agentName: string;
  message: string;
  timestamp: string;
  type: 'info' | 'alert' | 'success';
}

export interface AppState {
  photos: Photo[];
  albums: MemoryAlbum[];
  logs: AgentLog[];
  isOrchestrating: boolean;
  searchQuery: string;
}