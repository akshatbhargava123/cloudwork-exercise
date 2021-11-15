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
    filter(isActionOf([workloadsActions.created, workloadsActions.cancel])),
    map(action => action.payload),
    tap((payload) => console.log('[epics.workload]', payload)),
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

const cancelWorkload: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.cancel)),
    switchMap(async action => {
      const { id } = action.payload;
      const { status: currentStatus } = await workloadService.checkStatus({ id });
      if (currentStatus === 'WORKING') {
        await workloadService.cancel({ id });
        return workloadsActions.updateStatus({ id, status: 'CANCELED' });
      }

      return workloadsActions.updateStatus({ id, status: currentStatus });
    }),
  )
);


export const epics = combineEpics(
  submitWorkload,
  cancelWorkload,
  logWorkloadSubmissions,
);

export default epics;
