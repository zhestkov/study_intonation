import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import classNames from "classnames";
import { PulseLoader } from "halogenium";
import { FragmentItem } from "./FragmentItem";
import { FragmentModel } from "../../models/FragmentModel";
import taskModel from '../../models/TaskModel';

import './Task.css';

@observer
class Task extends Component {

  state = {
    editTextMode: false,
    editInstructionMode: false,
    text: "",
    instruction: "",
    fragments: [],
    audio: {}
  };

  async componentWillMount() {
    const { taskId } = this.props.match.params;
    await taskModel.fetchSample(taskId);
    const { text, instruction, markups } = taskModel.sampleTask;
    this.setState({
      text,
      instruction,
      fragments: markups ? markups.map(f => new FragmentModel(f)) : []
    });
    // this.setState({ fragments: mockedFragments.map(f => new FragmentModel(f))});
  }

  toggleTextMode = () => {
    this.setState({ editTextMode: !this.state.editTextMode });
  };

  toggleInstructionMode = () => {
    this.setState({ editInstructionMode: !this.state.editInstructionMode });
  };


  onChangeText = e => {
    e.preventDefault();
    this.setState({ text: e.target.value });
  };

  onChangeInstruction = e => {
    e.preventDefault();
    this.setState({ instruction: e.target.value });
  };

  getClasses = field => {
    const { sampleTask } = taskModel;
    return classNames({
      'edited': this.state[field] !== sampleTask[field]
    });
  };

  saveTask = async (e) => {
    e.preventDefault();
    const { text, instruction, fragments } = this.state;
    const { sampleTask, sampleTask: { id } } = taskModel;
    const markups = [];
    fragments.forEach(f => {
      const { fragment, start, stop, catchWord } = f;
      markups.push({fragment, start, stop, catchword: catchWord});
    });

    const updatedTask = {
        ...sampleTask,
      text,
      instruction,
      markups
    };
    await taskModel.save(updatedTask);
    await taskModel.fetchSample(id);
    this.updateStateAfterSave();
  };

  updateStateAfterSave = () => {
    const { text, instruction, markups } = taskModel.sampleTask;
    this.setState({
      text,
      instruction,
      fragments: markups || []
    });
  };

  addFragment = e => {
    e.preventDefault();
    const { fragments } = this.state;
    this.setState({
      fragments: [...fragments, new FragmentModel({id: Date.now()/1000})]
    });
  };

  deleteTask = async (e) => {
    e.preventDefault();

  };

  renderFragmentForm = model => {
    return (
      <Fragment>
        <hr/>
        <div className="form-wrapper">
          <form>
            <FragmentItem model={model}/>
          </form>
        </div>
      </Fragment>
    )
  };

  renderFragments = () => {
    const { fragments } = this.state;
    return (
      <div className="fragments-wrapper">
        {fragments.map(fragment => this.renderFragmentForm(fragment))}
      </div>
    );
  };

  render() {
    const {
      editTextMode,
      editInstructionMode,
      text,
      instruction,
    } = this.state;

    return (
      <div className="container">
        {
          taskModel.isLoading && <PulseLoader className="spinner" color="#26A65B" size="20px" margin="4px"/>
        }

        <p><span className="header">Text:</span>
          {
            editTextMode ?
              <input type="text"
                     className="form-control"
                     id="textInput" name="text"
                     onChange={this.onChangeText} value={text} onBlur={() => this.toggleTextMode()} />
              :
              <Fragment>
                <span className={this.getClasses("text")}>{text}</span>
                <span className="edit-icon" onClick={this.toggleTextMode}>&#x270E;</span>
              </Fragment>
          }
        </p>

        <p><span className="header">Instruction:</span>
          {
            editInstructionMode ?
              <input type="text"
                     className="form-control"
                     id="instructionInput" name="instruction"
                     onChange={this.onChangeInstruction} value={instruction} onBlur={() => this.toggleInstructionMode()} />
              :
              <Fragment>
                <span className={this.getClasses("instruction")}>{instruction}</span>
                <span className="edit-icon" onClick={this.toggleInstructionMode}>&#x270E;</span>
              </Fragment>
          }
        </p>

        {this.renderFragments()}

        <button className="btn btn-success" onClick={this.addFragment}>Add fragment</button>
        <button className="btn btn-success" onClick={this.saveTask}>Save task</button>
        <button className="btn btn-primary" onClick={this.addAudio}>Add audio</button>
      </div>
    );
  }
}

export default Task;
