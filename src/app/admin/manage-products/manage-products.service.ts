import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        })
      )
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    const apiUrl: string = this.getUrl('import', `import/${fileName}`);

    const authToken = localStorage.getItem('authorization_token') as string;

    return this.http
      .get<{ url: string }>(apiUrl, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: authToken ?? '',
        },
      })
      .pipe(map(({ url }: { url: string }) => url));
  }
}
