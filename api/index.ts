// Vercel Serverless REST API Gateway Entry Point

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export default async function handler(req: any, res: any) {
  const { method, url } = req;
  const path = (url || '').split('?')[0];

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (path === '/api/health' || path === '/api') {
    return res.status(200).json({
      data: {
        status: 'online',
        service: 'ACE UiPath Community REST API Gateway',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Default endpoint fallback response
  return res.status(200).json({
    data: {
      message: 'ACE UiPath Community API Gateway Active',
      path,
      method
    }
  });
}
