import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CkanService {
  private apiUrl = 'http://localhost:5500'; // Replace with your CKAN API URL

  constructor(private http: HttpClient) { }

  searchDatasets(query: string, start: number = 0, rows: number = 12): Observable<{ results: any[], count: number }> {
    const url = `${this.apiUrl}/api/action/package_search?q=${encodeURIComponent(query)}&start=${start}&rows=${rows}`;
    return this.http.get<any>(url).pipe(
      map(response => {

        const items = response.result.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.notes,
          modified: item.metadata_modified,
          organizationName: item.organization.title,
          publisher_name: item.publisher_name
        }));


        return {
          results: items,
          count: response.result.count
        };
      }),
      catchError(error => {
        console.error(error);
        return of({ results: [], count: 0 });
      })
    );
  }

  getSchemingPackageShow(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/action/scheming_package_show?type=dataset&id=${id}`);
  }
}

