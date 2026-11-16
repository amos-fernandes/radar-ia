import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3002', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgres://radar:radar@localhost:5433/radaria',
  llm: {
    apiKey: process.env.LLM_API_KEY || '',
    baseUrl: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
  },
  whatsappLeadNumber: process.env.WHATSAPP_LEAD_NUMBER || '5562981647087',
  cronSchedule: process.env.INGEST_CRON || '0 6,18 * * *',
  nodeEnv: process.env.NODE_ENV || 'development',
};
