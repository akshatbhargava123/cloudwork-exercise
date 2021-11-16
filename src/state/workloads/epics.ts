import { combineEpics, Epic } from 'redux-observable';
import { timer } from 'rxjs';
import { filter, map, tap, ignoreElements, delay, mergeMap, takeWhile, delayWhen } from 'rxjs/operators';
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
    mergeMap(async action => {
      const newWorkload = await workloadService.create({ complexity: action.payload.complexity });
      return workloadsActions.created(newWorkload);
    })
  )
);

const cancelWorkload: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.cancel)),
    mergeMap(async action => {
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

const scheduleWorkloadUpdate: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.created)),
    map(action => action.payload),
    delayWhen(payload => timer(payload.completeDate)),
    takeWhile(value => state$.value.workloads[value.id].status === 'WORKING'),
    delay(100),
    map(payload => payload.id),
    mergeMap(async (workloadId) => {
      const workload = await workloadService.checkStatus({ id: workloadId });
      return workloadsActions.updateStatus(workload);
    }),
  )
)

export const epics = combineEpics(
  submitWorkload,
  cancelWorkload,
  logWorkloadSubmissions,
  scheduleWorkloadUpdate,
);

export default epics;
