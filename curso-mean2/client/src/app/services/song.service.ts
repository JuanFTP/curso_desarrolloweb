import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { Song } from '../models/song';

@Injectable()
export class SongService {
	public url: string;

	public constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	public addSong(token: string, song: Song) {
		let params = JSON.stringify(song);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.post(this.url+'song', params, {headers: headers})
		.pipe(map(res => res));
	}

	public getSong(token: string, id: string) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.get(this.url+'song/'+id, {headers: headers})
		.pipe(map(res => res));
	}

	public editSong(token: string, id: string, song: Song) {
		let params = JSON.stringify(song);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.put(this.url+'song/'+id, params, { headers: headers })
		.pipe(map(res => res));
	}
}