import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { submit } from '../../state/workloads/actions';


interface WorkloadFormDispatchProps {
  submitWorkload: (complexity: number) => void  
}

interface WorkloadFormProps extends 
  WorkloadFormDispatchProps {}

interface WorkloadFormState {
  complexity: number;
}

class WorkloadForm extends React.PureComponent<WorkloadFormProps, WorkloadFormState> {
  defaultState = {
    complexity: 5,
  }

  state = this.defaultState;

  handleSubmit = (e: React.MouseEvent) => {
    this.props.submitWorkload(this.state.complexity);
    this.setState(this.defaultState);
    e.preventDefault();
  }

  render() {
    return (
      <form className="border border-purple-700 p-5">
        <h2 className="text-2xl font-semibold">Create workload</h2>
        
        <div className="my-3">
          <label className="text-sm">
            Complexity: {this.state.complexity}
            <br />
            <input 
              className="mt-2 cursor-move"
              value={this.state.complexity} 
              onChange={(e) => this.setState({ complexity: Number(e.target.value) })} 
              type="range" 
              min="1" 
              max="10" 
            />
          </label>
        </div>

        <div>
          <button className="bg-purple-700 text-white font-semibold px-5 py-2" onClick={this.handleSubmit} type="submit">Start work</button>
        </div>
      </form>
    );
  }
}


const mapDispatchToProps = (dispatch: Dispatch): WorkloadFormDispatchProps => ({
  submitWorkload: (complexity: number) => dispatch(submit({ complexity })),
});

const WorkloadFormContainer = connect(null, mapDispatchToProps)(WorkloadForm);


export {
  WorkloadForm,
  WorkloadFormContainer,
}

export default WorkloadForm;