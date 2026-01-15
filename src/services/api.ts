const API_BASE_URL = '/api';

interface GenerateNamesRequest {
  message: string;
}

interface GenerateNamesResponse {
  names?: string[];
  message?: string;
  [key: string]: any;
}

export const generateNames = async (message: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/names`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
      } as GenerateNamesRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GenerateNamesResponse = await response.json();

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.names && Array.isArray(data.names)) {
      return data.names;
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch names. Please try again.');
  }
};