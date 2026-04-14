import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface YoutubeOEmbedResponse {
  title: string;
  author_name: string;
}

@Injectable({ providedIn: 'root' })
export class YoutubeMetadataService {
  private readonly http = inject(HttpClient);

  async getVideoMetadata(url: string): Promise<YoutubeOEmbedResponse | null> {
    try {
      return await firstValueFrom(
        this.http.get<YoutubeOEmbedResponse>('https://www.youtube.com/oembed', {
          params: {
            url,
            format: 'json'
          }
        })
      );
    } catch {
      return null;
    }
  }
}
