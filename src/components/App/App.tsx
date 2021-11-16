import React, { PureComponent } from 'react';

import { WorkloadListContainer } from '../WorkloadList';
import { WorkloadFormContainer } from '../WorkloadForm';
import './App.css';


class App extends PureComponent {
  render() {
    return (
      <div className="max-w-screen-md mx-auto mt-20 text-purple-700">
        <h1 className="mb-10  pb-2 text-4xl font-bold border-b-2 border-purple-700">CloudWork</h1>

        <h2 className="text-2xl font-semibold mb-4">Workloads</h2>

        <div className="flex justify-between">
          <div className="w-2/3">
            <WorkloadListContainer />
          </div>
          <div>
            <WorkloadFormContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
