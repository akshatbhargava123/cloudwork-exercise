import { combineEpics, Epic } from 'redux-observable';
import { filter, map, tap, ignoreElements, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { RootAction, RootState } from '../reducer';
import * as workloadsActions from './actions';
import { WorkloadService } from './services';

type AppEpic = Epic<RootAction, RootAction, RootState>;

const workloadService = new WorkloadService();

const logWorkloadSubmissions: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    map(action => action.payload),
    tap((payload) => console.log('Workload submitted', payload)),
    ignoreElements(),
  )
);

const submitWorkload: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    switchMap(async action => {
      const newWorkload = await workloadService.create({ complexity: action.payload.complexity });
      return workloadsActions.created(newWorkload);
    })
  )
);


export const epics = combineEpics(
  submitWorkload,
  logWorkloadSubmissions,
);

export default epics;
