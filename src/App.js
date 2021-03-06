import React, { Component } from 'react';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageFile: null,
      selectedAudioFile: null,
      surveyId: null,
      loadedImages: 0,
      loadedAudio: 0
    }

  }
  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'image/gif']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err[x] = files[x].type + ' is not a supported format\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  maxSelectFile = (event) => {
    let files = event.target.files
    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time'
      event.target.value = null
      toast.warn(msg)
      return false;
    }
    return true;
  }
  checkFileSize = (event) => {
    let files = event.target.files
    let size = 2000000
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  onChangeHandler = event => {
    var files = event.target.files
    // if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
    // if return true allow to setState
    this.setState({
      selectedImageFile: files,
      loadedImages: 0,
    })
    // }
  }
  onChangeHandlerAudio = event => {
    var files = event.target.files
    this.setState({
      selectedAudioFile: files,
      loadedAudio: 0
    })
  }
  onChangeHandlerSurveyNo = event => {
    var surveyId = event.target.value
    this.setState({
      surveyId: surveyId
    })
  }
  onClickHandler = () => {
    const data = new FormData()
    data.append('surveyId', this.state.surveyId)
    for (var x = 0; x < this.state.selectedImageFile.length; x++) {
      data.append('images', this.state.selectedImageFile[x])
    }
    for (var y = 0; y < this.state.selectedAudioFile.length; y++) {
      data.append('audio', this.state.selectedAudioFile[y])
    }
    axios.post("http://localhost:8000/upload", data, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loadedImages: (ProgressEvent.loaded / ProgressEvent.total * 100),
          loadedAudio: (ProgressEvent.loaded / ProgressEvent.total * 100),

        })
      },
    })
      .then(res => { // then print response status
        toast.success('upload success')
      })
      .catch(err => { // then print response status
        toast.error('upload fail')
      })
  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="offset-md-3 col-md-6">
            <div class="form-group">
              <label>Survey Id </label>
              <input type="text" class="form-control" onChange={this.onChangeHandlerSurveyNo} />
            </div>
            <div class="form-group files">
              <label>Upload Your Images </label>
              <input type="file" class="form-control" multiple onChange={this.onChangeHandler} />
            </div>
            <div class="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loadedImages} >{Math.round(this.state.loadedImages, 2)}%</Progress>
            </div>
            <div class="form-group files">
              <label>Upload Your Audio </label>
              <input type="file" class="form-control" multiple onChange={this.onChangeHandlerAudio} />
            </div>
            <div class="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loadedAudio} >{Math.round(this.state.loadedAudio, 2)}%</Progress>
            </div>


            <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
