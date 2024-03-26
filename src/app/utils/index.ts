import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { StatusParams } from './interfaces';

function filterObjectParams(params: Params) {
  return Object.keys(params)
    .filter((key) => params[key] === 'true' || params[key] === 'false')
    .reduce<Params>((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});
}

export function modifyQueryParams(queryParams: Observable<Params>) {
  return queryParams.pipe(
    map((params) => {
      const paramsObj = { ...filterObjectParams(params) };
      return paramsObj as StatusParams;
    })
  );
}
export function StatusTypes() {
  return [{status:'paid',id:1},{status:'pending',id:2},{status:'partial',id:3}];
}