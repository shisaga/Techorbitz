declare module 'newsapi' {
  export class NewsAPI {
    constructor(apiKey: string);
    v2: {
      topHeadlines(options: {
        category?: string;
        language?: string;
        country?: string;
        pageSize?: number;
      }): Promise<{
        articles: Array<{
          title?: string;
          description?: string;
          url?: string;
        }>;
      }>;
    };
  }
}
