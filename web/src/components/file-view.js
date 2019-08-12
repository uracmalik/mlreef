import React from "react";
import ProjectContainer from "./projectContainer";
import "../css/file-view.css";
import { connect } from "react-redux";
import * as fileActions from "../actions/fileActions";
import { bindActionCreators } from "redux";
import { Base64 } from "js-base64";
import Navbar from "./navbar/navbar";
import file_01 from "./../images/file_01.svg";
import arrow_blue from "./../images/arrow_down_blue_01.svg";

class FileView extends React.Component {
  componentDidMount() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var path = url.searchParams.get("path");

    if (path) {
      path = path.replace(/\//g, "%2F");
      path = path + "%2F" + this.props.match.params.file;
    } else {
      path = this.props.match.params.file;
    }

    this.props.actions.getFileData(path, this.props.match.params.branch);
  }

  render() {
    const projectName = this.props.project.name;
    const fileName = this.props.fileData.file_name;
    const fileSize = this.props.fileData.size;
    let fileContent = [];
    let filepath = [];
    let extension;
    if (this.props.fileData.content) {
      fileContent = Base64.decode(this.props.fileData.content).split("\n");
      extension = fileName.split(".").pop();
      filepath = this.props.fileData.file_path.split("/");
      console.log(filepath[0].file_path);
    }

    return (
      <div>
        <Navbar />
        <ProjectContainer
          project
          activeFeature="data"
          folders={["Group Name", projectName, "Data"]}
        />
        <div className="branch-path">
          <div className="branch-btn">
            <a href="#f00">
              <b>Sub-master</b>
              <img className="dropdown-white" src={arrow_blue} alt="" />
            </a>
          </div>
          <span className="filepath">
            <b>
              <a href="/home">{projectName}</a> /
              {filepath.map((path, i) => {
                return filepath.length === i + 1 ? (
                  <span>{path}</span>
                ) : (
                    <span>
                      <a href="#foo">{path} </a>/
                  </span>
                  );
              })}
            </b>
          </span>
        </div>
        <div className="commit-container">
          <div className="file-container-header">
            <div className="commit-info">
              <div className="commit-pic-circle" />
              <div className="commit-msg">
                <p>Commit message</p>
                <span>
                  by <b>user_name</b> authored <b>4</b> days ago
                </span>
              </div>
            </div>
            <div className="commit-code">
              <span>Commit code</span>
              <img className="file-icon" src={file_01} alt="" />
            </div>
          </div>
          <div className="contributors">
            <p>
              <b>3 Contributors</b>
            </p>
            <div className="contributor-list">
              <div className="commit-pic-circle" />
              <div className="commit-pic-circle" />
              <div className="commit-pic-circle" />
            </div>
          </div>
        </div>

        <div className="file-container">
          <div className="file-container-header">
            <div className="file-info">
              <p>
                {fileName} | {fileSize} Bytes
              </p>
            </div>
            <div className="wrapper">
              <div className="file-actions">
                <button className="white-button">History</button>
                <button className="white-button">Replace</button>
                <button className="red-button">Delete</button>
              </div>
            </div>
          </div>
          <div
            itemProp="text"
            className="Box-body p-0 blob-wrapper data type-text"
          >
            <div className="file-content">
              {extension === ("png" || "jpg" || "jpeg") ? (
                <div>
                  <img
                    className="file-img"
                    src={`data:image/png;base64,${this.props.fileData.content}`}
                    alt={fileName}
                  />
                </div>
              ) : (
                  <table>
                    <tbody>
                      {fileContent.map(function (line) {
                        return (
                          <tr>
                            <td>
                              <p>{line}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fileData: state.file,
    project: state.project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fileActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileView);
