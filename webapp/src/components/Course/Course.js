import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { isEmpty } from 'ramda';
import classNames from "classnames";
import courseModel from '../../models/CourseModel';
import { CourseForm } from "../Courses/Form/CourseForm";
import { LessonItem } from "./LessonItem";

import './Course.css';

@observer
class Course extends Component {

  state = {
    editTitleMode: false,
    editDescriptionMode: false,
    lessons: courseModel.sampleCourse ? courseModel.sampleCourse.lessons : [],
    title: "",
    description: ""
  };

  onTitleMode = () => {
    this.setState({editTitleMode: true});
  };

  offTitleMode = () => {
    this.setState({editTitleMode: false});
  };

  onDescriptionMode = () => {
    this.setState({editDescriptionMode: true});
  };

  offDescriptionMode = () => {
    this.setState({editDescriptionMode: false});
  };

  handleTitle = e => {
    e.preventDefault();
    this.setState({ title: e.target.value });
  };

  handleDescription = e => {
    e.preventDefault();
    this.setState({ description: e.target.value });
  };

  onRemoveLesson = lessonId => {
    this.setState({ lessons: this.state.lessons.filter(lesson => lesson.id !== lessonId)});
  };

  componentWillMount() {
    const { courseId } = this.props.match.params;
    courseModel.fetchSample(courseId).then(() => {
      if (courseModel.lessons.length === 0) {
        courseModel.fetchAll();
      }
    })
      .then(() => this.setState({
        lessons: courseModel.sampleCourse.lessons,
        title: courseModel.sampleCourse.title,
        description: courseModel.sampleCourse.description
      }));
  }

  renderLessonsList = () => {
    const { lessons } = this.state;
    return (
      <Fragment>
        <h3>Lessons</h3>
        <div className="form-group">
        {
          lessons &&
          lessons
            .map(lesson =>
                <LessonItem
                  lesson={lesson}
                  onRemove={this.onRemoveLesson}
                  onAdd={() => {}}
                />
            )
        }
        </div>
        </Fragment>
    );
  };

  getClasses = field => {
    const { sampleCourse } = courseModel;
    return classNames({
      'edited': this.state[field] !== sampleCourse[field]
    });
  };

  saveCourse = async (e) => {
    e.preventDefault();
    const { sampleCourse, sampleCourse: { id } } = courseModel;
    const { title, description, lessons } = this.state;
    const updatedCourse = {
      ...sampleCourse,
      title,
      description,
      lessons
    };
    await courseModel.save(updatedCourse);
    await courseModel.fetchSample(id);
  };

  render() {
    const course = courseModel.sampleCourse;
    const { editTitleMode, editDescriptionMode, title, description } = this.state;
    if (isEmpty(course)) {
      return (
        <div>Go to Courses list firstly to fetch the data!</div>
      );
    }
    return (
      <div className="container">
        <p>ID: #{course.id}</p>
        <p>Title:
          {
          editTitleMode ?
            <input type="text"
                   className="form-control"
                   id="titleInput" name="title"
                   onChange={this.handleTitle} value={this.state.title} onBlur={() => this.offTitleMode()} />
            :
            <Fragment>
              <span className={this.getClasses("title")}>{title}</span>
              <span className="edit-icon" onClick={this.onTitleMode}>&#x270E;</span>
            </Fragment>
        }
        </p>
        <p>Description:
          {
            editDescriptionMode ?
              <input type="text"
                     className="form-control"
                    id="descriptionInput" name="description"
                    onChange={this.handleDescription} value={this.state.description} onBlur={() => this.offDescriptionMode()} />
              :
              <Fragment>
                <span className={this.getClasses("description")}>{description}</span>
                <span className="edit-icon" onClick={this.onDescriptionMode}>&#x270E;</span>
              </Fragment>
          }
          </p>
        {this.renderLessonsList()}

        <button className="btn btn-success" onClick={this.saveCourse}>Save course</button>
        <button className="btn btn-danger" onClick={() => {}}>Delete course</button>
      </div>
    );
  }
}

export default Course;
