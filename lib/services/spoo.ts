import { getEnvConfig } from '@/lib/config/env';

const env = getEnvConfig();

export interface SpooShortenResponse {
  success: boolean;
  short_code?: string;
  error?: string;
}

export interface SpooStatsResponse {
  success: boolean;
  total_clicks?: number;
  error?: string;
}

/**
 * Shortens a URL using the Spoo.me API
 * @param url - The original URL to shorten
 * @returns Promise<SpooShortenResponse>
 */
export async function shortenUrl(url: string): Promise<SpooShortenResponse> {
  try {
    const response = await fetch('https://spoo.me/api/v1/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.SPOO_ME_API_KEY}`,
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    if (!response.ok) {
      throw new Error(`Spoo.me API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.short_code) {
      return {
        success: true,
        short_code: data.short_code,
      };
    } else {
      return {
        success: false,
        error: data.error || 'Unknown error from Spoo.me API',
      };
    }
  } catch (error) {
    console.error('Error shortening URL with Spoo.me:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to shorten URL',
    };
  }
}

/**
 * Gets click statistics for a Spoo.me short code
 * @param shortCode - The Spoo.me short code
 * @returns Promise<SpooStatsResponse>
 */
export async function getSpooStats(shortCode: string): Promise<SpooStatsResponse> {
  try {
    const response = await fetch(`https://spoo.me/api/v1/stats/${shortCode}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${env.SPOO_ME_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spoo.me API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && typeof data.total_clicks === 'number') {
      return {
        success: true,
        total_clicks: data.total_clicks,
      };
    } else {
      return {
        success: false,
        error: data.error || 'Unknown error from Spoo.me API',
      };
    }
  } catch (error) {
    console.error('Error fetching Spoo.me stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
    };
  }
}