import React from 'react';
import TimeAgo from 'react-timeago';
import { Status } from '../../state/workloads'


export interface WorkloadItemStateProps {
  id: number;
  complexity: number;
  status: Status;
  completeDate: Date;
}

export interface WorkloadItemMethodProps {
  onCancel: () => void;
}

export interface WorkloadItemProps extends 
  WorkloadItemStateProps,
  WorkloadItemMethodProps {}


const WorkloadItem: React.SFC<WorkloadItemProps> = (props) => (
  <div className="p-5 mb-4 border w-full border-purple-700 flex items-center justify-between">
    <div className="flex flex-col">
      <h3 className="text-2xl font-semibold">Workload #{props.id}</h3>
      <span className="text-lg">Complexity: {props.complexity}</span>
    </div>
    <div>
      {props.status === 'WORKING'
        ? (
          <div className="flex items-end space-x-2">
            <span><TimeAgo date={props.completeDate} /></span>
            <button 
              className="bg-purple-300 text-purple-700 font-semibold px-3 py-2" 
              onClick={props.onCancel}
            >
              Cancel
            </button>
          </div>
        )
        : (
          <p className="font-bold">{props.status.toLowerCase()}</p>
        )
      }
    </div>
  </div>
);


export { 
  WorkloadItem,
};

export default WorkloadItem;